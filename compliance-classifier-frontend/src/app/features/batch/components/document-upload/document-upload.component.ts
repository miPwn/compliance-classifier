import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

// PrimeNG imports
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';

import { DocumentService } from '../../../../core/services/document.service';
import { BatchService, Batch } from '../../../../core/services/batch.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    ButtonModule,
    CardModule,
    TooltipModule,
    DropdownModule
  ],
  providers: [MessageService]
})
export class DocumentUploadComponent implements OnInit {
  @Input() batchId: string | null = null;
  @Output() uploadComplete = new EventEmitter<void>();
  
  batches: Batch[] = [];
  selectedBatchId: string | null = null;
  uploadMode: 'new' | 'existing' = 'existing';
  newBatchName: string = '';
  isLoading = false;
  uploadProgress: number = 0;
  
  constructor(
    private documentService: DocumentService,
    private batchService: BatchService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // If batchId is provided, set it as selected
    if (this.batchId) {
      this.selectedBatchId = this.batchId;
      this.uploadMode = 'existing';
    }
    
    this.loadBatches();
  }
  
  loadBatches(): void {
    this.isLoading = true;
    
    this.batchService.getBatches()
      .subscribe({
        next: (batches) => {
          this.batches = batches;
          this.isLoading = false;
          
          // If no batch is selected and we have batches, select the first one
          if (!this.selectedBatchId && this.batches.length > 0) {
            this.selectedBatchId = this.batches[0].id;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load batches'
          });
          console.error('Error loading batches:', err);
        }
      });
  }
  
  onUploadMode(mode: 'new' | 'existing'): void {
    this.uploadMode = mode;
    
    if (mode === 'new') {
      this.selectedBatchId = null;
    } else if (this.batches.length > 0 && !this.selectedBatchId) {
      this.selectedBatchId = this.batches[0].id;
    }
  }
  
  onFileSelect(event: any): void {
    // Reset progress
    this.uploadProgress = 0;
  }
  
  async onUpload(event: any): Promise<void> {
    const files = event.files;
    
    if (this.uploadMode === 'new' && this.newBatchName.trim()) {
      // Create a new batch first
      try {
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
        
        const newBatch = await this.batchService.createBatch({
          name: this.newBatchName.trim(),
          userId: currentUser.id
        }).toPromise();
        
        this.selectedBatchId = newBatch.id;
        this.isLoading = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Batch "${this.newBatchName}" created successfully`
        });
        
        // Reset new batch name
        this.newBatchName = '';
        
        // Switch to existing mode with the new batch selected
        this.uploadMode = 'existing';
      } catch (err) {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create new batch'
        });
        console.error('Error creating batch:', err);
        return;
      }
    }
    
    if (!this.selectedBatchId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a batch or create a new one'
      });
      return;
    }
    
    // Upload files one by one
    const totalFiles = files.length;
    let uploadedFiles = 0;
    
    for (const file of files) {
      try {
        await this.documentService.uploadDocument(this.selectedBatchId, file).toPromise();
        uploadedFiles++;
        this.uploadProgress = Math.round((uploadedFiles / totalFiles) * 100);
      } catch (err) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to upload file: ${file.name}`
        });
        console.error('Error uploading file:', err);
      }
    }
    
    // Clear the file upload component
    event.files = [];
    
    if (uploadedFiles > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${uploadedFiles} of ${totalFiles} files uploaded successfully`
      });
      
      // Emit upload complete event
      this.uploadComplete.emit();
    }
  }
  
  onError(event: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'File upload failed'
    });
    console.error('Error uploading file:', event);
  }
}