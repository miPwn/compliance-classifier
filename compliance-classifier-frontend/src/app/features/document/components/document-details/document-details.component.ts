import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService, Document } from '../../../../core/services/document.service';
import { ClassificationService, Classification } from '../../../../core/services/classification.service';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    TableModule,
    TagModule
  ]
})
export class DocumentDetailsComponent implements OnInit {
  documentId: string | null = null;
  document: Document | null = null;
  classifications: Classification[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private classificationService: ClassificationService
  ) { }

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id');
    
    if (this.documentId) {
      this.loadDocument();
      this.loadClassifications();
    } else {
      this.error = 'Document ID not provided';
    }
  }

  loadDocument(): void {
    if (!this.documentId) return;
    
    this.isLoading = true;
    
    // Mock data for now
    setTimeout(() => {
      this.document = {
        id: this.documentId!,
        batchId: '1',
        filename: 'document1.pdf',
        status: 'Classified',
        uploadedAt: '' + new Date(),
        fileSize: 1024,
        contentType: 'application/pdf'
      };
      this.isLoading = false;
    }, 1000);
    
    // In a real implementation, we would use:
    // this.documentService.getDocumentById(this.documentId).subscribe({
    //   next: (document) => {
    //     this.document = document;
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Failed to load document';
    //     this.isLoading = false;
    //     console.error('Error loading document:', err);
    //   }
    // });
  }

  loadClassifications(): void {
    if (!this.documentId) return;
    
    // Mock data for now
    setTimeout(() => {
      this.classifications = [
        {
          id: '1',
          documentId: this.documentId!,
          category: 'Financial',
          confidence: 0.85,
          timestamp: '' + new Date(),
          isManual: false
        },
        {
          id: '2',
          documentId: this.documentId!,
          category: 'Legal',
          confidence: 0.65,
          timestamp: '' + new Date(),
          isManual: false
        }
      ];
    }, 1500);
    
    // In a real implementation, we would use:
    // this.classificationService.getClassificationsByDocumentId(this.documentId).subscribe({
    //   next: (classifications) => {
    //     this.classifications = classifications;
    //   },
    //   error: (err) => {
    //     console.error('Error loading classifications:', err);
    //   }
    // });
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }

  downloadDocument(): void {
    if (!this.documentId) return;
    
    // In a real implementation, we would use:
    // this.documentService.getDocumentContent(this.documentId).subscribe({
    //   next: (blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = this.document?.filename || 'document';
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();
    //   },
    //   error: (err) => {
    //     console.error('Error downloading document:', err);
    //   }
    // });
    
    alert('Document download functionality will be implemented in the future.');
  }
}