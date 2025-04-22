# Compliance Document Classifier

## Overview

The Compliance Document Classifier is an application designed to classify compliance documents using AI. It supports various document formats (.txt, .pdf, .docx) and provides a robust API for document management and classification.

## Architecture

The application follows Clean Architecture principles with the following layers:

- **Domain Layer**: Contains business entities, interfaces, and business logic
- **Application Layer**: Contains application services, DTOs, and use cases
- **Infrastructure Layer**: Contains implementations of interfaces defined in the domain layer
- **API Layer**: Contains controllers and API endpoints

## Features

- Document parsing for multiple formats (TXT, PDF, DOCX)
- Batch processing of documents
- Document classification using AI
- Report generation
- RESTful API for integration

## Getting Started

### Prerequisites

- .NET 7.0 SDK or later
- PostgreSQL 13.0 or later
- Required NuGet packages (see project files)

### Database Setup

The application uses PostgreSQL as its database. Follow these steps to set up the database:

#### Option 1: Using the provided scripts

1. Ensure PostgreSQL is installed and running
2. For Windows users:
   ```powershell
   cd ComplianceClassifier.Infrastructure/Persistence/Scripts
   .\InitializeDatabase.ps1 -Host localhost -Port 5432 -Database comp-filer -Username postgres -Password postgres
   ```

3. For Linux/macOS users:
   ```bash
   cd ComplianceClassifier.Infrastructure/Persistence/Scripts
   chmod +x initialize-database.sh
   ./initialize-database.sh --host localhost --port 5432 --db comp-filer --user postgres --password postgres
   ```

#### Option 2: Manual setup

1. Create a PostgreSQL database named `comp-filer`
   ```sql
   CREATE DATABASE "comp-filer";
   ```

2. Execute the SQL script to create the schema
   ```bash
   psql -d comp-filer -f ComplianceClassifier.Infrastructure/Persistence/Migrations/InitialCreate.sql
   ```
   
   ### Verifying Database Connection
   
   To verify that your database connection is working correctly, you can use the provided database connection check utility:
   
   ```bash
   cd ComplianceClassifier.Infrastructure/Persistence/Scripts
   dotnet run --project CheckDatabaseConnection.csproj
   ```
   
   This utility will:
   - Attempt to connect to the database using the configured connection string
   - Verify that the database schema is properly set up
   - Display the current record counts in each table
   
   ### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Set up the database using one of the methods above
4. Run the application:

```bash
cd ComplianceClassifier.API
dotnet run --urls="http://localhost:5000"
```

The application will start and listen on http://localhost:5000.

## API Endpoints

The application provides the following API endpoints:

### Document Management

- `POST /api/document/batch`: Create a new batch
- `POST /api/document/batch/{batchId}/upload`: Upload documents to a batch
- `GET /api/document/{id}`: Get document details
- `GET /api/document/batch/{batchId}`: Get all documents in a batch

### Classification

- `POST /api/classification/{documentId}`: Classify a document
- `GET /api/classification/{documentId}`: Get classification results
- `PUT /api/classification/{documentId}`: Update classification

### Reports

- `POST /api/report`: Generate a report
- `GET /api/report/{id}`: Get report details

## Documentation

For detailed documentation on specific components, see:

- [Quick Start Guide](Documentation/QuickStartGuide.md): A concise guide to get started with the system
- [Document Parser Service](Documentation/DocumentParserService.md): Detailed documentation for the Document Parser Service
- [Developer Guide](Documentation/DeveloperGuide.md): Technical details for developers who want to extend the system

## Test Data

The repository includes sample compliance documents for testing and demonstration purposes:

- Located in the [TestData](TestData/) directory
- Includes various document types (Data Privacy, Financial Reporting, Workplace Conduct, Health Compliance)
- Contains metadata for classification testing
- Available in TXT format (can be converted to PDF/DOCX)

See the [TestData README](TestData/README.md) for detailed information on using these sample documents.

## Error Handling

The application includes comprehensive error handling:

- **File Not Found**: Returns an appropriate error message if the file does not exist
- **Unsupported File Type**: Returns an error if the file type is not supported
- **Parsing Errors**: Catches and logs exceptions that occur during parsing
- **Classification Errors**: Handles errors during document classification

## Database Schema

The application uses a PostgreSQL database with the following main tables:

### Batches
Stores information about document batches:
- `BatchId`: Unique identifier for the batch (UUID)
- `UploadDate`: Date and time when the batch was created
- `UserId`: ID of the user who created the batch
- `Status`: Current status of the batch (Pending, Processing, Completed, Error)
- `TotalDocuments`: Total number of documents in the batch
- `ProcessedDocuments`: Number of documents that have been processed
- `CompletionDate`: Date and time when the batch processing was completed

### Documents
Stores information about individual documents:
- `DocumentId`: Unique identifier for the document (UUID)
- `FileName`: Original name of the uploaded file
- `FileType`: Type of the document (PDF, DOCX, TXT)
- `FileSize`: Size of the document in bytes
- `UploadDate`: Date and time when the document was uploaded
- `Content`: Extracted text content of the document
- `Status`: Current status of the document (Pending, Processing, Classified, Error)
- `BatchId`: ID of the batch this document belongs to
- `Metadata`: Additional document metadata (PageCount, Author, CreationDate, etc.)

### Classifications
Stores classification results for documents:
- `ClassificationId`: Unique identifier for the classification (UUID)
- `DocumentId`: ID of the classified document
- `Category`: Category assigned to the document (DataPrivacy, FinancialReporting, etc.)
- `RiskLevel`: Risk level assigned to the document (Low, Medium, High)
- `Summary`: Summary of the classification result
- `ClassificationDate`: Date and time when the document was classified
- `ClassifiedBy`: ID or name of the classifier (user or system)
- `ConfidenceScore`: Confidence score of the classification (0-1)
- `IsOverridden`: Flag indicating if the classification was manually overridden

### Reports
Stores information about generated reports:
- `ReportId`: Unique identifier for the report (UUID)
- `BatchId`: ID of the batch (for batch reports)
- `DocumentId`: ID of the document (for single document reports)
- `GenerationDate`: Date and time when the report was generated
- `ReportType`: Type of the report (SingleDocument, BatchSummary)
- `FilePath`: Path to the generated report file

## Extending the System

The application is designed to be extensible:

- New document types can be added by implementing new parsers
- New classification algorithms can be integrated
- New report formats can be supported

See the detailed documentation for more information on extending the system.

## License

This project is licensed under the MIT License - see the LICENSE file for details.