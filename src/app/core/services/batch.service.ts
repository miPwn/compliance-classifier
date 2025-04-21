import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface BatchDto {
  batchId: string;
  name?: string;
  uploadDate: Date;
  userId: string;
  status: string; // 'Pending', 'Processing', 'Completed', 'Error'
  totalDocuments: number;
  processedDocuments: number;
  completionDate?: Date;
}

export interface BatchSummary {
  batchId: string;
  uploadDate: Date;
  status: string;
  totalDocuments: number;
  processedDocuments: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private apiUrl = '/api/batch'; // This would be replaced with the actual API URL
  
  constructor(private http: HttpClient) { }
  
  getBatches(
    page: number = 1,
    pageSize: number = 10,
    sortField: string = 'uploadDate',
    sortOrder: number = -1,
    filterStatus?: string
  ): Observable<ApiResponse<PaginatedResponse<BatchDto>>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    // Generate mock data
    const mockBatches: BatchDto[] = [];
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
    if (filterStatus) {
      filteredBatches = filteredBatches.filter(b => b.status === filterStatus);
    }
    
    // Apply sorting
    filteredBatches.sort((a, b) => {
      if (sortField === 'uploadDate') {
        return sortOrder * (new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      }
      return 0;
    });
    
    // Apply pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedBatches = filteredBatches.slice(start, end);
    
    const response: ApiResponse<PaginatedResponse<BatchDto>> = {
      data: {
        items: paginatedBatches,
        totalCount: filteredBatches.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filteredBatches.length / pageSize)
      },
      success: true,
      message: 'Batches retrieved successfully'
    };
    
    return of(response).pipe(delay(500)); // Simulate network delay
  }
  
  getBatchById(batchId: string): Observable<ApiResponse<BatchDto>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const randomStatus = this.getRandomStatus();
    const totalDocs = Math.floor(Math.random() * 30) + 5;
    const processedDocs = randomStatus === 'Completed' 
      ? totalDocs 
      : randomStatus === 'Pending' 
        ? 0 
        : Math.floor(Math.random() * totalDocs);
    
    const batch: BatchDto = {
      batchId: batchId,
      name: `Batch ${batchId}`,
      uploadDate: this.getRandomDate(new Date(2024, 0, 1), new Date()),
      status: randomStatus,
      totalDocuments: totalDocs,
      processedDocuments: processedDocs,
      userId: 'user1'
    };
    
    const response: ApiResponse<BatchDto> = {
      data: batch,
      success: true,
      message: 'Batch retrieved successfully'
    };
    
    return of(response).pipe(delay(500)); // Simulate network delay
  }
  
  createBatch(data: { name?: string, description?: string }): Observable<ApiResponse<string>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const batchId = Math.floor(Math.random() * 1000).toString();
    
    const response: ApiResponse<string> = {
      data: batchId,
      success: true,
      message: 'Batch created successfully'
    };
    
    return of(response).pipe(delay(1000)); // Simulate network delay
  }
  
  getRecentBatches(): Observable<BatchSummary[]> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const mockBatches: BatchSummary[] = [];
    for (let i = 1; i <= 5; i++) {
      const randomStatus = this.getRandomStatus();
      const totalDocs = Math.floor(Math.random() * 30) + 5;
      const processedDocs = randomStatus === 'Completed' 
        ? totalDocs 
        : randomStatus === 'Pending' 
          ? 0 
          : Math.floor(Math.random() * totalDocs);
      
      mockBatches.push({
        batchId: i.toString(),
        uploadDate: this.getRandomDate(new Date(2024, 0, 1), new Date()),
        status: randomStatus,
        totalDocuments: totalDocs,
        processedDocuments: processedDocs
      });
    }
    
    return of(mockBatches).pipe(delay(500)); // Simulate network delay
  }
  
  getProcessingStatus(): Observable<any> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const status = {
      pendingDocuments: Math.floor(Math.random() * 10),
      processingDocuments: Math.floor(Math.random() * 20),
      classifiedDocuments: Math.floor(Math.random() * 100) + 30,
      errorDocuments: Math.floor(Math.random() * 5)
    };
    
    return of(status).pipe(delay(500)); // Simulate network delay
  }
  
  generateBatchReport(batchId: string): Observable<ApiResponse<any>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const response: ApiResponse<any> = {
      data: {
        reportId: Math.floor(Math.random() * 1000).toString(),
        batchId: batchId,
        generationDate: new Date(),
        reportType: 'BatchSummary',
        filePath: `/reports/batch-${batchId}.pdf`
      },
      success: true,
      message: 'Report generated successfully'
    };
    
    return of(response).pipe(delay(2000)); // Simulate network delay
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
}