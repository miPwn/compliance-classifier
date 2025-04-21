import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';

// Services
import { DocumentService } from '../../../../core/services/document.service';

export interface UploadEvent {
  batchId: string;
  files: File[];
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    ButtonModule,
    RippleModule,
    BadgeModule,
    CardModule
  ]
})
export class FileUploadComponent {
  @Input() batchId: string = '';
  @Input() maxFileSize: number = 10000000; // 10MB default
  @Input() multiple: boolean = true;
  @Input() accept: string = '.pdf,.docx,.doc,.txt';
  
  @Output() uploadComplete = new EventEmitter<any>();
  @Output() uploadError = new EventEmitter<any>();
  
  uploadedFiles: any[] = [];
  uploadProgress: { [key: string]: number } = {};
  totalProgress: number = 0;
  uploading: boolean = false;
  
  constructor(
    private documentService: DocumentService,
    private messageService: MessageService
  ) {}
  
  /**
   * Handle file selection
   * @param event File selection event
   */
  onSelect(event: any): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Files Selected',
      detail: `${event.files.length} files selected`
    });
  }
  
  /**
   * Handle file upload
   * @param event Upload event
   */
  onUpload(event: any): void {
    const files = event.files;
    this.uploading = true;
    this.totalProgress = 0;
    
    // Reset progress tracking
    this.uploadProgress = {};
    
    // Initialize progress for each file
    files.forEach((file: File) => {
      this.uploadProgress[file.name] = 0;
    });
    
    // Upload each file sequentially
    this.uploadFilesSequentially(files, 0);
  }
  
  /**
   * Upload files one by one
   * @param files Array of files to upload
   * @param index Current file index
   */
  private uploadFilesSequentially(files: File[], index: number): void {
    if (index >= files.length) {
      // All files uploaded
      this.uploading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Upload Complete',
        detail: `${files.length} files uploaded successfully`
      });
      this.uploadComplete.emit({
        batchId: this.batchId,
        files: files
      });
      return;
    }
    
    const file = files[index];
    
    this.documentService.uploadDocument(this.batchId, file)
      .subscribe({
        next: (response) => {
          // Update progress for this file
          this.uploadProgress[file.name] = 100;
          this.updateTotalProgress();
          
          // Add to uploaded files
          this.uploadedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            id: response.id
          });
          
          // Upload next file
          this.uploadFilesSequentially(files, index + 1);
        },
        error: (error) => {
          this.uploading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: `Failed to upload ${file.name}: ${error.message || 'Unknown error'}`
          });
          this.uploadError.emit({
            file: file,
            error: error
          });
        }
      });
  }
  
  /**
   * Update the total progress based on individual file progress
   */
  private updateTotalProgress(): void {
    const progressValues = Object.values(this.uploadProgress);
    if (progressValues.length === 0) {
      this.totalProgress = 0;
      return;
    }
    
    const totalProgress = progressValues.reduce((sum, value) => sum + value, 0);
    this.totalProgress = Math.round(totalProgress / progressValues.length);
  }
  
  /**
   * Get file type badge color based on file extension
   * @param filename Filename to extract extension from
   * @returns Badge severity class
   */
  getFileTypeBadge(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return 'danger';
      case 'docx':
      case 'doc':
        return 'info';
      case 'txt':
        return 'success';
      default:
        return 'warning';
    }
  }
  
  /**
   * Get file type label based on file extension
   * @param filename Filename to extract extension from
   * @returns File type label
   */
  getFileTypeLabel(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    return extension.toUpperCase();
  }
  
  /**
   * Format file size to human-readable format
   * @param bytes File size in bytes
   * @returns Formatted file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Clear all uploaded files
   */
  clearUploadedFiles(): void {
    this.uploadedFiles = [];
  }
}