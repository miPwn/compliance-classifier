<#
.SYNOPSIS
    Sets up the PostgreSQL database for the Compliance Classifier application.
.DESCRIPTION
    This script creates the necessary tables in the PostgreSQL database and verifies they exist.
    It also creates a test batch and verifies it was created successfully.
.NOTES
    Requires the PostgreSQL command-line tools (psql) to be installed and in the PATH.
#>

# PostgreSQL connection details
$PG_HOST = "192.168.1.106"
$PG_PORT = "5432"
$PG_DB = "comp-filer"
$PG_USER = "vault66admin"
$PG_PASSWORD = "sQ63370"

# Function to execute PostgreSQL commands
function Invoke-PostgreSQL {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Command,
        
        [Parameter(Mandatory=$false)]
        [string]$Database = $PG_DB
    )
    
    $env:PGPASSWORD = $PG_PASSWORD
    $result = $null
    
    try {
        if ($Database) {
            $result = psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $Database -c $Command -t
        } else {
            $result = psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c $Command -t
        }
    }
    catch {
        Write-Error "Error executing PostgreSQL command: $_"
    }
    finally {
        $env:PGPASSWORD = $null
    }
    
    return $result
}

# Function to execute a SQL file
function Invoke-PostgreSQLFile {
    param (
        [Parameter(Mandatory=$true)]
        [string]$FilePath,
        
        [Parameter(Mandatory=$false)]
        [string]$Database = $PG_DB
    )
    
    $env:PGPASSWORD = $PG_PASSWORD
    $result = $null
    
    try {
        if ($Database) {
            $result = psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $Database -f $FilePath
        } else {
            $result = psql -h $PG_HOST -p $PG_PORT -U $PG_USER -f $FilePath
        }
    }
    catch {
        Write-Error "Error executing PostgreSQL file: $_"
    }
    finally {
        $env:PGPASSWORD = $null
    }
    
    return $result
}

# Check if psql is installed
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Host "PostgreSQL client tools are installed." -ForegroundColor Green
}
catch {
    Write-Host "Error: PostgreSQL client tools (psql) are not installed or not in the PATH." -ForegroundColor Red
    Write-Host "Please install PostgreSQL client tools and try again." -ForegroundColor Red
    exit 1
}

# Check if the database exists
Write-Host "Checking if database exists..." -ForegroundColor Yellow
$databaseExists = Invoke-PostgreSQL -Command "SELECT 1 FROM pg_database WHERE datname = '$PG_DB';" -Database "postgres"

if (-not $databaseExists) {
    Write-Host "Database '$PG_DB' does not exist. Creating..." -ForegroundColor Yellow
    $result = Invoke-PostgreSQL -Command "CREATE DATABASE ""$PG_DB"";" -Database "postgres"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully." -ForegroundColor Green
    } else {
        Write-Host "Failed to create database." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Database '$PG_DB' already exists." -ForegroundColor Green
}

# Execute the SQL script
Write-Host "Creating database tables..." -ForegroundColor Yellow
$scriptPath = Join-Path -Path $PSScriptRoot -ChildPath "create_database_tables.sql"

if (-not (Test-Path $scriptPath)) {
    Write-Host "Error: SQL script not found at path: $scriptPath" -ForegroundColor Red
    exit 1
}

$result = Invoke-PostgreSQLFile -FilePath $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database tables created successfully." -ForegroundColor Green
} else {
    Write-Host "Failed to create database tables." -ForegroundColor Red
    exit 1
}

# Verify tables were created
Write-Host "Verifying tables..." -ForegroundColor Yellow
$tables = @("Users", "UserPasswords", "RefreshTokens", "Batches", "Documents", "DocumentMetadata", "Classifications", "Reports")
$allTablesExist = $true

foreach ($table in $tables) {
    $tableExists = Invoke-PostgreSQL -Command "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table.ToLower()}');"
    
    if ($tableExists -match "t") {
        Write-Host "Table '$table' exists." -ForegroundColor Green
    } else {
        Write-Host "Table '$table' does not exist!" -ForegroundColor Red
        $allTablesExist = $false
    }
}

# Create a test batch
if ($allTablesExist) {
    Write-Host "Creating a test batch..." -ForegroundColor Yellow
    $batchId = [guid]::NewGuid().ToString()
    
    $result = Invoke-PostgreSQL -Command "INSERT INTO ""Batches"" (""BatchId"", ""UploadDate"", ""UserId"", ""Status"", ""TotalDocuments"", ""ProcessedDocuments"") VALUES ('$batchId', CURRENT_TIMESTAMP, 'test-user', 'Pending', 0, 0);"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Test batch created successfully with ID: $batchId" -ForegroundColor Green
        
        # Verify the batch was created
        Write-Host "Verifying batch creation..." -ForegroundColor Yellow
        $batchExists = Invoke-PostgreSQL -Command "SELECT ""BatchId"", ""UserId"", ""Status"" FROM ""Batches"" WHERE ""BatchId"" = '$batchId';"
        
        if ($batchExists -match $batchId) {
            Write-Host "Batch verification successful." -ForegroundColor Green
        } else {
            Write-Host "Batch verification failed!" -ForegroundColor Red
        }
    } else {
        Write-Host "Failed to create test batch!" -ForegroundColor Red
    }
}

Write-Host "Database setup completed." -ForegroundColor Green