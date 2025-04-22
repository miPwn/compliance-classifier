# PostgreSQL Migrations and Schema Management

This guide explains how to manage database schema changes and migrations for the PostgreSQL database in the Compliance Classifier application using Entity Framework Core.

## Table of Contents

1. [Understanding Migrations](#understanding-migrations)
2. [Migration Workflow](#migration-workflow)
3. [Common Migration Commands](#common-migration-commands)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

## Understanding Migrations

### What are Migrations?

Migrations are a way to evolve your database schema over time, keeping it in sync with your application's data model while preserving existing data. Entity Framework Core provides a set of tools to:

- Create migrations based on changes to your entity models
- Apply migrations to update the database schema
- Revert migrations to roll back changes
- Generate SQL scripts for manual application

### How Migrations Work in Compliance Classifier

The Compliance Classifier application uses Entity Framework Core's migration system with the following components:

1. **Entity Classes**: Define the data model in C# code (located in the Domain project)
2. **DbContext**: Maps entity classes to database tables (ApplicationDbContext)
3. **Migration Files**: Generated code that describes schema changes
4. **Migration History Table**: Tracks which migrations have been applied to the database

## Migration Workflow

### Initial Setup

When setting up a new environment, you'll need to apply all existing migrations:

```bash
# Navigate to the API project
cd ComplianceClassifier.API

# Apply all migrations
dotnet ef database update
```

### Making Schema Changes

When you need to make changes to the database schema, follow these steps:

1. **Modify Entity Classes**

   Update your entity classes in the Domain project to reflect the desired changes. For example:

   ```csharp
   // Adding a new property to an entity
   public class Document
   {
       // Existing properties...
       
       // New property
       public string Language { get; set; }
   }
   ```

2. **Create a Migration**

   Generate a new migration that captures these changes:

   ```bash
   dotnet ef migrations add AddDocumentLanguage
   ```

   This creates migration files in the `Migrations` folder with:
   - `Up()` method: Code to apply the changes
   - `Down()` method: Code to revert the changes

3. **Review the Migration**

   Always review the generated migration code to ensure it will make the expected changes.

4. **Apply the Migration**

   Update the database with the new migration:

   ```bash
   dotnet ef database update
   ```

5. **Commit Migration Files**

   Commit the generated migration files to source control so other developers can apply them.

### Deployment

For production deployments, you have two options:

1. **Apply Migrations at Runtime**

   The application can automatically apply pending migrations when it starts:

   ```csharp
   // In Program.cs
   app.Services.GetRequiredService<ApplicationDbContext>().Database.Migrate();
   ```

2. **Generate SQL Scripts**

   Generate SQL scripts that can be reviewed and applied manually:

   ```bash
   # Generate SQL for all migrations
   dotnet ef migrations script -o migrations.sql

   # Generate SQL for specific migrations
   dotnet ef migrations script PreviousMigration NewMigration -o specific-migrations.sql
   ```

## Common Migration Commands

### Creating Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Create a migration in a specific project
dotnet ef migrations add MigrationName --project ../ComplianceClassifier.Infrastructure
```

### Applying Migrations

```bash
# Apply all pending migrations
dotnet ef database update

# Apply migrations up to a specific one
dotnet ef database update MigrationName
```

### Managing Migrations

```bash
# List all migrations and their status
dotnet ef migrations list

# Remove the last migration (if not applied to database)
dotnet ef migrations remove

# Generate an idempotent SQL script for all migrations
dotnet ef migrations script --idempotent -o migrations.sql
```

### Advanced Scenarios

```bash
# Create an empty migration (for custom SQL)
dotnet ef migrations add CustomSqlMigration --empty

# Revert to a specific migration
dotnet ef database update PreviousMigrationName
```

## Best Practices

### Naming Migrations

Use descriptive names for migrations that indicate what changes they make:

- `AddDocumentLanguageField`
- `CreateClassificationTable`
- `UpdateUserConstraints`
- `AddIndexToDocumentTitle`

### Testing Migrations

Always test migrations in a development environment before applying them to production:

1. Create a backup of your development database
2. Apply the migration
3. Test the application to ensure it works with the new schema
4. If issues occur, use the `Down()` method to revert the changes

### Handling Conflicts

When multiple developers create migrations simultaneously, conflicts can occur. To resolve them:

1. Pull the latest changes from source control
2. Remove your local migration if it hasn't been shared: `dotnet ef migrations remove`
3. Create a new migration that includes your changes on top of the latest shared migrations

### Data Migrations

For complex data migrations, consider adding custom SQL in the migration's `Up()` method:

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    // Schema changes
    migrationBuilder.AddColumn<string>(
        name: "Language",
        table: "Documents",
        nullable: true);
    
    // Data migration
    migrationBuilder.Sql(@"
        UPDATE ""Documents"" 
        SET ""Language"" = 'en-US' 
        WHERE ""Language"" IS NULL
    ");
}
```

## Troubleshooting

### Common Issues

#### Migration Pending Error

**Issue**: `Your target project 'ComplianceClassifier.API' doesn't match your migrations assembly 'ComplianceClassifier.Infrastructure'`

**Solution**: Specify the correct project:

```bash
dotnet ef database update --project ../ComplianceClassifier.Infrastructure
```

#### Multiple DbContext Error

**Issue**: `More than one DbContext was found.`

**Solution**: Specify the context:

```bash
dotnet ef database update --context ApplicationDbContext
```

#### Migration Not Applied

**Issue**: Changes from a migration aren't reflected in the database.

**Solutions**:
- Check the `__EFMigrationsHistory` table to see if the migration is listed
- Verify the connection string points to the correct database
- Try running `dotnet ef database update` with verbose output: `--verbose`

#### Cannot Drop Objects in Use

**Issue**: `Cannot drop the table 'TableName' because it is being referenced by object 'FK_Name'`

**Solution**: Ensure migrations drop foreign keys before dropping tables:

```csharp
migrationBuilder.DropForeignKey(
    name: "FK_Name",
    table: "TableName");

migrationBuilder.DropTable(
    name: "TableName");
```

### Fixing Corrupted Migrations

If your migrations become corrupted or out of sync:

1. **Create a SQL Backup**:
   ```bash
   pg_dump -U username -d comp_filer -F c -f backup.dump
   ```

2. **Reset the Migration History**:
   ```sql
   DELETE FROM "__EFMigrationsHistory";
   ```

3. **Add Initial Migration**:
   ```bash
   dotnet ef migrations add InitialCreate
   ```

4. **Mark as Applied**:
   ```bash
   dotnet ef database update --connection "your-connection-string"
   ```

### Viewing Migration SQL

To see what SQL a migration will execute without applying it:

```bash
dotnet ef migrations script PreviousMigration CurrentMigration
```

This is useful for reviewing changes before applying them to production.