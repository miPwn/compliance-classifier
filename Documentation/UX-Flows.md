# UX Flows - Compliance Document Classifier

This document outlines the key user experience flows in the Compliance Document Classifier application, providing a step-by-step guide to the most common user journeys.

## 1. Creating a New Batch

The batch creation flow allows users to create a container for uploading and processing multiple documents.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Dashboard    │────▶│  Create Batch   │────▶│ Document Upload │
│                 │     │      Form       │     │      Page       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               │
        │                                               ▼
        │                                       ┌─────────────────┐
        │                                       │                 │
        └───────────────────────────────────────│  Batch Details  │
                                                │                 │
                                                └─────────────────┘
```

### Flow Steps:

1. **Initiate Batch Creation**
   - User navigates to the Dashboard
   - User clicks "Create New Batch" button
   - System navigates to the Create Batch form

2. **Enter Batch Information**
   - User enters optional batch name
   - User enters optional description
   - User clicks "Create Batch" button
   - System creates a new batch and assigns a unique ID

3. **Redirect to Document Upload**
   - System automatically redirects to the Document Upload page for the newly created batch
   - User can proceed to upload documents or navigate to the Batch Details page

### Code Example:

```typescript
// Create Batch Component
createBatch() {
  if (this.batchForm.valid) {
    this.batchService.createBatch(this.batchForm.value).subscribe(
      response => {
        if (response.success) {
          // Navigate to document upload page with the new batch ID
          this.router.navigate(['/batches', response.data, 'upload']);
        }
      }
    );
  }
}
```

## 2. Uploading Documents to a Batch

The document upload flow allows users to add documents to an existing batch for processing and classification.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Batch Details  │────▶│ Document Upload │────▶│  File Selection │
│                 │     │      Page       │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Batch Details  │◀────│ Upload Complete │◀────│ Upload Progress │
│                 │     │   Confirmation  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Flow Steps:

1. **Navigate to Upload Page**
   - User views Batch Details page
   - User clicks "Upload Documents" button
   - System navigates to Document Upload page for the selected batch

2. **Select Files**
   - User selects files using the file browser or drags and drops files
   - System validates files for:
     - Supported file types (.pdf, .docx, .txt)
     - Maximum file size (10MB per file)
     - Maximum number of files (50 per upload)
   - User can remove files from the selection before uploading

3. **Upload Files**
   - User clicks "Upload" button
   - System displays upload progress
   - System uploads files to the server and associates them with the batch

4. **Upload Completion**
   - System displays upload completion message
   - User can choose to:
     - View batch details
     - Upload more documents
     - Create a new batch

### Code Example:

```typescript
// Document Upload Component
uploadFiles() {
  if (this.uploadedFiles.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Files',
      detail: 'Please select files to upload'
    });
    return;
  }
  
  this.uploading = true;
  
  const formData = new FormData();
  for (let file of this.uploadedFiles) {
    formData.append('files', file, file.name);
  }
  
  this.documentService.uploadDocuments(this.batchId, formData).subscribe(
    response => {
      if (response.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Upload Complete',
          detail: `${this.uploadedFiles.length} files uploaded successfully`
        });
        
        // Navigate to batch details or provide options
        this.uploading = false;
        this.uploadedFiles = [];
      }
    }
  );
}
```

## 3. Viewing Classification Results

The classification viewing flow allows users to review and potentially override the AI-generated classifications for documents.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Batch Details  │────▶│ Document List   │────▶│    Document     │
│                 │     │                 │     │    Details      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │ Classification  │
                                                │    Details      │
                                                └─────────────────┘
                                                        │
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │ Classification  │
                                                │    Override     │
                                                └─────────────────┘
```

### Flow Steps:

1. **Navigate to Document Details**
   - User views Batch Details page with document list
   - User clicks on a document to view details
   - System navigates to Document Details page

2. **View Classification Results**
   - System displays document information and classification details:
     - Category (e.g., DataPrivacy, FinancialReporting)
     - Risk level (Low, Medium, High)
     - Confidence score
     - AI-generated summary
     - Classification date
     - Classification source (AI model or manual override)

3. **Override Classification (Optional)**
   - If user disagrees with the classification:
     - User clicks "Override" button
     - System displays override dialog
     - User selects new category and risk level
     - User optionally modifies the summary
     - User clicks "Save Override"
     - System updates the classification and marks it as manually overridden

### Code Example:

```typescript
// Classification Override Component
overrideClassification() {
  if (this.overrideForm.valid) {
    const overrideData: ClassificationOverrideDto = {
      category: this.overrideForm.value.category,
      riskLevel: this.overrideForm.value.riskLevel,
      summary: this.overrideForm.value.summary
    };
    
    this.classificationService.overrideClassification(
      this.classification.classificationId,
      overrideData
    ).subscribe(
      response => {
        if (response.success) {
          this.ref.close(true);
        }
      }
    );
  }
}
```

## 4. Generating Reports

The report generation flow allows users to create, view, download, and share reports for individual documents or entire batches.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Document/Batch  │────▶│ Generate Report │────▶│ Report Creation │
│    Details      │     │     Button      │     │    Process      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Share Report   │◀────│ Report Actions  │◀────│ Report Viewer   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Email Report   │     │ Download Report │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

### Flow Steps:

1. **Initiate Report Generation**
   - User views Document Details or Batch Details page
   - User clicks "Generate Report" button
   - System initiates report generation process

2. **Report Creation Process**
   - System processes document or batch data
   - System generates a PDF report containing:
     - For document reports: document metadata, classification details, summary, risk assessment
     - For batch reports: batch summary, classification statistics, document list, high-risk document details

3. **View Report**
   - System displays the generated report in the Report Viewer
   - User can view the report content

4. **Report Actions**
   - User can choose to:
     - Download the report as a PDF
     - Share the report via email

5. **Share Report (Optional)**
   - If user chooses to share:
     - User enters recipient email address(es)
     - User adds optional message
     - User clicks "Send" button
     - System sends the report via email

### Code Example:

```typescript
// Report Generation
generateDocumentReport(documentId: string) {
  this.reportService.generateDocumentReport(documentId).subscribe(
    response => {
      if (response.success) {
        // Navigate to report viewer
        this.router.navigate(['/reports', response.data.reportId]);
      }
    }
  );
}

// Report Sharing
shareReport(reportId: string, email: string) {
  this.reportService.shareReportByEmail(reportId, email).subscribe(
    response => {
      if (response.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Report Shared',
          detail: `Report has been sent to ${email}`
        });
      }
    }
  );
}
```

## 5. Document Search Flow

The document search flow allows users to find specific documents using various search criteria.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Dashboard    │────▶│ Document Search │────▶│ Search Criteria │
│                 │     │      Page       │     │     Input       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │ Search Results  │
                                                │                 │
                                                └─────────────────┘
                                                        │
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │    Document     │
                                                │    Details      │
                                                └─────────────────┘
```

### Flow Steps:

1. **Navigate to Search Page**
   - User clicks "Documents" in the main navigation
   - System displays the Document Search page

2. **Enter Search Criteria**
   - User can search by:
     - Text content
     - File name
     - Date range
     - File type
     - Classification category
     - Risk level
     - Processing status
   - User clicks "Search" button

3. **View Search Results**
   - System displays matching documents in a paginated, sortable table
   - User can refine search criteria and search again
   - User can sort results by different columns

4. **View Document Details**
   - User clicks on a document in the search results
   - System navigates to the Document Details page

### Code Example:

```typescript
// Document Search
searchDocuments() {
  this.loading = true;
  
  const filters = {
    searchTerm: this.searchTerm,
    startDate: this.dateRange[0],
    endDate: this.dateRange[1],
    fileTypes: this.selectedFileTypes,
    categories: this.selectedCategories,
    riskLevels: this.selectedRiskLevels,
    status: this.selectedStatus
  };
  
  this.documentService.searchDocuments(
    filters,
    this.currentPage,
    this.pageSize,
    this.sortField,
    this.sortOrder
  ).subscribe(
    response => {
      if (response.success) {
        this.documents = response.data.items;
        this.totalRecords = response.data.totalCount;
      }
      this.loading = false;
    }
  );
}
```

## Conclusion

These user experience flows represent the core functionality of the Compliance Document Classifier application. Each flow is designed to be intuitive and efficient, guiding users through complex processes with clear steps and feedback. The application's architecture supports these flows with well-structured components, services, and routing.