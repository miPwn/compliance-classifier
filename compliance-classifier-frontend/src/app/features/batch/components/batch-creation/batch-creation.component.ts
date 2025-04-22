import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { RippleModule } from 'primeng/ripple';

import { BatchService, BatchCreateRequest } from '../../../../core/services/batch.service';
import { DocumentService } from '../../../../core/services/document.service';
import { ThemeService, Theme } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-batch-creation',
  templateUrl: './batch-creation.component.html',
  styleUrls: ['./batch-creation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    ProgressSpinnerModule,
    ProgressBarModule,
    FileUploadModule,
    DividerModule,
    TooltipModule,
    TagModule,
    ChipModule,
    RippleModule
  ]
})
export class BatchCreationComponent implements OnInit, OnDestroy {
  batchForm: FormGroup;
  isLoading = false;
  submitted = false;
  uploadProgress: number = 0;
  createdBatchId: string | null = null;
  dragOver = false;
  selectedFiles: File[] = [];
  uploadingFiles = false;
  currentFileIndex = 0;
  totalFiles = 0;
  uploadedFiles = 0;
  failedFiles = 0;
  currentTheme: Theme = 'light';
  private themeSubscription: Subscription;
  
  // Metadata form fields
  metadataForm: FormGroup;
  metadataSubmitted = false;
  
  // File type validation
  acceptedFileTypes = '.pdf,.doc,.docx,.txt,.rtf';
  maxFileSize = 10000000; // 10MB
  maxFiles = 10;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private batchService: BatchService,
    private documentService: DocumentService,
    private messageService: MessageService,
    private themeService: ThemeService,
    private authService: AuthService
  ) {
    this.themeSubscription = this.themeService.getTheme().subscribe(theme => {
      this.currentTheme = theme;
    });
  }
  
  ngOnInit(): void {
    this.initForms();
  }
  
  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
  
  initForms(): void {
    // Main batch form
    this.batchForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
    
    // Metadata form
    this.metadataForm = this.formBuilder.group({
      documentType: ['', Validators.required],
      classification: ['', Validators.required],
      tags: [''],
      notes: ['', Validators.maxLength(500)]
    });
  }
  
  // Getter for easy access to form fields
  get f() { return this.batchForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.batchForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly',
        life: 5000
      });
      return;
    }
    
    this.isLoading = true;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You must be logged in to create a batch',
        life: 5000
      });
      this.isLoading = false;
      return;
    }

    const batchRequest: BatchCreateRequest = {
      name: this.f.name.value,
      description: this.f.description.value,
      userId: currentUser.id
    };
    
    this.batchService.createBatch(batchRequest)
      .subscribe({
        next: (batch) => {
          this.isLoading = false;
          this.createdBatchId = batch.id;
          
          // Show success message in status bar
          this.messageService.add({
            severity: 'success',
            summary: 'Batch Created',
            detail: `Batch "${batch.name}" (ID: ${batch.id}) created successfully. You can now upload documents.`,
            life: 5000
          });
          
          // If no files are selected, redirect to dashboard after a short delay
          if (this.selectedFiles.length === 0) {
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 3000);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          let errorMessage = 'An unexpected error occurred';
          let errorDetails = '';
          
          // Extract detailed error information
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.status === 0) {
            errorMessage = 'Network error - please check your connection';
            errorDetails = 'Unable to connect to the server. This may indicate network issues or that the server is not running.';
          } else if (err.status === 400) {
            errorMessage = err.error?.message || 'Invalid batch data';
            errorDetails = JSON.stringify(err.error);
          } else if (err.status === 401) {
            errorMessage = 'Authentication required';
            errorDetails = 'Your session may have expired. Please log in again.';
          } else if (err.status === 403) {
            errorMessage = 'You do not have permission to create batches';
            errorDetails = 'Contact your administrator to request access.';
          } else if (err.status === 404) {
            errorMessage = 'API endpoint not found';
            errorDetails = 'The batch creation endpoint could not be reached.';
          } else if (err.status === 500) {
            errorMessage = 'Server error - please try again later';
            errorDetails = err.error?.detail || 'The server encountered an internal error. This might be due to database issues.';
          } else if (err.status === 503) {
            errorMessage = 'Service unavailable';
            errorDetails = 'The server is currently unavailable. This might be due to maintenance or overload.';
          }
          
          // Log detailed error information to console
          console.error('Batch creation error:', {
            status: err.status,
            statusText: err.statusText,
            url: err.url,
            message: errorMessage,
            details: errorDetails,
            error: err.error,
            stack: err.error?.stack,
            fullError: err
          });
          
          this.messageService.add({
            severity: 'error',
            summary: 'Batch Creation Failed',
            detail: `Failed to create batch: ${errorMessage}`,
            life: 7000
          });
        }
      });
  }
  
  onFileSelect(event: any): void {
    // Reset progress
    this.uploadProgress = 0;
    this.selectedFiles = event.files;
    
    // Show success message
    if (this.selectedFiles.length > 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Files Selected',
        detail: `${this.selectedFiles.length} file(s) selected for upload`
      });
    }
  }
  
  onFilesDropped(event: any): void {
    // Handle files dropped via drag and drop
    this.dragOver = false;
    
    // Check if files are valid
    const files = event.dataTransfer.files;
    const validFiles = Array.from(files).filter((file: File) => this.isValidFile(file));
    
    if (validFiles.length > 0) {
      // Clear any existing files in the PrimeNG component
      // This will be handled by the FileUpload component's internal state
      
      // Set our selected files array
      this.selectedFiles = validFiles as File[];
      
      // Create a fake event object to pass to onUpload
      const uploadEvent = {
        files: this.selectedFiles
      };
      
      // Automatically trigger the upload process
      this.onUpload(uploadEvent);
      
      this.messageService.add({
        severity: 'info',
        summary: 'Files Dropped',
        detail: `${validFiles.length} file(s) ready for upload`
      });
    }
  }
  
  isValidFile(file: File): boolean {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const validType = this.acceptedFileTypes.includes(fileExtension);
    
    // Check file size
    const validSize = file.size <= this.maxFileSize;
    
    if (!validType) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: `${file.name} is not a supported file type`
      });
    }
    
    if (!validSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: `${file.name} exceeds the maximum file size of 10MB`
      });
    }
    
    return validType && validSize;
  }
  
  onUpload(event: any): void {
    // If no files selected, do nothing
    if (!event.files || event.files.length === 0) {
      return;
    }
    
    // Create batch if it doesn't exist yet
    if (!this.createdBatchId) {
      // If batch hasn't been created yet, create it first
      this.submitted = true;
      
      if (this.batchForm.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill in the required batch information first'
        });
        return;
      }
      
      this.isLoading = true;
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.messageService.add({
          severity: 'error',
          summary: 'Authentication Error',
          detail: 'You must be logged in to create a batch',
          life: 5000
        });
        this.isLoading = false;
        return;
      }
      
      const batchRequest: BatchCreateRequest = {
        name: this.f.name.value,
        description: this.f.description.value,
        userId: currentUser.id
      };
      
      this.batchService.createBatch(batchRequest).subscribe({
        next: (batch) => {
          this.createdBatchId = batch.id;
          this.isLoading = false;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Batch Created',
            detail: `Batch "${batch.name}" created successfully. Proceeding with file upload.`,
            life: 5000
          });
          
          // Continue with file upload after batch is created
          this.processFileUpload(event);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          let errorMessage = 'An unexpected error occurred';
          let errorDetails = '';
          
          // Extract detailed error information
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.status === 0) {
            errorMessage = 'Network error - please check your connection';
            errorDetails = 'Unable to connect to the server. This may indicate network issues or that the server is not running.';
          } else if (err.status === 400) {
            errorMessage = err.error?.message || 'Invalid batch data';
            errorDetails = JSON.stringify(err.error);
          } else if (err.status === 401) {
            errorMessage = 'Authentication required';
            errorDetails = 'Your session may have expired. Please log in again.';
          } else if (err.status === 403) {
            errorMessage = 'You do not have permission to create batches';
            errorDetails = 'Contact your administrator to request access.';
          } else if (err.status === 404) {
            errorMessage = 'API endpoint not found';
            errorDetails = 'The batch creation endpoint could not be reached.';
          } else if (err.status === 500) {
            errorMessage = 'Server error - please try again later';
            errorDetails = err.error?.detail || 'The server encountered an internal error. This might be due to database issues.';
          } else if (err.status === 503) {
            errorMessage = 'Service unavailable';
            errorDetails = 'The server is currently unavailable. This might be due to maintenance or overload.';
          }
          
          // Log detailed error information to console
          console.error('Batch creation error during file upload:', {
            status: err.status,
            statusText: err.statusText,
            url: err.url,
            message: errorMessage,
            details: errorDetails,
            error: err.error,
            stack: err.error?.stack,
            fullError: err
          });
          
          this.messageService.add({
            severity: 'error',
            summary: 'Batch Creation Failed',
            detail: `Failed to create batch: ${errorMessage}. Please try again.`,
            life: 7000
          });
        }
      });
    } else {
      // Batch already exists, proceed with upload
      this.processFileUpload(event);
    }
  }
  
  private processFileUpload(event: any): void {
    if (!this.createdBatchId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No batch ID available. Please create a batch first.'
      });
      return;
    }
    
    // Validate metadata if required
    this.metadataSubmitted = true;
    if (this.metadataForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in the required metadata fields'
      });
      return;
    }
    
    const files = event.files;
    this.uploadingFiles = true;
    this.totalFiles = files.length;
    this.currentFileIndex = 0;
    this.uploadedFiles = 0;
    this.failedFiles = 0;
    
    // Upload files one by one
    this.uploadFiles(files, 0).then(() => {
      // Clear the file upload component
      event.files = [];
      this.selectedFiles = [];
      this.uploadingFiles = false;
      
      // Show final status message
      if (this.uploadedFiles > 0) {
        const message = this.failedFiles > 0
          ? `${this.uploadedFiles} of ${this.totalFiles} files uploaded successfully to batch. ${this.failedFiles} failed.`
          : `${this.uploadedFiles} files uploaded successfully to batch`;
          
        this.messageService.add({
          severity: 'success',
          summary: 'Upload Complete',
          detail: `${message} Batch ID: ${this.createdBatchId}. Redirecting to dashboard...`,
          life: 5000
        });
        
        // Navigate back to dashboard after successful upload
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      } else if (this.failedFiles > 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: `All ${this.failedFiles} files failed to upload. Please check file formats and sizes and try again.`,
          life: 7000
        });
      }
    });
  }
  
  onError(event: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Upload Error',
      detail: 'File upload failed: ' + (event.error?.message || 'Unknown error')
    });
    console.error('Error uploading file:', event);
  }
  
  onClear(): void {
    this.selectedFiles = [];
    this.uploadProgress = 0;
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onFilesDropped(event);
  }
  
  viewBatch(): void {
    if (this.createdBatchId) {
      this.router.navigate(['/batches', this.createdBatchId]);
    }
  }
  
  /**
   * Upload files recursively to ensure they're processed in sequence
   * @param files Array of files to upload
   * @param index Current file index
   */
  private async uploadFiles(files: File[], index: number): Promise<void> {
    if (index >= files.length) {
      return Promise.resolve();
    }
    
    if (!this.createdBatchId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Upload Error',
        detail: 'Batch ID is missing. Cannot upload files.'
      });
      return Promise.resolve();
    }
    
    const file = files[index];
    this.currentFileIndex = index + 1;
    
    // Update progress before upload starts
    this.uploadProgress = Math.round((index / this.totalFiles) * 100);
    
    try {
      // Upload the file using firstValueFrom instead of toPromise
      await new Promise<void>((resolve) => {
        this.documentService.uploadDocument(this.createdBatchId, file)
          .subscribe({
            next: () => {
              // Update counters and progress
              this.uploadedFiles++;
              this.uploadProgress = Math.round(((index + 1) / this.totalFiles) * 100);
              resolve();
            },
            error: (err: any) => {
              // Log detailed document upload error
              console.error('Document upload error:', {
                file: file.name,
                fileSize: file.size,
                fileType: file.type,
                error: err,
                batchId: this.createdBatchId
              });
              this.failedFiles++;
              this.messageService.add({
                severity: 'error',
                summary: 'Upload Failed',
                detail: `Failed to upload file: ${file.name}`,
                life: 5000
              });
              console.error('Error uploading file:', err);
              resolve(); // Resolve anyway to continue with next file
            }
          });
      });
    } catch (err) {
      // Handle any unexpected errors
      console.error('Unexpected error during file upload:', err);
    }
    
    // Process next file
    return this.uploadFiles(files, index + 1);
  }
  
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
  
  // Getter for easy access to form fields
  get m() { return this.metadataForm.controls; }
  
  getFileTypeClass(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'file-pdf';
      case 'doc':
      case 'docx': return 'file-word';
      case 'txt': return 'file-text';
      case 'rtf': return 'file-alt';
      default: return 'file';
    }
  }
  
  getFileIcon(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'pi pi-file-pdf';
      case 'doc':
      case 'docx': return 'pi pi-file-word';
      case 'txt': return 'pi pi-file-text';
      case 'rtf': return 'pi pi-file';
      default: return 'pi pi-file';
    }
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  cancelUpload(): void {
    // Reset upload state
    this.uploadingFiles = false;
    this.uploadProgress = 0;
    this.selectedFiles = [];
    
    this.messageService.add({
      severity: 'info',
      summary: 'Upload Cancelled',
      detail: 'File upload has been cancelled'
    });
  }
}