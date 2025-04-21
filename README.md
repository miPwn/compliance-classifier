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
- Required NuGet packages (see project files)

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application:

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

## Error Handling

The application includes comprehensive error handling:

- **File Not Found**: Returns an appropriate error message if the file does not exist
- **Unsupported File Type**: Returns an error if the file type is not supported
- **Parsing Errors**: Catches and logs exceptions that occur during parsing
- **Classification Errors**: Handles errors during document classification

## Extending the System

The application is designed to be extensible:

- New document types can be added by implementing new parsers
- New classification algorithms can be integrated
- New report formats can be supported

See the detailed documentation for more information on extending the system.

## License

This project is licensed under the MIT License - see the LICENSE file for details.