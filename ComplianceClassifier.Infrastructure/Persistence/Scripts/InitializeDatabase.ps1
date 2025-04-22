# Initialize Database Script for Compliance Classifier
# This script creates the PostgreSQL database and applies the initial schema

param (
    [string]$Host = "localhost",
    [string]$Port = "5432",
    [string]$Database = "comp-filer",
    [string]$Username = "postgres",
    [string]$Password = "postgres"
)

# Ensure the PostgreSQL command-line tools are available
try {
    $psqlVersion = psql --version
    Write-Host "PostgreSQL client found: $psqlVersion"
}
catch {
    Write-Error "PostgreSQL command-line tools not found. Please install PostgreSQL and ensure 'psql' is in your PATH."
    exit 1
}

# Set environment variables for PostgreSQL connection
$env:PGHOST = $Host
$env:PGPORT = $Port
$env:PGUSER = $Username
$env:PGPASSWORD = $Password

# Check if the database exists
Write-Host "Checking if database '$Database' exists..."
$databaseExists = psql -t -c "SELECT 1 FROM pg_database WHERE datname = '$Database'" postgres

if ($databaseExists -match "1") {
    Write-Host "Database '$Database' already exists."
}
else {
    Write-Host "Creating database '$Database'..."
    psql -c "CREATE DATABASE \"$Database\"" postgres
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create database."
        exit 1
    }
    
    Write-Host "Database created successfully."
}

# Apply the SQL schema
Write-Host "Applying database schema..."
$scriptPath = Join-Path $PSScriptRoot "..\Migrations\InitialCreate.sql"

if (Test-Path $scriptPath) {
    psql -d $Database -f $scriptPath
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to apply database schema."
        exit 1
    }
    
    Write-Host "Database schema applied successfully."
}
else {
    Write-Error "Schema script not found at: $scriptPath"
    exit 1
}

Write-Host "Database initialization completed successfully."