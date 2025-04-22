#!/bin/bash

# Script to set up the PostgreSQL database for the Compliance Classifier application

# PostgreSQL connection details
PG_HOST="192.168.1.106"
PG_PORT="5432"
PG_DB="comp-filer"
PG_USER="vault66admin"
PG_PASSWORD="sQ63370"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up PostgreSQL database for Compliance Classifier...${NC}"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql command not found. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

# Set PGPASSWORD environment variable to avoid password prompt
export PGPASSWORD="$PG_PASSWORD"

# Check if the database exists
echo -e "${YELLOW}Checking if database exists...${NC}"
if ! psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -lqt | cut -d \| -f 1 | grep -qw "$PG_DB"; then
    echo -e "${YELLOW}Database '$PG_DB' does not exist. Creating...${NC}"
    if psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -c "CREATE DATABASE \"$PG_DB\""; then
        echo -e "${GREEN}Database created successfully.${NC}"
    else
        echo -e "${RED}Failed to create database.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}Database '$PG_DB' already exists.${NC}"
fi

# Execute the SQL script
echo -e "${YELLOW}Creating database tables...${NC}"
if psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -f "create_database_tables.sql"; then
    echo -e "${GREEN}Database tables created successfully.${NC}"
else
    echo -e "${RED}Failed to create database tables.${NC}"
    exit 1
fi

# Verify tables were created
echo -e "${YELLOW}Verifying tables...${NC}"
TABLES=("Users" "UserPasswords" "RefreshTokens" "Batches" "Documents" "DocumentMetadata" "Classifications" "Reports")
ALL_TABLES_EXIST=true

for TABLE in "${TABLES[@]}"; do
    if psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${TABLE,,}');" -t | grep -q 't'; then
        echo -e "${GREEN}Table '$TABLE' exists.${NC}"
    else
        echo -e "${RED}Table '$TABLE' does not exist!${NC}"
        ALL_TABLES_EXIST=false
    fi
done

# Create a test batch
if [ "$ALL_TABLES_EXIST" = true ]; then
    echo -e "${YELLOW}Creating a test batch...${NC}"
    BATCH_ID=$(uuidgen)
    if psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "INSERT INTO \"Batches\" (\"BatchId\", \"UploadDate\", \"UserId\", \"Status\", \"TotalDocuments\", \"ProcessedDocuments\") VALUES ('$BATCH_ID', CURRENT_TIMESTAMP, 'test-user', 'Pending', 0, 0);" > /dev/null; then
        echo -e "${GREEN}Test batch created successfully with ID: $BATCH_ID${NC}"
        
        # Verify the batch was created
        echo -e "${YELLOW}Verifying batch creation...${NC}"
        if psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "SELECT \"BatchId\", \"UserId\", \"Status\" FROM \"Batches\" WHERE \"BatchId\" = '$BATCH_ID';" -t | grep -q "$BATCH_ID"; then
            echo -e "${GREEN}Batch verification successful.${NC}"
        else
            echo -e "${RED}Batch verification failed!${NC}"
        fi
    else
        echo -e "${RED}Failed to create test batch!${NC}"
    fi
fi

# Clean up
unset PGPASSWORD

echo -e "${GREEN}Database setup completed.${NC}"