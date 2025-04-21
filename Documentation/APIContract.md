# Compliance Document Classifier - API Contract

## Overview

This document outlines the API contract between the frontend Angular application and the backend .NET Core API for the Compliance Document Classifier system. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the JWT token in the Authorization header for authenticated requests:

```
Authorization: Bearer {token}
```

## Common Response Formats

### Success Response

```json
{
  "data": {
    // Response data specific to the endpoint
  },
  "success": true,
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "data": null,
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": [
    "Detailed error 1",
    "Detailed error 2"
  ]
}
```

## HTTP Status Codes

The API uses standard HTTP status codes:

- `200 OK`: The request was successful
- `201 Created`: A new resource was successfully created
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required and has failed or not been provided
- `403 Forbidden`: The authenticated user does not have access to the requested resource
- `404 Not Found`: The requested resource could not be found
- `500 Internal Server Error`: An error occurred on the server

## API Endpoints

### Document Management

#### Create a Batch

Creates a new batch for document processing.

- **URL**: `/document/batch`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**: None
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "data": "b96143a0-d9bd-4cb5-b801-95351a684248",
      "success": true,
      "message": "Batch created successfully"
    }
    ```

#### Upload Documents to a Batch

Uploads documents to a batch for processing.

- **URL**: `/document/batch/{batchId}/upload`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `batchId`: The ID of the batch to upload documents to
- **Request Body**: Form data with files
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": [
        "51609e7b-52c5-4619-9eaa-f506526586da",
        "12c9b73a-d083-4c6e-ac49-af21bc738ad6"
      ],
      "success": true,
      "message": "Documents uploaded successfully"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**:
    ```json
    {
      "data": null,
      "success": false,
      "message": "Invalid file format",
      "errors": [
        "Only PDF, DOCX, and TXT files are supported"
      ]
    }
    ```

#### Get Document Details

Retrieves details for a specific document.

- **URL**: `/document/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: The ID of the document to retrieve
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
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
      },
      "success": true,
      "message": "Document retrieved successfully"
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "data": null,
      "success": false,
      "message": "Document not found",
      "errors": [
        "No document with ID 51609e7b-52c5-4619-9eaa-f506526586da exists"
      ]
    }
    ```

#### Get Documents in a Batch

Retrieves all documents in a batch.

- **URL**: `/document/batch/{batchId}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `batchId`: The ID of the batch to retrieve documents from
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": [
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
      ],
      "success": true,
      "message": "Documents retrieved successfully"
    }
    ```

### Classification

#### Classify a Document

Initiates the classification process for a document.

- **URL**: `/classification/{documentId}`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `documentId`: The ID of the document to classify
- **Request Body**: None
- **Success Response**:
  - **Code**: 202 Accepted
  - **Content**:
    ```json
    {
      "data": {
        "classificationId": "7a9e1d5b-8c3f-4e2a-b6d7-9f8e5d4c3b2a",
        "documentId": "51609e7b-52c5-4619-9eaa-f506526586da",
        "status": "Processing"
      },
      "success": true,
      "message": "Classification initiated"
    }
    ```

#### Get Classification Results

Retrieves classification results for a document.

- **URL**: `/classification/{documentId}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `documentId`: The ID of the document to get classification for
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
        "classificationId": "7a9e1d5b-8c3f-4e2a-b6d7-9f8e5d4c3b2a",
        "documentId": "51609e7b-52c5-4619-9eaa-f506526586da",
        "category": "DataPrivacy",
        "riskLevel": "Medium",
        "summary": "This document contains information about data privacy policies and procedures...",
        "classificationDate": "2025-04-21T10:15:38.0079884Z",
        "classifiedBy": "gpt-4-turbo",
        "confidenceScore": 0.92,
        "isOverridden": false
      },
      "success": true,
      "message": "Classification retrieved successfully"
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "data": null,
      "success": false,
      "message": "Classification not found",
      "errors": [
        "No classification exists for document with ID 51609e7b-52c5-4619-9eaa-f506526586da"
      ]
    }
    ```

#### Override Classification

Overrides the AI-generated classification with manual values.

- **URL**: `/classification/{classificationId}/override`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**:
  - `classificationId`: The ID of the classification to override
- **Request Body**:
  ```json
  {
    "category": "FinancialReporting",
    "riskLevel": "High",
    "summary": "Updated summary text..."
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
        "classificationId": "7a9e1d5b-8c3f-4e2a-b6d7-9f8e5d4c3b2a",
        "documentId": "51609e7b-52c5-4619-9eaa-f506526586da",
        "category": "FinancialReporting",
        "riskLevel": "High",
        "summary": "Updated summary text...",
        "classificationDate": "2025-04-21T10:15:38.0079884Z",
        "classifiedBy": "user@example.com",
        "confidenceScore": 1.0,
        "isOverridden": true
      },
      "success": true,
      "message": "Classification overridden successfully"
    }
    ```

#### Get Batch Classifications

Retrieves all classifications for documents in a batch.

- **URL**: `/classification/batch/{batchId}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `batchId`: The ID of the batch to retrieve classifications for
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": [
        {
          "classificationId": "7a9e1d5b-8c3f-4e2a-b6d7-9f8e5d4c3b2a",
          "documentId": "51609e7b-52c5-4619-9eaa-f506526586da",
          "category": "DataPrivacy",
          "riskLevel": "Medium",
          "summary": "This document contains information about data privacy policies...",
          "classificationDate": "2025-04-21T10:15:38.0079884Z",
          "classifiedBy": "gpt-4-turbo",
          "confidenceScore": 0.92,
          "isOverridden": false
        },
        {
          "classificationId": "8b2e3f6c-9d4a-5f1b-c7e8-0a9b8c7d6e5f",
          "documentId": "12c9b73a-d083-4c6e-ac49-af21bc738ad6",
          "category": "FinancialReporting",
          "riskLevel": "High",
          "summary": "This document contains financial reporting information...",
          "classificationDate": "2025-04-21T10:16:42.1234567Z",
          "classifiedBy": "gpt-4-turbo",
          "confidenceScore": 0.88,
          "isOverridden": false
        }
      ],
      "success": true,
      "message": "Classifications retrieved successfully"
    }
    ```

### Reports

#### Generate Single Document Report

Generates a report for a single document.

- **URL**: `/report/document/{documentId}`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `documentId`: The ID of the document to generate a report for
- **Request Body**: None
- **Success Response**:
  - **Code**: 202 Accepted
  - **Content**:
    ```json
    {
      "data": {
        "reportId": "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
        "status": "Generating"
      },
      "success": true,
      "message": "Report generation initiated"
    }
    ```

#### Generate Batch Report

Generates a summary report for a batch of documents.

- **URL**: `/report/batch/{batchId}`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `batchId`: The ID of the batch to generate a report for
- **Request Body**: None
- **Success Response**:
  - **Code**: 202 Accepted
  - **Content**:
    ```json
    {
      "data": {
        "reportId": "d2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7g",
        "status": "Generating"
      },
      "success": true,
      "message": "Batch report generation initiated"
    }
    ```

#### Get Report Details

Retrieves details for a specific report.

- **URL**: `/report/{reportId}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `reportId`: The ID of the report to retrieve
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
        "reportId": "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
        "batchId": null,
        "documentId": "51609e7b-52c5-4619-9eaa-f506526586da",
        "generationDate": "2025-04-21T11:30:45.1234567Z",
        "reportType": "SingleDocument",
        "filePath": "/reports/c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f.pdf"
      },
      "success": true,
      "message": "Report retrieved successfully"
    }
    ```

#### Download Report

Downloads a generated report.

- **URL**: `/report/{reportId}/download`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `reportId`: The ID of the report to download
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Binary PDF file
  - **Headers**:
    - `Content-Type: application/pdf`
    - `Content-Disposition: attachment; filename="report.pdf"`

### Batch Management

#### Get Batch Details

Retrieves details for a specific batch.

- **URL**: `/batch/{batchId}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `batchId`: The ID of the batch to retrieve
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
        "batchId": "b96143a0-d9bd-4cb5-b801-95351a684248",
        "uploadDate": "2025-04-21T09:45:21.6909108Z",
        "userId": "user@example.com",
        "status": "Processing",
        "totalDocuments": 2,
        "processedDocuments": 1,
        "completionDate": null
      },
      "success": true,
      "message": "Batch retrieved successfully"
    }
    ```

#### Get All Batches

Retrieves all batches for the current user.

- **URL**: `/batch`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `pageSize` (optional): Number of items per page (default: 10)
  - `status` (optional): Filter by status (Pending, Processing, Completed, Error)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "data": {
        "items": [
          {
            "batchId": "b96143a0-d9bd-4cb5-b801-95351a684248",
            "uploadDate": "2025-04-21T09:45:21.6909108Z",
            "userId": "user@example.com",
            "status": "Processing",
            "totalDocuments": 2,
            "processedDocuments": 1,
            "completionDate": null
          },
          {
            "batchId": "c07254b1-e0ce-5d6f-c912-06462a795359",
            "uploadDate": "2025-04-20T14:30:15.1234567Z",
            "userId": "user@example.com",
            "status": "Completed",
            "totalDocuments": 3,
            "processedDocuments": 3,
            "completionDate": "2025-04-20T14:45:30.9876543Z"
          }
        ],
        "totalCount": 2,
        "page": 1,
        "pageSize": 10,
        "totalPages": 1
      },
      "success": true,
      "message": "Batches retrieved successfully"
    }
    ```

## Data Transfer Objects (DTOs)

### DocumentDto

```csharp
public class DocumentDto
{
    public Guid DocumentId { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public long FileSize { get; set; }
    public DateTime UploadDate { get; set; }
    public string Content { get; set; }
    public string Status { get; set; }
    public Guid BatchId { get; set; }
    public DocumentMetadataDto Metadata { get; set; }
}

public class DocumentMetadataDto
{
    public int PageCount { get; set; }
    public string Author { get; set; }
    public DateTime CreationDate { get; set; }
    public DateTime ModificationDate { get; set; }
    public List<string> Keywords { get; set; }
}
```

### ClassificationDto

```csharp
public class ClassificationDto
{
    public Guid ClassificationId { get; set; }
    public Guid DocumentId { get; set; }
    public string Category { get; set; }
    public string RiskLevel { get; set; }
    public string Summary { get; set; }
    public DateTime ClassificationDate { get; set; }
    public string ClassifiedBy { get; set; }
    public decimal ConfidenceScore { get; set; }
    public bool IsOverridden { get; set; }
}

public class ClassificationOverrideDto
{
    public string Category { get; set; }
    public string RiskLevel { get; set; }
    public string Summary { get; set; }
}
```

### BatchDto

```csharp
public class BatchDto
{
    public Guid BatchId { get; set; }
    public DateTime UploadDate { get; set; }
    public string UserId { get; set; }
    public string Status { get; set; }
    public int TotalDocuments { get; set; }
    public int ProcessedDocuments { get; set; }
    public DateTime? CompletionDate { get; set; }
}
```

### ReportDto

```csharp
public class ReportDto
{
    public Guid ReportId { get; set; }
    public Guid? BatchId { get; set; }
    public Guid? DocumentId { get; set; }
    public DateTime GenerationDate { get; set; }
    public string ReportType { get; set; }
    public string FilePath { get; set; }
}
```

## Enum Mappings

The API uses string representations for enum values in responses:

### FileType

- `"PDF"`: PDF document
- `"DOCX"`: Microsoft Word document
- `"TXT"`: Plain text document

### DocumentStatus

- `"Pending"`: Document is pending processing
- `"Processing"`: Document is being processed
- `"Classified"`: Document has been classified
- `"Error"`: An error occurred during processing

### CategoryType

- `"DataPrivacy"`: Data privacy document
- `"FinancialReporting"`: Financial reporting document
- `"WorkplaceConduct"`: Workplace conduct document
- `"HealthCompliance"`: Health compliance document
- `"Other"`: Other document type

### RiskLevel

- `"Low"`: Low risk
- `"Medium"`: Medium risk
- `"High"`: High risk

### BatchStatus

- `"Pending"`: Batch is pending processing
- `"Processing"`: Batch is being processed
- `"Completed"`: Batch processing is complete
- `"Error"`: An error occurred during batch processing

### ReportType

- `"SingleDocument"`: Single document report
- `"BatchSummary"`: Batch summary report

## Conclusion

This API contract defines the interface between the frontend Angular application and the backend .NET Core API for the Compliance Document Classifier system. It provides a comprehensive set of endpoints for document management, classification, and report generation.