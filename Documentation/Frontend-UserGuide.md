# User Guide - Compliance Document Classifier

## Introduction

The Compliance Document Classifier is a web-based application that helps organizations manage, classify, and review compliance documents. This guide provides step-by-step instructions for using the application's features, from getting started to generating reports.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Batch Management](#batch-management)
4. [Document Classification](#document-classification)
5. [Report Generation](#report-generation)
6. [Searching and Filtering](#searching-and-filtering)
7. [User Settings](#user-settings)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the Application

The Compliance Document Classifier is accessed through a web browser:

1. Open your preferred web browser (Chrome, Firefox, Edge, or Safari recommended)
2. Navigate to the application URL provided by your organization
   - Production environment: `https://compliance-classifier.yourcompany.com`
   - Development environment: `http://localhost:4200`

### Authentication

1. On the login page, enter your credentials:
   - Username (usually your email address)
   - Password

2. Click "Sign In" to access the application.

3. If you've forgotten your password, click the "Forgot Password" link and follow the instructions.

![Login Screen](../assets/images/login-screen.png)

### Navigation

The application has a consistent navigation structure:

- **Header**: Contains the application logo, main navigation menu, notifications, and user profile
- **Sidebar**: Provides access to main sections (Dashboard, Batches, Documents, Reports)
- **Main Content**: Displays the active section's content
- **Footer**: Contains copyright information and additional links

## Dashboard Overview

After logging in, you'll be directed to the dashboard, which provides:

### Processing Status Card

Displays the current status of documents in the system:
- Pending documents
- Documents in processing
- Classified documents
- Documents with errors

### Document Categories Chart

A pie chart showing the distribution of documents across different compliance categories:
- Data Privacy
- Financial Reporting
- Workplace Conduct
- Health Compliance
- Other

### Risk Level Distribution Chart

A pie chart showing the distribution of documents by risk level:
- Low Risk
- Medium Risk
- High Risk

### Recent Batches Table

Displays the 5 most recent batches with:
- Batch ID
- Upload Date
- Status
- Document count
- Quick access to batch details

### Quick Actions

Buttons for common actions:
- Create New Batch
- View All Batches
- View All Documents

![Dashboard](../assets/images/dashboard.png)

## Batch Management

Batches are containers for organizing related documents.

### Viewing Batches

1. Click "Batches" in the sidebar to view all batches.
2. The Batches page displays a list of all your batches, showing:
   - Batch ID
   - Creation date
   - Number of documents
   - Processing status
   - Completion date (if applicable)
3. Use the search bar to find specific batches.
4. Use filters to narrow results by date range or status.
5. Click on a batch to view its details.

![Batch List](../assets/images/batch-list.png)

### Creating a New Batch

1. From the dashboard or Batches page, click the "Create New Batch" button.
2. In the "Create Batch" dialog:
   - Enter a name for the batch (optional)
   - Add any notes or description (optional)
   - Click "Create Batch"
3. The system will create a new batch and redirect you to the document upload page.

![Create Batch](../assets/images/create-batch.png)

### Viewing Batch Details

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

3. Actions:
   - Upload more documents
   - Generate batch report
   - Delete batch (if permitted)

![Batch Details](../assets/images/batch-details.png)

### Uploading Documents to a Batch

1. From the Batch Details page, click "Upload Documents".
2. On the document upload page, you can upload documents in two ways:
   - Click the "Select Files" button and choose files from your computer
   - Drag and drop files directly onto the designated area

3. The system supports the following file formats:
   - PDF (.pdf)
   - Microsoft Word (.docx)
   - Text files (.txt)

4. You can upload multiple files at once, with a maximum of 50 files per batch and a maximum file size of 10MB per document.

5. As files are added, they appear in a list below the upload area, showing:
   - File name
   - File type
   - File size
   - Upload status

6. You can remove files from the list before uploading by clicking the "X" button next to each file.

7. When ready, click the "Upload" button to start the upload process.

8. A progress bar shows the overall upload progress.

9. Once the upload is complete, the system will display a success message and provide options to:
   - View the batch details
   - Add more documents
   - Create a new batch

![Document Upload](../assets/images/document-upload.png)

## Document Classification

### Viewing Document List

1. Click "Documents" in the sidebar to view all documents.
2. The Documents page displays a list of all documents, showing:
   - File name
   - Batch ID
   - Upload date
   - Processing status
   - Classification category (if processed)
   - Risk level (if processed)
3. Use the search bar to find specific documents.
4. Use filters to narrow results by date range, file type, category, risk level, or status.
5. Click on a document to view its details.

![Document List](../assets/images/document-list.png)

### Viewing Document Details

The Document Details page shows:

1. Document information:
   - File name
   - File type
   - Upload date
   - Processing date
   - Batch ID

2. Classification results:
   - Category
   - Risk level
   - Confidence score
   - AI-generated summary
   - Classification date
   - Classification source (AI model or manual override)

3. Document preview (if available)

4. Actions:
   - Override classification
   - Generate report
   - Download the original document

![Document Details](../assets/images/document-details.png)

### Overriding Classifications

If you disagree with the AI-generated classification:

1. Click the "Override" button on the Document Details page.

2. In the Override dialog:
   - Select a new category from the dropdown
   - Select a new risk level
   - Optionally modify the summary
   - Click "Save Override"

3. The system will update the classification and mark it as manually overridden.

![Classification Override](../assets/images/classification-override.png)

## Report Generation

### Generating a Document Report

1. From the Document Details page, click "Generate Report".

2. The system will generate a PDF report containing:
   - Document metadata
   - Classification details
   - Document summary
   - Risk assessment

3. Once generated, you can:
   - View the report in the browser
   - Download the report
   - Share the report via email

![Document Report](../assets/images/document-report.png)

### Generating a Batch Report

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

![Batch Report](../assets/images/batch-report.png)

### Sharing Reports

To share a report via email:

1. After generating a report, click "Share" on the report viewer page.

2. In the Share dialog:
   - Enter recipient email address(es)
   - Add an optional message
   - Click "Send"

3. The system will send an email with a link to the report.

![Share Report](../assets/images/share-report.png)

## Searching and Filtering

### Document Search

1. Click "Documents" in the sidebar.

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

4. Click "Apply Filters" to update the results.

5. Click "Clear Filters" to reset all filters.

![Document Search](../assets/images/document-search.png)

### Batch Search

1. Click "Batches" in the sidebar.

2. Use the search bar to search for batches by:
   - Batch ID
   - Creation date
   - Status

3. Use the filters panel to narrow results by:
   - Date range
   - Status
   - Number of documents

4. Click "Apply Filters" to update the results.

5. Click "Clear Filters" to reset all filters.

![Batch Search](../assets/images/batch-search.png)

## User Settings

1. Click on your profile icon in the top-right corner and select "Settings".

2. In the Settings page, you can:
   - Update your profile information
   - Change your password
   - Configure notification preferences
   - Set default view options

![User Settings](../assets/images/user-settings.png)

## Troubleshooting

### Upload Issues

If you encounter issues during upload:

1. Ensure your files are in supported formats (.pdf, .docx, .txt).
2. Check that files don't exceed the 10MB size limit.
3. Verify your internet connection is stable.
4. Try uploading fewer files at once.
5. If using drag and drop, try using the file browser instead.

### Processing Issues

If documents get stuck in processing:

1. Check the batch status to see if there's an error message.
2. Try refreshing the page after a few minutes.
3. Verify that the document is in a supported format and not corrupted.
4. Contact your system administrator if the issue persists.

### Classification Issues

If you disagree with classifications:

1. Use the override feature to correct the classification.
2. Provide feedback to your system administrator about recurring misclassifications.
3. Check if the document content is clear and legible, as poor quality documents may result in inaccurate classifications.

### Browser Compatibility

The application works best with:
- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

If you experience display issues:
1. Update your browser to the latest version.
2. Clear your browser cache and cookies.
3. Try using a different supported browser.

### Error Messages

Common error messages and their solutions:

| Error Message | Possible Solution |
|---------------|-------------------|
| "Authentication failed" | Verify your username and password, or reset your password |
| "Session expired" | Log in again to continue |
| "File type not supported" | Upload only .pdf, .docx, or .txt files |
| "File size exceeds limit" | Ensure files are under 10MB |
| "Server not responding" | Check your internet connection or try again later |

## Getting Help

For additional assistance:

1. Click the "Help" icon in the top-right corner to access the help center.
2. Contact your system administrator or IT support team.
3. Refer to the other documentation files for technical details about the system.