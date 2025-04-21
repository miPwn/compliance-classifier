import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, interval, filter } from 'rxjs';
import { MessageService } from 'primeng/api';

import { BatchService, Batch } from '../../../core/services/batch.service';
import { ClassificationService, ClassificationCategory, CategoryDistribution } from '../../../core/services/classification.service';
import { DocumentService, Document } from '../../../core/services/document.service';


// Custom components
import { PipelineTimelineComponent } from './pipeline-timeline/pipeline-timeline.component';
import { RecentBatchesComponent } from './recent-batches/recent-batches.component';
import { CategorySummaryComponent } from './category-summary/category-summary.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

// Extended interface for category summary component
interface CategoryWithCount extends ClassificationCategory {
  documentCount?: number;
  riskLevel?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PipelineTimelineComponent,
    RecentBatchesComponent,
    CategorySummaryComponent,
    FileUploadComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileUpload!: FileUploadComponent;
  
  recentBatches: Batch[] = [];
  classificationCategories: ClassificationCategory[] = [];
  classificationCategoriesWithCounts: CategoryWithCount[] = [];
  recentDocuments: Document[] = [];
  pipelineEvents: any[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Auto-refresh settings
  autoRefresh = true;
  refreshInterval = 30000; // 30 seconds
  refreshSubscription: Subscription | null = null;
  routerSubscription: Subscription | null = null;
  
  // Selected batch for upload
  selectedBatchId: string = '';

  constructor(
    private batchService: BatchService,
    private classificationService: ClassificationService,
    private documentService: DocumentService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllData();
    this.setupAutoRefresh();
    this.setupRouterListener();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  /**
   * Set up router event listener to refresh data when navigating to dashboard
   */
  setupRouterListener(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // If navigating to dashboard, refresh data
        if (event.url === '/dashboard') {
          this.loadAllData();
        }
      });
  }
  
  loadAllData(): void {
    this.loadRecentBatches();
    this.loadClassificationCategories();
    this.loadRecentDocuments();
  }

  loadRecentBatches(): void {
    this.isLoading = true;
    this.batchService.getBatches()
      .subscribe({
        next: (batches) => {
          this.recentBatches = batches.slice(0, 5); // Show only the 5 most recent batches
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load recent batches';
          this.isLoading = false;
          console.error('Error loading batches:', err);
        }
      });
  }

  loadClassificationCategories(): void {
    this.classificationService.getClassificationCategories()
      .subscribe({
        next: (categories) => {
          this.classificationCategories = categories;
          
          // For demo purposes, add mock document counts and risk levels
          // In a real app, this would come from the API
          this.classificationCategoriesWithCounts = categories.map((category, index) => {
            const count = Math.floor(Math.random() * 100) + 1; // Random count between 1-100
            const riskLevels = ['Low', 'Medium', 'High'];
            const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
            
            return {
              ...category,
              documentCount: count,
              riskLevel: riskLevel
            };
          });
        },
        error: (err) => {
          console.error('Error loading classification categories:', err);
        }
      });
  }
  
  loadRecentDocuments(): void {
    // This would be a new API endpoint to get recent documents across all batches
    // For now, we'll simulate it by getting documents from recent batches
    if (this.recentBatches.length > 0) {
      const batchIds = this.recentBatches.map(batch => batch.id);
      
      // For demonstration, we'll just use the first batch
      if (batchIds.length > 0) {
        this.documentService.getDocumentsByBatchId(batchIds[0])
          .subscribe({
            next: (documents) => {
              this.recentDocuments = documents;
              this.updatePipelineEvents();
            },
            error: (err) => {
              console.error('Error loading recent documents:', err);
            }
          });
      }
    } else {
      this.recentDocuments = [];
      this.updatePipelineEvents();
    }
  }
  
  updatePipelineEvents(): void {
    // Transform documents into timeline events
    this.pipelineEvents = this.recentDocuments.map(doc => {
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
      
      // Find the batch name
      const batch = this.recentBatches.find(b => b.id === doc.batchId);
      
      return {
        status: status,
        time: new Date(doc.uploadedAt),
        icon: icon,
        color: color,
        filename: doc.filename,
        batchName: batch ? batch.name : 'Unknown Batch'
      };
    });
    
    // Sort by date (most recent first)
    this.pipelineEvents.sort((a, b) => b.time.getTime() - a.time.getTime());
    
    // Limit to 10 most recent events
    this.pipelineEvents = this.pipelineEvents.slice(0, 10);
  }
  
  setupAutoRefresh(): void {
    if (this.autoRefresh) {
      this.refreshSubscription = interval(this.refreshInterval)
        .subscribe(() => {
          this.refreshData();
        });
    }
  }
  
  toggleAutoRefresh(autoRefresh: boolean): void {
    this.autoRefresh = autoRefresh;
    
    if (this.autoRefresh) {
      this.setupAutoRefresh();
    } else if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }
  
  refreshData(): void {
    this.loadAllData();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Refreshed',
      detail: 'Dashboard data has been refreshed'
    });
  }
  
  /**
   * Force refresh data without showing notification
   * Used when we need to silently refresh data
   */
  forceRefresh(): void {
    this.loadAllData();
  }

  viewBatchDetails(batchId: string): void {
    this.router.navigate(['/batches', batchId]);
  }

  createNewBatch(): void {
    // Navigate to the dedicated batch creation screen
    this.router.navigate(['/batches/create']);
  }
  
  uploadToBatch(batchId: string): void {
    // Set the selected batch ID and show the file upload component
    this.selectedBatchId = batchId;
  }
  
  /**
   * This method is no longer used since we're navigating to a dedicated batch creation screen
   * It's kept for reference in case we need to handle batch creation events in the future
   */
  
  /**
   * Handle upload complete event from the file upload component
   * @param event Upload event containing batch ID and files
   */
  onUploadComplete(event: any): void {
    // Refresh the documents and pipeline events
    this.loadRecentDocuments();
    
    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Upload Complete',
      detail: `${event.files.length} files uploaded successfully to batch`
    });
  }
  
  deleteBatch(batchId: string): void {
    // Confirm before deleting
    if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      this.isLoading = true;
      this.batchService.deleteBatch(batchId)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Batch Deleted',
              detail: 'The batch has been successfully deleted'
            });
            this.loadRecentBatches();
          },
          error: (err) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete batch'
            });
            console.error('Error deleting batch:', err);
          }
        });
    }
  }
}