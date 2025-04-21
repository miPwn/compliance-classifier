# Compliance Document Classifier - Quick Start Guide

This guide provides a quick overview of how to use the Compliance Document Classifier system.

## Running the Application

1. Open a terminal and navigate to the API project directory:

```bash
cd ComplianceClassifier.API
```

2. Run the application:

```bash
dotnet run --urls="http://localhost:5000"
```

The application will start and listen on http://localhost:5000.

## Basic Workflow

### 1. Create a Batch

First, create a batch to group related documents:

```bash
curl -X POST http://localhost:5000/api/document/batch
```

This will return a batch ID (GUID) that you'll use in subsequent steps.

### 2. Upload Documents

Upload documents to the batch:

```bash
curl -X POST -F "files=@document1.pdf" -F "files=@document2.docx" "http://localhost:5000/api/document/batch/{batchId}/upload"
```

Note: Make sure to:
1. Enclose the URL in quotes
2. Use the correct file paths for your documents
3. Replace `{batchId}` with your actual batch ID

Replace `{batchId}` with the batch ID from step 1.

This will return an array of document IDs (GUIDs) that you'll use in subsequent steps.

### 3. Check Document Status

Check the status of a document:

```bash
curl http://localhost:5000/api/document/{documentId}
```

Replace `{documentId}` with one of the document IDs from step 2.

### 4. View Documents in a Batch

View all documents in a batch:

```bash
curl http://localhost:5000/api/document/batch/{batchId}
```

Replace `{batchId}` with the batch ID from step 1.

## Document Parsing

The system automatically parses documents when they are uploaded. The following document formats are supported:

- TXT: Plain text files
- PDF: PDF files (parsed using PdfPig)
- DOCX: Microsoft Word documents (parsed using DocumentFormat.OpenXml)

The parsed content and metadata are stored in the system and can be accessed through the API.

## Next Steps

For more detailed information, see:

- [Document Parser Service Documentation](DocumentParserService.md): Detailed documentation for the Document Parser Service
- [README.md](../README.md): Overview of the entire system