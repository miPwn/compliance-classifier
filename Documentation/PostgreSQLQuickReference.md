# PostgreSQL Quick Reference Guide

This quick reference guide provides common PostgreSQL commands and operations that may be useful when working with the Compliance Classifier application.

## Table of Contents

1. [Connection Commands](#connection-commands)
2. [Database Management](#database-management)
3. [User Management](#user-management)
4. [Table Operations](#table-operations)
5. [Backup and Restore](#backup-and-restore)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Connection Commands

### Connect to PostgreSQL

```bash
# Connect as postgres user
psql -U postgres

# Connect to a specific database
psql -U username -d database_name

# Connect with host and port
psql -h hostname -p port -U username -d database_name

# Connect using connection string
psql "host=hostname port=port dbname=database_name user=username password=password"
```

### Connection Information

```sql
-- Show current connection info
\conninfo

-- Show current database
SELECT current_database();

-- Show current user
SELECT current_user;
```

## Database Management

### Create and Drop Database

```sql
-- Create a new database
CREATE DATABASE comp_filer;

-- Create a database with specific encoding and locale
CREATE DATABASE comp_filer
    WITH ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8';

-- Drop a database (be careful!)
DROP DATABASE comp_filer;
```

### List Databases

```sql
-- List all databases
\l

-- List databases with SQL
SELECT datname FROM pg_database;
```

## User Management

### Create and Manage Users

```sql
-- Create a new user
CREATE USER username WITH PASSWORD 'password';

-- Create a user with additional attributes
CREATE USER username 
    WITH PASSWORD 'password'
    CREATEDB
    VALID UNTIL 'infinity';

-- Alter user password
ALTER USER username WITH PASSWORD 'new_password';

-- Grant database access
GRANT ALL PRIVILEGES ON DATABASE comp_filer TO username;

-- Grant schema access
GRANT ALL PRIVILEGES ON SCHEMA public TO username;

-- Grant table access
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO username;

-- Drop a user
DROP USER username;
```

### List Users and Permissions

```sql
-- List all users
\du

-- List users with SQL
SELECT usename FROM pg_user;

-- Check user permissions on tables
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'username';
```

## Table Operations

### Basic Table Commands

```sql
-- List all tables
\dt

-- List tables with SQL
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Describe table structure
\d table_name

-- Get table structure with SQL
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'table_name';
```

### Common Queries for Compliance Classifier Tables

```sql
-- Count documents
SELECT COUNT(*) FROM "Documents";

-- List recent documents
SELECT "Id", "Title", "CreatedAt" 
FROM "Documents" 
ORDER BY "CreatedAt" DESC 
LIMIT 10;

-- Find documents by classification
SELECT d."Id", d."Title", c."ClassificationType"
FROM "Documents" d
JOIN "Classifications" c ON d."Id" = c."DocumentId"
WHERE c."ClassificationType" = 'Confidential';

-- List users
SELECT "Id", "Username", "Email", "CreatedAt"
FROM "Users"
ORDER BY "CreatedAt" DESC;
```

## Backup and Restore

### Backup Database

```bash
# Backup entire database
pg_dump -U username -d comp_filer -F c -f backup_file.dump

# Backup specific tables
pg_dump -U username -d comp_filer -t table_name -F c -f table_backup.dump

# Backup in plain SQL format
pg_dump -U username -d comp_filer -F p -f backup_file.sql
```

### Restore Database

```bash
# Restore from custom format backup
pg_restore -U username -d comp_filer -c backup_file.dump

# Restore from SQL file
psql -U username -d comp_filer -f backup_file.sql
```

## Monitoring and Maintenance

### Database Size

```sql
-- Get database size
SELECT pg_size_pretty(pg_database_size('comp_filer'));

-- Get table sizes
SELECT
    table_name,
    pg_size_pretty(pg_total_relation_size(table_name)) as total_size
FROM
    information_schema.tables
WHERE
    table_schema = 'public'
ORDER BY
    pg_total_relation_size(table_name) DESC;
```

### Connection Monitoring

```sql
-- List active connections
SELECT * FROM pg_stat_activity WHERE datname = 'comp_filer';

-- Kill a specific connection
SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
WHERE datname = 'comp_filer' AND pid <> pg_backend_pid();
```

### Maintenance Operations

```sql
-- Analyze tables to update statistics
ANALYZE;

-- Vacuum to reclaim space and update statistics
VACUUM;

-- Full vacuum with table rewrite (locks table)
VACUUM FULL;

-- Reindex a table
REINDEX TABLE table_name;
```

### Performance Tuning

```sql
-- Show slow queries
SELECT
    query,
    calls,
    total_time,
    mean_time
FROM
    pg_stat_statements
ORDER BY
    mean_time DESC
LIMIT 10;

-- Show table statistics
SELECT * FROM pg_stat_user_tables;

-- Show index usage statistics
SELECT * FROM pg_stat_user_indexes;
```

## Entity Framework Core Commands

These commands are useful for managing the database from the .NET application:

```bash
# Add a new migration
dotnet ef migrations add MigrationName

# Apply migrations to the database
dotnet ef database update

# Generate SQL script for migrations
dotnet ef migrations script

# Remove the last migration
dotnet ef migrations remove

# List all migrations
dotnet ef migrations list
```

Remember to run these commands in the appropriate project directory (usually ComplianceClassifier.API).