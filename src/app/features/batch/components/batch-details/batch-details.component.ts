import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss']
})
export class BatchDetailsComponent implements OnInit {
  batchId: string = '';
  batch: any;
  documents: any[] = [];
  loading: boolean = true;
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  
  // Sorting
  sortField: string = 'uploadDate';
  sortOrder: number = -1; // Descending
  
  // Filtering
  filterStatus: string = '';
  
  // Status filter options
  statusOptions: any[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Classified', value: 'Classified' },
    { label: 'Error', value: 'Error' }
  ];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('id') || '';
    this.loadBatchDetails();
    this.loadBatchDocuments();
  }
  
  private loadBatchDetails(): void {
    // Simulate API call to get batch details
    setTimeout(() => {
      this.batch = {
        batchId: this.batchId,
        name: `Batch ${this.batchId}`,
        uploadDate: new Date(),
        status: 'Processing',
        totalDocuments: 25,
        processedDocuments: 15
      };
    }, 500);
  }
  
  private loadBatchDocuments(): void {
    // Simulate API call to get batch documents
    this.loading = true;
    
    setTimeout(() => {
      // Generate mock data
      const mockDocuments = [];
      for (let i = 1; i <= 25; i++) {
        const randomStatus = this.getRandomStatus();
        
        mockDocuments.push({
          documentId: `${this.batchId}-${i}`,
          fileName: `Document_${i}.${this.getRandomFileType()}`,
          fileType: this.getRandomFileType().toUpperCase(),
          fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
          uploadDate: new Date(),
          status: randomStatus,
          batchId: this.batchId,
          classification: randomStatus === 'Classified' ? {
            category: this.getRandomCategory(),
            riskLevel: this.getRandomRiskLevel(),
            confidenceScore: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
          } : null
        });
      }
      
      // Apply filters
      let filteredDocuments = [...mockDocuments];
      if (this.filterStatus) {
        filteredDocuments = filteredDocuments.filter(d => d.status === this.filterStatus);
      }
      
      // Apply sorting
      filteredDocuments.sort((a, b) => {
        if (this.sortField === 'uploadDate') {
          return this.sortOrder * (new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        }
        return 0;
      });
      
      // Apply pagination
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      this.documents = filteredDocuments.slice(start, end);
      this.totalRecords = filteredDocuments.length;
      this.loading = false;
    }, 800);
  }
  
  private getRandomStatus(): string {
    const statuses = ['Pending', 'Processing', 'Classified', 'Error'];
    const weights = [0.1, 0.2, 0.6, 0.1]; // Weighted probabilities
    
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return statuses[i];
      }
    }
    return statuses[0];
  }
  
  private getRandomFileType(): string {
    const types = ['pdf', 'docx', 'txt'];
    const weights = [0.6, 0.3, 0.1]; // Weighted probabilities
    
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return types[i];
      }
    }
    return types[0];
  }
  
  private getRandomCategory(): string {
    const categories = ['DataPrivacy', 'FinancialReporting', 'WorkplaceConduct', 'HealthCompliance', 'Other'];
    return categories[Math.floor(Math.random() * categories.length)];
  }
  
  private getRandomRiskLevel(): string {
    const riskLevels = ['Low', 'Medium', 'High'];
    const weights = [0.6, 0.3, 0.1]; // Weighted probabilities
    
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return riskLevels[i];
      }
    }
    return riskLevels[0];
  }
  
  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.loadBatchDocuments();
  }
  
  onSortChange(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.loadBatchDocuments();
  }
  
  onFilterChange(): void {
    this.currentPage = 0;
    this.loadBatchDocuments();
  }
  
  uploadMoreDocuments(): void {
    this.router.navigate(['/batches', this.batchId, 'upload']);
  }
  
  generateBatchReport(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Generating Report',
      detail: 'The batch report is being generated'
    });
    
    // Simulate report generation
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Report Generated',
        detail: 'The batch report has been generated successfully'
      });
    }, 2000);
  }
  
  viewDocumentDetails(documentId: string): void {
    this.router.navigate(['/documents', documentId]);
  }
  
  deleteBatch(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this batch?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Simulate batch deletion
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Batch Deleted',
            detail: 'The batch has been deleted successfully'
          });
          
          this.router.navigate(['/batches']);
        }, 1000);
      }
    });
  }
}