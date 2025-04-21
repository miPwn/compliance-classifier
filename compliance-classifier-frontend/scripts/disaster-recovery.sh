#!/bin/bash
# Disaster Recovery script for Compliance Classifier Frontend

# Exit on error
set -e

# Configuration
BACKUP_DIR="/backups"
RESTORE_DIR="/restore"
LOG_FILE="${RESTORE_DIR}/recovery-$(date +"%Y%m%d_%H%M%S").log"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Error: No backup file specified"
    echo "Usage: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE="$1"

# Ensure backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file ${BACKUP_FILE} not found"
    exit 1
fi

# Ensure restore directory exists
mkdir -p ${RESTORE_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1

echo "Starting disaster recovery at $(date)"
echo "Using backup file: ${BACKUP_FILE}"

# Create temporary directory for extraction
TEMP_DIR=$(mktemp -d)

# Extract backup archive
echo "Extracting backup archive..."
tar -xzf ${BACKUP_FILE} -C ${TEMP_DIR}

# Restore configuration files
echo "Restoring configuration files..."
cp ${TEMP_DIR}/config/docker-compose.yml ./docker-compose.yml
cp ${TEMP_DIR}/config/docker-compose.prod.yml ./docker-compose.prod.yml
cp ${TEMP_DIR}/config/.env ./.env

# Restore Kubernetes manifests
echo "Restoring Kubernetes manifests..."
cp -r ${TEMP_DIR}/config/k8s ./

# Restore monitoring configurations
echo "Restoring monitoring configurations..."
cp -r ${TEMP_DIR}/config/monitoring ./

# Restore database if SQL dump exists
if [ -f "${TEMP_DIR}/data/database.sql" ]; then
    echo "Restoring database..."
    
    # For Kubernetes deployment
    if command -v kubectl &> /dev/null; then
        echo "Restoring database using kubectl..."
        cat ${TEMP_DIR}/data/database.sql | kubectl exec -i -n compliance-classifier-production deploy/db -- bash -c "PGPASSWORD=\$POSTGRES_PASSWORD psql -U postgres -d compliance_classifier"
    # For Docker Compose deployment
    elif command -v docker-compose &> /dev/null; then
        echo "Restoring database using docker-compose..."
        cat ${TEMP_DIR}/data/database.sql | docker-compose exec -T db bash -c "PGPASSWORD=\$POSTGRES_PASSWORD psql -U postgres -d compliance_classifier"
    else
        echo "Neither kubectl nor docker-compose found, skipping database restore"
    fi
fi

# Cleanup temporary directory
rm -rf ${TEMP_DIR}

echo "Redeploying services..."

# For Kubernetes deployment
if command -v kubectl &> /dev/null; then
    echo "Redeploying using kubectl..."
    kubectl apply -k k8s/overlays/production
    kubectl rollout restart deployment -n compliance-classifier-production frontend
    kubectl rollout status deployment -n compliance-classifier-production frontend --timeout=300s
# For Docker Compose deployment
elif command -v docker-compose &> /dev/null; then
    echo "Redeploying using docker-compose..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d
else
    echo "Neither kubectl nor docker-compose found, manual redeployment required"
fi

echo "Disaster recovery completed at $(date)"
echo "Recovery log saved to ${LOG_FILE}"

# Verify deployment
echo "Verifying deployment..."
if command -v kubectl &> /dev/null; then
    kubectl get pods -n compliance-classifier-production
elif command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.prod.yml ps
fi

echo "Disaster recovery process completed successfully"
echo "Please verify the application is functioning correctly"