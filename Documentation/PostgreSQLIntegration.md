# PostgreSQL Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Configuration Guide](#configuration-guide)
4. [Security Considerations](#security-considerations)
5. [Troubleshooting](#troubleshooting)

## Overview

The Compliance Classifier application uses PostgreSQL as its primary database for storing and managing all application data. This integration is implemented using Entity Framework Core with the Npgsql provider, which provides a robust and efficient way to interact with PostgreSQL databases.

### Key Components

- **ConnectionStringProvider**: Manages database connection strings, supporting environment variable substitution
- **ApplicationDbContext**: The main Entity Framework Core DbContext that defines the database schema and relationships
- **Repository Classes**: Implement data access patterns for each entity type

### Database Entities

The application stores the following main entities in the PostgreSQL database:

- Documents
- Classifications
- Batches
- Reports
- Users
- UserPasswords

## Setup Instructions

### Prerequisites

- PostgreSQL 12.0 or higher
- .NET 6.0 SDK or higher
- Entity Framework Core tools (`dotnet ef`)

### Installation Steps

1. **Install PostgreSQL**

   Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/) or use a package manager:

   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # macOS (using Homebrew)
   brew install postgresql

   # Windows
   # Download the installer from https://www.postgresql.org/download/windows/
   ```

2. **Create a Database**

   Connect to PostgreSQL and create a new database:

   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create a new database
   CREATE DATABASE "comp-filer";

   # Create a new user (optional but recommended)
   CREATE USER your_username WITH ENCRYPTED PASSWORD 'your_password';

   # Grant privileges to the user
   GRANT ALL PRIVILEGES ON DATABASE "comp-filer" TO your_username;
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory of the application based on the provided `.env.template`:

   ```
   # PostgreSQL Connection Settings
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=comp-filer
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   
   # Other environment variables...
   ```

4. **Run Database Migrations**

   Use Entity Framework Core tools to apply migrations:

   ```bash
   # Navigate to the project directory
   cd path/to/ComplianceClassifier.API

   # Apply migrations
   dotnet ef database update
   ```

## Configuration Guide

### Connection String Format

The application uses the following connection string format for PostgreSQL:

```
Host=${POSTGRES_HOST};Port=${POSTGRES_PORT};Database=${POSTGRES_DB};Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD}
```

This connection string is defined in `appsettings.json` and uses placeholders that are replaced with environment variables at runtime.

### Environment Variables

The following environment variables are used for PostgreSQL configuration:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `POSTGRES_HOST` | The hostname or IP address of the PostgreSQL server | `localhost` |
| `POSTGRES_PORT` | The port number for the PostgreSQL server | `5432` |
| `POSTGRES_DB` | The name of the PostgreSQL database | `comp-filer` |
| `POSTGRES_USER` | The username for authenticating with PostgreSQL | (Required) |
| `POSTGRES_PASSWORD` | The password for authenticating with PostgreSQL | (Required) |

### Configuration Files

1. **appsettings.json**

   The main configuration file that defines the connection string template:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=${POSTGRES_HOST};Port=${POSTGRES_PORT};Database=${POSTGRES_DB};Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD}"
     },
     // Other settings...
   }
   ```

2. **.env**

   Contains the actual values for the environment variables:

   ```
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=comp-filer
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   ```

   > **Note**: The `.env` file should never be committed to version control. Use `.env.template` as a template for creating your own `.env` file.

### Configuration in Code

The application uses the `DotNetEnv` package to load environment variables from the `.env` file. The connection string is then constructed by the `ConnectionStringProvider` class, which replaces placeholders in the connection string template with the actual environment variable values.

## Security Considerations

### Password Management

- **Never hardcode database credentials** in your application code or configuration files
- Use environment variables or a secure secrets management system to store sensitive information
- Ensure that `.env` files containing credentials are added to `.gitignore` to prevent accidental commits

### User Permissions

- Create a dedicated database user for the application with only the necessary permissions
- Follow the principle of least privilege when granting database permissions
- Consider using different users for development, testing, and production environments

### Connection Security

- Use SSL/TLS for database connections in production environments
- Add `SSL Mode=Require` to your connection string for encrypted connections
- Configure PostgreSQL to only accept SSL connections for sensitive data

Example secure connection string:

```
Host=${POSTGRES_HOST};Port=${POSTGRES_PORT};Database=${POSTGRES_DB};Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD};SSL Mode=Require;Trust Server Certificate=true
```

### Data Protection

- Sensitive data should be encrypted before storage when possible
- Use parameterized queries or an ORM like Entity Framework to prevent SQL injection
- Implement proper input validation and sanitization for all user inputs

## Troubleshooting

### Common Issues and Solutions

#### Connection Refused

**Issue**: Unable to connect to the PostgreSQL server.

**Solutions**:
- Verify that PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check if the host and port are correct in your `.env` file
- Ensure that PostgreSQL is configured to accept connections from your application's IP address
- Check firewall settings that might be blocking connections

#### Authentication Failed

**Issue**: Unable to authenticate with the PostgreSQL server.

**Solutions**:
- Verify that the username and password in your `.env` file are correct
- Check PostgreSQL's authentication method in `pg_hba.conf`
- Ensure the user has the necessary permissions to access the database

#### Database Does Not Exist

**Issue**: The specified database does not exist.

**Solutions**:
- Create the database using PostgreSQL commands: `CREATE DATABASE "comp-filer";`
- Verify that the database name in your `.env` file matches the actual database name
- Check if the user has permissions to access the database

#### Migration Errors

**Issue**: Entity Framework Core migrations fail to apply.

**Solutions**:
- Ensure that all migrations are created correctly: `dotnet ef migrations list`
- Try to update the database with verbose output: `dotnet ef database update --verbose`
- Check if there are any pending changes that require a new migration: `dotnet ef migrations add NewMigration`

### Diagnostic Queries

Use these PostgreSQL queries to diagnose common issues:

```sql
-- Check if the database exists
SELECT datname FROM pg_database WHERE datname = 'comp-filer';

-- List all users
SELECT usename FROM pg_user;

-- Check user permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'Users';

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'comp-filer';
```

### Logging

Enable enhanced logging in PostgreSQL by modifying `postgresql.conf`:

```
log_statement = 'all'          # Log all SQL statements
log_min_duration_statement = 0 # Log all statements and their durations
```

In the application, you can enable detailed logging for Entity Framework Core by adding the following to your `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  }
}
```

This will log all SQL commands executed by Entity Framework Core, which can be helpful for debugging database issues.