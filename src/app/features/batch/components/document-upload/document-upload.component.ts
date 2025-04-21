import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {
  batchId: string = '';
  batch: any;
  uploadedFiles: File[] = [];
  uploadProgress: number = 0;
  uploading: boolean = false;
  
  // Accepted file types
  acceptedFileTypes: string[] = ['.pdf', '.docx', '.txt'];
  maxFileSize: number = 10 * 1024 * 1024; // 10MB
  maxFiles: number = 50;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('id') || '';
    this.loadBatchDetails();
  }
  
  private loadBatchDetails(): void {
    // Simulate API call to get batch details
    setTimeout(() => {
      this.batch = {
        batchId: this.batchId,
        name: `Batch ${this.batchId}`,
        uploadDate: new Date(),
        status: 'Pending',
        totalDocuments: 0,
        processedDocuments: 0
      };
    }, 500);
  }
  
  onFileSelect(event: any): void {
    for (let file of event.files) {
      if (this.validateFile(file)) {
        this.uploadedFiles.push(file);
      }
    }
  }
  
  onFileDrop(event: any): void {
    for (let file of event.files) {
      if (this.validateFile(file)) {
        this.uploadedFiles.push(file);
      }
    }
  }
  
  validateFile(file: File): boolean {
    const fileName = file.name.toLowerCase();
    const validExtension = this.acceptedFileTypes.some(ext => 
      fileName.endsWith(ext)
    );
    
    const validSize = file.size <= this.maxFileSize;
    
    if (!validExtension) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: `Only ${this.acceptedFileTypes.join(', ')} files are supported`
      });
    }
    
    if (!validSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: `Maximum file size is ${this.maxFileSize / (1024 * 1024)}MB`
      });
    }
    
    return validExtension && validSize;
  }
  
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }
  
  clearFiles(): void {
    this.uploadedFiles = [];
  }
  
  uploadFiles(): void {
    if (this.uploadedFiles.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Files',
        detail: 'Please select files to upload'
      });
      return;
    }
    
    if (this.uploadedFiles.length > this.maxFiles) {
      this.messageService.add({
        severity: 'error',
        summary: 'Too Many Files',
        detail: `Maximum ${this.maxFiles} files can be uploaded at once`
      });
      return;
    }
    
    this.uploading = true;
    this.uploadProgress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 5;
      
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        
        // Simulate API response delay
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Upload Complete',
            detail: `${this.uploadedFiles.length} files uploaded successfully`
          });
          
          this.uploading = false;
          this.uploadProgress = 0;
          this.uploadedFiles = [];
        }, 500);
      }
    }, 200);
  }
  
  cancel(): void {
    this.router.navigate(['/batches', this.batchId]);
  }
}