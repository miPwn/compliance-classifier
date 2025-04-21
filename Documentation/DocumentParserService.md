# Compliance Document Classifier - Document Parser Service

## Overview

The Document Parser Service is a component of the Compliance Document Classifier application that handles the parsing of different document formats (.txt, .pdf, .docx) and extracts text content for AI classification. This service follows Clean Architecture principles and implements the Strategy pattern to support multiple document types.

## Architecture

The Document Parser Service is organized according to Clean Architecture principles:

### Domain Layer

- **IDocumentParser**: Interface defining the contract for document parsing operations
- **IDocumentParserFactory**: Interface for creating document parsers based on file type
- **IDocumentParserService**: Interface for orchestrating the document parsing process

### Infrastructure Layer

- **BaseDocumentParser**: Abstract base class implementing common parser functionality
- **TxtDocumentParser**: Implementation for parsing plain text files
- **PdfDocumentParser**: Implementation for parsing PDF files using PdfPig
- **DocxDocumentParser**: Implementation for parsing DOCX files using DocumentFormat.OpenXml
- **DocumentParserFactory**: Factory for creating the appropriate parser based on file type
- **DocumentParserService**: Service that orchestrates the parsing process

### Application Layer

- **DocumentParsingRequestDto**: DTO for document parsing requests
- **DocumentParsingResponseDto**: DTO for document parsing responses
- **DocumentParsingService**: Service that uses the infrastructure implementations

## Setup and Installation

### Prerequisites

- .NET 7.0 SDK or later
- Required NuGet packages:
  - PdfPig (for PDF parsing)
  - DocumentFormat.OpenXml (for DOCX parsing)
  - Microsoft.Extensions.Logging.Abstractions

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

The Document Parser Service is accessible through the following API endpoints:

### 1. Create a Batch

Creates a new batch for document processing.

- **URL**: `/api/document/batch`
- **Method**: `POST`
- **Response**: 
  - Status Code: 201 Created
  - Body: Batch ID (GUID)

Example:

```bash
curl -X POST http://localhost:5000/api/document/batch
```

Response:
```json
"b96143a0-d9bd-4cb5-b801-95351a684248"
```

### 2. Upload Documents to a Batch

Uploads documents to a batch for processing.

- **URL**: `/api/document/batch/{batchId}/upload`
- **Method**: `POST`
- **Parameters**:
  - `batchId`: The ID of the batch to upload documents to
- **Request Body**: Form data with files
- **Response**:
  - Status Code: 200 OK
  - Body: Array of document IDs (GUIDs)

Example:

```bash
curl -X POST -F "files=@document1.pdf" -F "files=@document2.docx" http://localhost:5000/api/document/batch/b96143a0-d9bd-4cb5-b801-95351a684248/upload
```

Response:
```json
[
  "51609e7b-52c5-4619-9eaa-f506526586da",
  "12c9b73a-d083-4c6e-ac49-af21bc738ad6"
]
```

### 3. Get Document Details

Retrieves details for a specific document.

- **URL**: `/api/document/{id}`
- **Method**: `GET`
- **Parameters**:
  - `id`: The ID of the document to retrieve
- **Response**:
  - Status Code: 200 OK
  - Body: Document details

Example:

```bash
curl http://localhost:5000/api/document/51609e7b-52c5-4619-9eaa-f506526586da
```

Response:
```json
{
  "documentId": "51609e7b-52c5-4619-9eaa-f506526586da",
  "fileName": "sample.pdf",
  "fileType": "PDF",
  "fileSize": 1024,
  "uploadDate": "2025-04-21T09:45:38.0079884Z",
  "content": "...",
  "status": "Pending",
  "batchId": "b96143a0-d9bd-4cb5-b801-95351a684248",
  "metadata": {
    "pageCount": 5,
    "author": "John Doe",
    "creationDate": "2025-04-20T00:00:00Z",
    "modificationDate": "2025-04-21T00:00:00Z",
    "keywords": ["compliance", "document"]
  }
}
```

### 4. Get Documents in a Batch

Retrieves all documents in a batch.

- **URL**: `/api/document/batch/{batchId}`
- **Method**: `GET`
- **Parameters**:
  - `batchId`: The ID of the batch to retrieve documents from
- **Response**:
  - Status Code: 200 OK
  - Body: Array of document details

Example:

```bash
curl http://localhost:5000/api/document/batch/b96143a0-d9bd-4cb5-b801-95351a684248
```

Response:
```json
[
  {
    "documentId": "51609e7b-52c5-4619-9eaa-f506526586da",
    "fileName": "sample1.pdf",
    "fileType": "PDF",
    "fileSize": 1024,
    "uploadDate": "2025-04-21T09:45:21.6909108Z",
    "content": null,
    "status": "Pending",
    "batchId": "b96143a0-d9bd-4cb5-b801-95351a684248",
    "metadata": null
  },
  {
    "documentId": "12c9b73a-d083-4c6e-ac49-af21bc738ad6",
    "fileName": "sample2.docx",
    "fileType": "DOCX",
    "fileSize": 2048,
    "uploadDate": "2025-04-21T09:45:21.6909448Z",
    "content": null,
    "status": "Pending",
    "batchId": "b96143a0-d9bd-4cb5-b801-95351a684248",
    "metadata": null
  }
]
```

## Document Parsing Capabilities

The Document Parser Service supports the following document formats:

### TXT Files

- Plain text extraction
- Basic metadata extraction (creation date, modification date)
- Estimated page count based on line count

### PDF Files

- Text extraction using PdfPig
- Metadata extraction:
  - Page count
  - Author
  - Creation date
  - Modification date
  - Keywords

### DOCX Files

- Text extraction using DocumentFormat.OpenXml
- Metadata extraction:
  - Estimated page count
  - Author
  - Creation date
  - Modification date
  - Keywords

## Extending the System

### Adding Support for a New Document Type

To add support for a new document type:

1. Update the `FileType` enum in `ComplianceClassifier.Domain/Enums/FileType.cs` to include the new file type.

2. Create a new parser implementation in the Infrastructure layer:

```csharp
using ComplianceClassifier.Domain.ValueObjects;
using ComplianceClassifier.Infrastructure.DocumentParsers.Base;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.DocumentParsers.Implementations
{
    public class NewFormatDocumentParser : BaseDocumentParser
    {
        public NewFormatDocumentParser(ILogger<NewFormatDocumentParser> logger) 
            : base(logger)
        {
        }

        protected override async Task<string> ExtractTextInternalAsync(string filePath)
        {
            // Implement text extraction for the new format
        }

        public override async Task<DocumentMetadata> ExtractMetadataAsync(string filePath)
        {
            // Implement metadata extraction for the new format
        }
    }
}
```

3. Update the `DocumentParserFactory` to create the new parser:

```csharp
public IDocumentParser CreateParser(FileType fileType)
{
    return fileType switch
    {
        FileType.PDF => _serviceProvider.GetRequiredService<PdfDocumentParser>(),
        FileType.DOCX => _serviceProvider.GetRequiredService<DocxDocumentParser>(),
        FileType.TXT => _serviceProvider.GetRequiredService<TxtDocumentParser>(),
        FileType.NewFormat => _serviceProvider.GetRequiredService<NewFormatDocumentParser>(),
        _ => throw new ArgumentException($"Unsupported file type: {fileType}")
    };
}
```

4. Register the new parser in the `DependencyInjection.cs` file:

```csharp
services.AddScoped<NewFormatDocumentParser>();
```

## Error Handling

The Document Parser Service includes comprehensive error handling:

- **File Not Found**: Returns an appropriate error message if the file does not exist
- **Unsupported File Type**: Returns an error if the file type is not supported
- **Parsing Errors**: Catches and logs exceptions that occur during parsing
- **Metadata Extraction Errors**: Handles errors during metadata extraction

All errors are logged using the Microsoft.Extensions.Logging framework, making it easy to diagnose issues.

## Logging

The Document Parser Service uses Microsoft.Extensions.Logging for logging. The following events are logged:

- Document parsing start and completion
- Metadata extraction start and completion
- Errors during parsing or metadata extraction

Logs can be configured in the `appsettings.json` file:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information",
      "ComplianceClassifier.Infrastructure.DocumentParsers": "Debug"
    }
  }
}
```

## Conclusion

The Document Parser Service provides a robust and extensible solution for parsing different document formats in the Compliance Document Classifier application. By following Clean Architecture principles and implementing the Strategy pattern, the service is easy to maintain and extend with new document types.