import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  recentBatches: any[] = [];
  documentStatistics: any;
  processingStatus: any;
  
  // Chart data
  categoryChartData: any;
  riskLevelChartData: any;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadMockData();
    this.initializeCharts();
  }

  private loadMockData(): void {
    // Mock data for recent batches
    this.recentBatches = [
      { batchId: '1', uploadDate: new Date(), status: 'Completed', totalDocuments: 15, processedDocuments: 15 },
      { batchId: '2', uploadDate: new Date(), status: 'Processing', totalDocuments: 20, processedDocuments: 12 },
      { batchId: '3', uploadDate: new Date(), status: 'Pending', totalDocuments: 8, processedDocuments: 0 },
      { batchId: '4', uploadDate: new Date(), status: 'Error', totalDocuments: 5, processedDocuments: 3 },
      { batchId: '5', uploadDate: new Date(), status: 'Completed', totalDocuments: 10, processedDocuments: 10 }
    ];
    
    // Mock data for document statistics
    this.documentStatistics = {
      totalDocuments: 58,
      documentsByCategory: [
        { category: 'DataPrivacy', count: 15 },
        { category: 'FinancialReporting', count: 20 },
        { category: 'WorkplaceConduct', count: 10 },
        { category: 'HealthCompliance', count: 8 },
        { category: 'Other', count: 5 }
      ],
      documentsByRiskLevel: [
        { riskLevel: 'Low', count: 30 },
        { riskLevel: 'Medium', count: 20 },
        { riskLevel: 'High', count: 8 }
      ]
    };
    
    // Mock data for processing status
    this.processingStatus = {
      pendingDocuments: 8,
      processingDocuments: 12,
      classifiedDocuments: 35,
      errorDocuments: 3
    };
  }
  
  private initializeCharts(): void {
    // Category chart data
    this.categoryChartData = {
      labels: this.documentStatistics.documentsByCategory.map((item: any) => item.category),
      datasets: [
        {
          data: this.documentStatistics.documentsByCategory.map((item: any) => item.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    };
    
    // Risk level chart data
    this.riskLevelChartData = {
      labels: this.documentStatistics.documentsByRiskLevel.map((item: any) => item.riskLevel),
      datasets: [
        {
          data: this.documentStatistics.documentsByRiskLevel.map((item: any) => item.count),
          backgroundColor: [
            '#4BC0C0',
            '#FFCE56',
            '#FF6384'
          ]
        }
      ]
    };
  }
  
  createNewBatch(): void {
    this.router.navigate(['/batches/create']);
  }
  
  viewBatchDetails(batchId: string): void {
    this.router.navigate(['/batches', batchId]);
  }
  
  viewAllBatches(): void {
    this.router.navigate(['/batches']);
  }
  
  viewAllDocuments(): void {
    this.router.navigate(['/documents']);
  }
}