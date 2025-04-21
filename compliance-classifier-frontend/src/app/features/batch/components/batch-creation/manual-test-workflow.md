# Batch Creation Workflow Manual Test

This document outlines the steps to manually test the batch creation workflow to ensure that after files are uploaded, a batch is properly created and the user is redirected back to the dashboard where the new batch appears.

## Prerequisites

- The application is running locally
- You have access to test documents (PDF, DOC, DOCX, TXT, or RTF files)

## Test Steps

### 1. Navigate to Batch Creation

1. Start at the dashboard page
2. Click the "Create New Batch" button in the Recent Batches panel
3. Verify you are redirected to the batch creation page

**Expected Result:** The batch creation page loads with a form for batch information and a file upload section.

### 2. Create a Batch

1. Fill in the batch information:
   - Batch Name: "Test Batch [current date/time]" (to make it unique)
   - Description: "Test batch created for manual testing"
2. Click the "Create Batch" button

**Expected Result:** 
- A success notification appears indicating the batch was created successfully
- The batch information form becomes disabled
- A green success message appears below the form

### 3. Upload Files to the Batch

1. Fill in the document metadata:
   - Document Type: "Test Document"
   - Classification: "Test Classification"
   - Tags: "test, manual"
2. Click the "Browse Files" button or drag and drop files into the upload area
3. Select one or more test documents
4. Click the "Upload All" button

**Expected Result:**
- Files are uploaded with a progress indicator
- A success notification appears when the upload is complete
- A message indicates you will be redirected to the dashboard

### 4. Verify Redirection to Dashboard

**Expected Result:**
- After successful upload, you are automatically redirected to the dashboard page

### 5. Verify Batch Appears in Dashboard

1. Check the Recent Batches panel on the dashboard

**Expected Result:**
- The newly created batch appears in the Recent Batches panel
- The batch name matches what you entered
- The document count reflects the number of files you uploaded

### 6. Verify Pipeline Timeline

1. Check the Pipeline Timeline panel on the dashboard

**Expected Result:**
- The uploaded documents appear in the pipeline timeline
- The documents are associated with the newly created batch

## Additional Tests

### Error Handling

1. Try to create a batch without entering a name
   - **Expected Result:** Validation error appears, form is not submitted
   
2. Try to upload files without creating a batch first
   - **Expected Result:** Error message indicates you need to create a batch first
   
3. Try to upload an unsupported file type
   - **Expected Result:** Error message indicates the file type is not supported

### Edge Cases

1. Create a batch with a very long name (100+ characters)
   - **Expected Result:** Name is truncated or validation error appears
   
2. Upload a large number of files (10+)
   - **Expected Result:** Files are uploaded successfully with progress indication

## Notes

- If any step fails, note the exact error message and behavior
- Check browser console for any JavaScript errors
- Verify network requests in the browser developer tools