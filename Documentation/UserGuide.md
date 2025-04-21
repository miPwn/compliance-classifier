# Compliance Document Classifier - User Guide

## Overview

This guide provides instructions for accessing and using the Compliance Document Classifier frontend application. It covers how to access the application, create new batch jobs, upload documents, view classification results, and generate reports.

## Accessing the Application

The Compliance Document Classifier is implemented as a RESTful API without an integrated frontend. The API provides endpoints for document management, classification, and reporting.

### Running the API

1. Ensure the backend API is running:
   ```bash
   cd ComplianceClassifier.API
   dotnet run --urls="http://localhost:5000"
   ```

2. The API will be accessible at:
   ```
   http://localhost:5000
   ```

### API Endpoints

The API provides the following key endpoints:

#### Document Management

- Create a batch: `POST http://localhost:5000/api/document/batch`
- Upload documents to a batch: `POST http://localhost:5000/api/document/batch/{batchId}/upload`
- Get document details: `GET http://localhost:5000/api/document/{id}`
- Get all documents in a batch: `GET http://localhost:5000/api/document/batch/{batchId}`

#### Classification

- Get classification for a document: `GET http://localhost:5000/api/classification/{documentId}`
- Override classification: `PUT http://localhost:5000/api/classification/{classificationId}/override`

#### Reports

- Generate document report: `POST http://localhost:5000/api/report/document/{documentId}`
- Generate batch report: `POST http://localhost:5000/api/report/batch/{batchId}`

### Using the API

Since there is no integrated frontend, you can interact with the API using:

1. **API Client Tools**:
   - [Postman](https://www.postman.com/)
   - [Insomnia](https://insomnia.rest/)
   - [curl](https://curl.se/) (command line)

2. **Custom Frontend**:
   You can build a custom frontend application that communicates with the API. The API contract is documented in the [APIContract.md](APIContract.md) file.

### Example: Creating a Batch and Uploading Documents

Here's an example of how to create a batch and upload documents using curl:

1. Create a batch:
   ```bash
   curl -X POST http://localhost:5000/api/document/batch
   ```
   This will return a batch ID like: `"b96143a0-d9bd-4cb5-b801-95351a684248"`

2. Upload documents to the batch:
   ```bash
   curl -X POST -F "files=@document1.pdf" -F "files=@document2.docx" "http://localhost:5000/api/document/batch/b96143a0-d9bd-4cb5-b801-95351a684248/upload"
   ```
   Replace `b96143a0-d9bd-4cb5-b801-95351a684248` with the actual batch ID you received.

3. Check the status of the batch:
   ```bash
   curl http://localhost:5000/api/document/batch/b96143a0-d9bd-4cb5-b801-95351a684248
   ```

For more detailed information about the API endpoints and request/response formats, please refer to the [APIContract.md](APIContract.md) file.

### Production Environment

In a production environment, the application is typically accessed through a URL provided by your organization, such as:

```
https://compliance-classifier.yourcompany.com
```

## Authentication

1. On the login page, enter your credentials:
   - Username (usually your email address)
   - Password

2. Click "Sign In" to access the application.

3. If you've forgotten your password, click the "Forgot Password" link and follow the instructions.

## Dashboard

After logging in, you'll be directed to the dashboard, which provides:

- Overview of recent batch jobs
- Statistics on document classifications
- Quick access to common actions
- Notifications about completed classifications

## Creating a New Batch Job

1. From the dashboard, click the "New Batch" button in the top-right corner.

2. In the "Create Batch" dialog:
   - Enter a name for the batch (optional)
   - Add any notes or description (optional)
   - Click "Create Batch"

3. The system will create a new batch and redirect you to the document upload page.

## Uploading Documents

### Single or Multiple Document Upload

1. On the document upload page, you can upload documents in two ways:
   - Click the "Select Files" button and choose files from your computer
   - Drag and drop files directly onto the designated area

2. The system supports the following file formats:
   - PDF (.pdf)
   - Microsoft Word (.docx)
   - Text files (.txt)

3. You can upload multiple files at once, with a maximum of 50 files per batch and a maximum file size of 10MB per document.

4. As files are added, they appear in a list below the upload area, showing:
   - File name
   - File type
   - File size
   - Upload status

5. You can remove files from the list before uploading by clicking the "X" button next to each file.

6. When ready, click the "Upload" button to start the upload process.

7. A progress bar shows the overall upload progress.

### Upload Completion

1. Once the upload is complete, the system will display a success message.

2. You'll be presented with options to:
   - View the batch details
   - Add more documents to the batch
   - Create a new batch

3. The system automatically begins processing the uploaded documents in the background.

## Viewing Batch Status

1. From the dashboard, click on "Batches" in the main navigation menu.

2. The Batches page displays a list of all your batches, showing:
   - Batch ID
   - Creation date
   - Number of documents
   - Processing status
   - Completion date (if applicable)

3. Click on a batch to view its details.

## Viewing Batch Details

The Batch Details page shows:

1. Batch information:
   - Batch ID
   - Creation date
   - Status
   - Number of documents
   - Number of processed documents

2. Document list:
   - File name
   - Upload date
   - Processing status
   - Classification category (if processed)
   - Risk level (if processed)

3. Click on a document to view its classification details.

## Viewing Classification Results

The Classification Details page shows:

1. Document information:
   - File name
   - File type
   - Upload date
   - Processing date

2. Classification results:
   - Category
   - Risk level
   - Confidence score
   - AI-generated summary
   - Classification date
   - Classification source (AI model or manual override)

3. Document preview (if available)

4. Options to:
   - Override the classification
   - Generate a report
   - Download the original document

## Overriding Classifications

If you disagree with the AI-generated classification:

1. Click the "Override" button on the Classification Details page.

2. In the Override dialog:
   - Select a new category from the dropdown
   - Select a new risk level
   - Optionally modify the summary
   - Click "Save Override"

3. The system will update the classification and mark it as manually overridden.

## Generating Reports

### Single Document Report

1. From the Classification Details page, click "Generate Report".

2. The system will generate a PDF report containing:
   - Document metadata
   - Classification details
   - Document summary
   - Risk assessment

3. Once generated, you can:
   - View the report in the browser
   - Download the report
   - Share the report via email

### Batch Report

1. From the Batch Details page, click "Generate Batch Report".

2. The system will generate a comprehensive PDF report containing:
   - Batch summary
   - Statistics on classifications and risk levels
   - List of all documents with their classifications
   - Detailed information for high-risk documents

3. Once generated, you can:
   - View the report in the browser
   - Download the report
   - Share the report via email

## Searching and Filtering

### Document Search

1. From the main navigation menu, click "Documents".

2. Use the search bar to search for documents by:
   - File name
   - Content (if text extraction was successful)
   - Category
   - Risk level

3. Use the filters panel to narrow results by:
   - Date range
   - File type
   - Category
   - Risk level
   - Processing status

### Batch Search

1. From the main navigation menu, click "Batches".

2. Use the search bar to search for batches by:
   - Batch ID
   - Creation date
   - Status

3. Use the filters panel to narrow results by:
   - Date range
   - Status
   - Number of documents

## User Settings

1. Click on your profile icon in the top-right corner and select "Settings".

2. In the Settings page, you can:
   - Update your profile information
   - Change your password
   - Configure notification preferences
   - Set default view options

## Troubleshooting

### Upload Issues

If you encounter issues during upload:

1. Ensure your files are in supported formats (.pdf, .docx, .txt).
2. Check that files don't exceed the 10MB size limit.
3. Verify your internet connection is stable.
4. Try uploading fewer files at once.

### Processing Issues

If documents get stuck in processing:

1. Check the batch status to see if there's an error message.
2. Try refreshing the page after a few minutes.
3. Contact your system administrator if the issue persists.

### Classification Issues

If you disagree with classifications:

1. Use the override feature to correct the classification.
2. Provide feedback to your system administrator about recurring misclassifications.

## Getting Help

For additional assistance:

1. Click the "Help" icon in the top-right corner to access the help center.
2. Contact your system administrator or IT support team.
3. Refer to the other documentation files for technical details about the system.