import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BatchService, Batch } from '../../../../core/services/batch.service';
import { DocumentService, Document } from '../../../../core/services/document.service';
import { ClassificationService, ClassificationStats } from '../../../../core/services/classification.service';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { TimelineModule } from 'primeng/timeline';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss'],
  providers: [ConfirmationService, MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    TooltipModule,
    TimelineModule,
    ChartModule
  ]
})
export class BatchDetailsComponent implements OnInit {
  batchId: string;
  batch: Batch | null = null;
  documents: Document[] = [];
  classificationStats: ClassificationStats | null = null;
  isLoading = false;
  error: string | null = null;
  activeTabIndex = 0;
  
  // Pipeline view data
  pipelineEvents: any[] = [];
  pipelineOptions: any;
  
  // AI provider info
  aiProvider: string = 'OpenAI'; // This would come from a configuration service
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batchService: BatchService,
    private documentService: DocumentService,
    private classificationService: ClassificationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.batchId = this.route.snapshot.paramMap.get('id') || '';
  }
  
  ngOnInit(): void {
    this.loadBatchDetails();
    this.loadDocuments();
    this.loadClassificationStats();
    this.initPipelineChart();
  }
  
  loadBatchDetails(): void {
    this.isLoading = true;
    
    this.batchService.getBatchById(this.batchId)
      .subscribe({
        next: (batch) => {
          this.batch = batch;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load batch details';
          this.isLoading = false;
          console.error('Error loading batch details:', err);
        }
      });
  }
  
  loadDocuments(): void {
    this.documentService.getDocumentsByBatchId(this.batchId)
      .subscribe({
        next: (documents) => {
          this.documents = documents;
          this.updatePipelineEvents();
        },
        error: (err) => {
          console.error('Error loading documents:', err);
        }
      });
  }
  
  loadClassificationStats(): void {
    this.classificationService.getClassificationStatsByBatchId(this.batchId)
      .subscribe({
        next: (stats) => {
          this.classificationStats = stats;
        },
        error: (err) => {
          console.error('Error loading classification stats:', err);
        }
      });
  }
  
  initPipelineChart(): void {
    // Configure the pipeline chart options
    this.pipelineOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }
  
  updatePipelineEvents(): void {
    // Transform documents into timeline events
    this.pipelineEvents = this.documents.map(doc => {
      let status = 'pending';
      let color = 'var(--yellow-500)';
      let icon = 'pi pi-clock';
      
      if (doc.status === 'classified') {
        status = 'classified';
        color = 'var(--green-500)';
        icon = 'pi pi-check-circle';
      } else if (doc.status === 'error') {
        status = 'error';
        color = 'var(--red-500)';
        icon = 'pi pi-exclamation-circle';
      } else if (doc.status === 'processing') {
        status = 'processing';
        color = 'var(--blue-500)';
        icon = 'pi pi-spin pi-spinner';
      }
      
      return {
        status: status,
        date: new Date(doc.uploadedAt),
        icon: icon,
        color: color,
        document: doc
      };
    });
    
    // Sort by date
    this.pipelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  onUploadComplete(): void {
    // Reload documents and stats after upload
    this.loadDocuments();
    this.loadClassificationStats();
    this.loadBatchDetails();
  }
  
  confirmDeleteDocument(documentId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this document? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocument(documentId);
      }
    });
  }
  
  deleteDocument(documentId: string): void {
    this.documentService.deleteDocument(documentId)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document deleted successfully'
          });
          this.loadDocuments();
          this.loadClassificationStats();
          this.loadBatchDetails();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete document'
          });
          console.error('Error deleting document:', err);
        }
      });
  }
  
  confirmDeleteBatch(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this batch and all its documents? This action cannot be undone.',
      header: 'Confirm Batch Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteBatch();
      }
    });
  }
  
  deleteBatch(): void {
    this.batchService.deleteBatch(this.batchId)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch deleted successfully'
          });
          setTimeout(() => {
            this.router.navigate(['/batches']);
          }, 1500);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete batch'
          });
          console.error('Error deleting batch:', err);
        }
      });
  }
  
  uploadDocuments(): void {
    this.router.navigate(['/batches', this.batchId, 'upload']);
  }
  
  downloadReport(): void {
    // This would be implemented to call a report service
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Generating report...'
    });
    
    // Simulate report generation
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Report downloaded successfully'
      });
    }, 2000);
  }
  
  reclassifyDocument(documentId: string): void {
    // This would be implemented to call a reclassification service
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Reclassifying document...'
    });
  }
}