#!/bin/bash
# Backup script for Compliance Classifier Frontend

# Exit on error
set -e

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/compliance-classifier-backup-${TIMESTAMP}.tar.gz"
LOG_FILE="${BACKUP_DIR}/backup-${TIMESTAMP}.log"

# Ensure backup directory exists
mkdir -p ${BACKUP_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1

echo "Starting backup at $(date)"

# Create directories to store temporary backup files
TEMP_DIR=$(mktemp -d)
mkdir -p ${TEMP_DIR}/config
mkdir -p ${TEMP_DIR}/data

# Backup Docker Compose files
echo "Backing up Docker Compose files..."
cp docker-compose.yml ${TEMP_DIR}/config/
cp docker-compose.prod.yml ${TEMP_DIR}/config/
cp .env ${TEMP_DIR}/config/

# Backup Kubernetes manifests
echo "Backing up Kubernetes manifests..."
cp -r k8s ${TEMP_DIR}/config/

# Backup monitoring configurations
echo "Backing up monitoring configurations..."
cp -r monitoring ${TEMP_DIR}/config/

# Backup database (using kubectl exec to run pg_dump)
if command -v kubectl &> /dev/null; then
    echo "Backing up database using kubectl..."
    kubectl exec -n compliance-classifier-production deploy/db -- bash -c "PGPASSWORD=\$POSTGRES_PASSWORD pg_dump -U postgres -d compliance_classifier" > ${TEMP_DIR}/data/database.sql
else
    echo "kubectl not found, skipping database backup"
fi

# Create compressed archive
echo "Creating compressed archive..."
tar -czf ${BACKUP_FILE} -C ${TEMP_DIR} .

# Cleanup temporary directory
rm -rf ${TEMP_DIR}

# Set appropriate permissions
chmod 600 ${BACKUP_FILE}

echo "Backup completed at $(date)"
echo "Backup saved to ${BACKUP_FILE}"

# Optional: Upload to cloud storage
if command -v aws &> /dev/null; then
    echo "Uploading backup to S3..."
    aws s3 cp ${BACKUP_FILE} s3://compliance-classifier-backups/
    echo "Upload completed"
fi

# Rotate old backups (keep last 7 daily, 4 weekly, and 3 monthly backups)
echo "Rotating old backups..."
find ${BACKUP_DIR} -name "compliance-classifier-backup-*.tar.gz" -type f -mtime +7 -not -name "*_weekly.tar.gz" -not -name "*_monthly.tar.gz" -delete
find ${BACKUP_DIR} -name "compliance-classifier-backup-*_weekly.tar.gz" -type f -mtime +28 -delete
find ${BACKUP_DIR} -name "compliance-classifier-backup-*_monthly.tar.gz" -type f -mtime +90 -delete

echo "Backup process completed successfully"