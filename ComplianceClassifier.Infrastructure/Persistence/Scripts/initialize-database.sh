#!/bin/bash
# Initialize Database Script for Compliance Classifier
# This script creates the PostgreSQL database and applies the initial schema

# Default connection parameters
HOST="localhost"
PORT="5432"
DB_NAME="comp-filer"
USERNAME="postgres"
PASSWORD="postgres"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --host)
      HOST="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --db)
      DB_NAME="$2"
      shift 2
      ;;
    --user)
      USERNAME="$2"
      shift 2
      ;;
    --password)
      PASSWORD="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if PostgreSQL command-line tools are available
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL command-line tools not found. Please install PostgreSQL and ensure 'psql' is in your PATH."
    exit 1
fi

echo "PostgreSQL client found: $(psql --version)"

# Set environment variables for PostgreSQL connection
export PGHOST="$HOST"
export PGPORT="$PORT"
export PGUSER="$USERNAME"
export PGPASSWORD="$PASSWORD"

# Check if the database exists
echo "Checking if database '$DB_NAME' exists..."
DB_EXISTS=$(psql -t -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" postgres)

if [[ $DB_EXISTS == *"1"* ]]; then
    echo "Database '$DB_NAME' already exists."
else
    echo "Creating database '$DB_NAME'..."
    psql -c "CREATE DATABASE \"$DB_NAME\"" postgres
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create database."
        exit 1
    fi
    
    echo "Database created successfully."
fi

# Apply the SQL schema
echo "Applying database schema..."
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
SCHEMA_PATH="$SCRIPT_DIR/../Migrations/InitialCreate.sql"

if [ -f "$SCHEMA_PATH" ]; then
    psql -d "$DB_NAME" -f "$SCHEMA_PATH"
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to apply database schema."
        exit 1
    fi
    
    echo "Database schema applied successfully."
else
    echo "Error: Schema script not found at: $SCHEMA_PATH"
    exit 1
fi

echo "Database initialization completed successfully."