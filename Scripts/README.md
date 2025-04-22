# Database Setup and Testing Scripts

This directory contains scripts to set up and test the PostgreSQL database for the Compliance Classifier application.

## Issue Resolution

These scripts address the following issues:
1. Missing tables in the comp-filer PostgreSQL database
2. Inability to create batches due to missing database tables
3. Insufficient error logging in the frontend batch creation component

## Scripts Overview

### 1. `create_database_tables.sql`

This SQL script creates all the necessary tables in the PostgreSQL database:
- Users
- UserPasswords
- RefreshTokens
- Batches
- Documents
- DocumentMetadata
- Classifications
- Reports

It also creates the required enum types, indexes, and constraints.

### 2. `TestDatabaseConnection.cs`

This C# script tests the database connection and verifies that:
- The connection to the PostgreSQL database works
- All required tables exist
- A test batch can be created successfully
- The created batch can be retrieved from the database

### 3. `RunDatabaseTest.bat`

This batch file compiles and runs the `TestDatabaseConnection.cs` script. It:
- Creates a temporary .NET project
- Adds the required Npgsql package
- Copies the test script to the project
- Builds and runs the project
- Cleans up temporary files

### 4. `setup_database.sh`

This shell script for Linux/macOS users:
- Checks if the database exists and creates it if needed
- Executes the SQL script to create all tables
- Verifies that all tables were created successfully
- Creates a test batch and verifies it was created correctly

### 5. `Setup-Database.ps1`

This PowerShell script for Windows users:
- Checks if the database exists and creates it if needed
- Executes the SQL script to create all tables
- Verifies that all tables were created successfully
- Creates a test batch and verifies it was created correctly

## Usage Instructions

### Step 1: Create Database Tables

#### Windows Users

1. Connect to your PostgreSQL server using a client like pgAdmin or psql:
   ```
   psql -h 192.168.1.106 -p 5432 -U vault66admin -d comp-filer
   ```

2. Execute the SQL script:
   ```
   \i /path/to/create_database_tables.sql
   ```

   Alternatively, you can run the script using pgAdmin by opening it and clicking the "Execute" button.

3. **Using PowerShell**:
   ```
   .\Setup-Database.ps1
   ```

   This PowerShell script will:
   - Check if the database exists and create it if needed
   - Execute the SQL script to create all tables
   - Verify all tables were created
   - Create and verify a test batch

#### Linux/macOS Users

1. Make the shell script executable:
   ```
   chmod +x setup_database.sh
   ```

2. Run the script:
   ```
   ./setup_database.sh
   ```

   This script will:
   - Check if the database exists and create it if needed
   - Execute the SQL script to create all tables
   - Verify all tables were created
   - Create and verify a test batch

### Step 2: Verify Database Setup (Windows)

1. Run the test script using the batch file:
   ```
   RunDatabaseTest.bat
   ```

2. The script will:
   - Connect to the database
   - Verify all tables exist
   - Create a test batch
   - Verify the batch was created successfully

3. If all tests pass, you should see "All tests completed successfully!" in the console.

### Step 3: Frontend Error Logging

The frontend batch creation component has been updated to provide more detailed error logging. When a batch creation error occurs:

1. Detailed error information will be logged to the browser console, including:
   - HTTP status code and text
   - Request URL
   - Error message and details
   - Full error object

2. User-friendly error messages will be displayed in the UI with more context about the error.

## Troubleshooting

If you encounter issues:

1. **Database Connection Issues**:
   - Verify the PostgreSQL server is running
   - Check that the connection details are correct (host, port, username, password)
   - Ensure the database exists: `CREATE DATABASE "comp-filer";`
   - Verify network connectivity to the database server

2. **Table Creation Issues**:
   - Check PostgreSQL logs for error messages
   - Verify the user has permissions to create tables
   - Try running each CREATE TABLE statement individually to identify specific issues

3. **Test Script Issues**:
   - Ensure .NET SDK is installed
   - Verify the Npgsql package can be installed
   - Check that the connection string in the test script matches your database configuration

## Connection Details

The scripts use the following PostgreSQL connection details:
- Host: 192.168.1.106
- Port: 5432
- Database: comp-filer
- Username: vault66admin
- Password: sQ63370

If your connection details differ, update them in the scripts before running.

## Additional Notes

- The shell script (`setup_database.sh`) requires the `uuidgen` command for generating UUIDs. This is typically available on most Linux distributions and macOS.
- For Windows users, the batch file requires .NET SDK to be installed.
- The PowerShell script requires PowerShell 5.1 or higher and the PostgreSQL command-line tools (psql) to be installed and in the PATH.
- All scripts assume that the PostgreSQL server is accessible from your machine.