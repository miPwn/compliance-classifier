import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {
  batches: any[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  
  // Pagination and filtering
  currentPage: number = 0;
  pageSize: number = 10;
  sortField: string = 'uploadDate';
  sortOrder: number = -1; // Descending
  filterStatus: string = '';
  
  // Status filter options
  statusOptions: any[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Error', value: 'Error' }
  ];
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Simulate API call delay
    this.loading = true;
    setTimeout(() => {
      // Generate mock data
      const mockBatches = [];
      for (let i = 1; i <= 50; i++) {
        const randomStatus = this.getRandomStatus();
        const totalDocs = Math.floor(Math.random() * 30) + 5;
        const processedDocs = randomStatus === 'Completed' 
          ? totalDocs 
          : randomStatus === 'Pending' 
            ? 0 
            : Math.floor(Math.random() * totalDocs);
        
        mockBatches.push({
          batchId: i.toString(),
          name: `Batch ${i}`,
          uploadDate: this.getRandomDate(new Date(2024, 0, 1), new Date()),
          status: randomStatus,
          totalDocuments: totalDocs,
          processedDocuments: processedDocs,
          userId: 'user1'
        });
      }
      
      // Apply filters
      let filteredBatches = [...mockBatches];
      if (this.filterStatus) {
        filteredBatches = filteredBatches.filter(b => b.status === this.filterStatus);
      }
      
      // Apply sorting
      filteredBatches.sort((a, b) => {
        if (this.sortField === 'uploadDate') {
          return this.sortOrder * (new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        }
        return 0;
      });
      
      // Apply pagination
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      this.batches = filteredBatches.slice(start, end);
      this.totalRecords = filteredBatches.length;
      this.loading = false;
    }, 500);
  }
  
  private getRandomStatus(): string {
    const statuses = ['Pending', 'Processing', 'Completed', 'Error'];
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
  
  private getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  
  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.loadMockData();
  }
  
  onSortChange(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.loadMockData();
  }
  
  onFilterChange(): void {
    this.currentPage = 0;
    this.loadMockData();
  }
  
  createNewBatch(): void {
    this.router.navigate(['/batches/create']);
  }
  
  viewBatchDetails(batchId: string): void {
    this.router.navigate(['/batches', batchId]);
  }
}