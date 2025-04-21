import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiResponse, PaginatedResponse } from './batch.service';

export interface DocumentDto {
  documentId: string;
  fileName: string;
  fileType: string; // 'PDF', 'DOCX', 'TXT'
  fileSize: number;
  uploadDate: Date;
  content?: string;
  status: string; // 'Pending', 'Processing', 'Classified', 'Error'
  batchId: string;
  metadata?: DocumentMetadataDto;
  classification?: ClassificationDto;
}

export interface DocumentMetadataDto {
  pageCount: number;
  author: string;
  creationDate: Date;
  modificationDate: Date;
  keywords: string[];
  additionalProperties?: { [key: string]: any };
}

export interface ClassificationDto {
  classificationId: string;
  documentId: string;
  category: string;
  riskLevel: string; // 'Low', 'Medium', 'High'
  summary: string;
  classificationDate: Date;
  classifiedBy: string;
  confidenceScore: number;
  isOverridden: boolean;
}

export interface DocumentStatistics {
  totalDocuments: number;
  documentsByCategory: {
    category: string;
    count: number;
  }[];
  documentsByRiskLevel: {
    riskLevel: string;
    count: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = '/api/document'; // This would be replaced with the actual API URL
  
  constructor(private http: HttpClient) { }
  
  getDocumentsByBatchId(batchId: string): Observable<ApiResponse<DocumentDto[]>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    // Generate mock data
    const mockDocuments: DocumentDto[] = [];
    for (let i = 1; i <= 25; i++) {
      const randomStatus = this.getRandomStatus();
      
      mockDocuments.push({
        documentId: `${batchId}-${i}`,
        fileName: `Document_${i}.${this.getRandomFileType()}`,
        fileType: this.getRandomFileType().toUpperCase(),
        fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
        uploadDate: new Date(),
        status: randomStatus,
        batchId: batchId,
        classification: randomStatus === 'Classified' ? {
          classificationId: `class-${batchId}-${i}`,
          documentId: `${batchId}-${i}`,
          category: this.getRandomCategory(),
          riskLevel: this.getRandomRiskLevel(),
          summary: 'This is a sample summary of the document content.',
          classificationDate: new Date(),
          classifiedBy: 'AI',
          confidenceScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
          isOverridden: false
        } : undefined
      });
    }
    
    const response: ApiResponse<DocumentDto[]> = {
      data: mockDocuments,
      success: true,
      message: 'Documents retrieved successfully'
    };
    
    return of(response).pipe(delay(800)); // Simulate network delay
  }
  
  getDocumentById(documentId: string): Observable<ApiResponse<DocumentDto>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const randomStatus = 'Classified'; // Always classified for document details
    const [batchId, docNum] = documentId.split('-');
    
    const document: DocumentDto = {
      documentId: documentId,
      fileName: `Document_${docNum}.${this.getRandomFileType()}`,
      fileType: this.getRandomFileType().toUpperCase(),
      fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
      uploadDate: new Date(),
      status: randomStatus,
      batchId: batchId,
      metadata: {
        pageCount: Math.floor(Math.random() * 20) + 1,
        author: 'John Doe',
        creationDate: new Date(2024, 0, 1),
        modificationDate: new Date(),
        keywords: ['compliance', 'document', 'classification']
      },
      classification: {
        classificationId: `class-${documentId}`,
        documentId: documentId,
        category: this.getRandomCategory(),
        riskLevel: this.getRandomRiskLevel(),
        summary: 'This document contains information related to compliance requirements for data privacy. It outlines the procedures for handling sensitive customer information and the steps to be taken in case of a data breach. The document also includes references to relevant regulations and internal policies.',
        classificationDate: new Date(),
        classifiedBy: 'AI',
        confidenceScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        isOverridden: false
      }
    };
    
    const response: ApiResponse<DocumentDto> = {
      data: document,
      success: true,
      message: 'Document retrieved successfully'
    };
    
    return of(response).pipe(delay(500)); // Simulate network delay
  }
  
  searchDocuments(
    filters: any,
    page: number = 1,
    pageSize: number = 10,
    sortField: string = 'uploadDate',
    sortOrder: number = -1
  ): Observable<ApiResponse<PaginatedResponse<DocumentDto>>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    // Generate mock data
    const mockDocuments: DocumentDto[] = [];
    for (let i = 1; i <= 100; i++) {
      const randomStatus = this.getRandomStatus();
      const batchId = Math.floor(Math.random() * 10) + 1;
      
      mockDocuments.push({
        documentId: `${batchId}-${i}`,
        fileName: `Document_${i}.${this.getRandomFileType()}`,
        fileType: this.getRandomFileType().toUpperCase(),
        fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
        uploadDate: this.getRandomDate(new Date(2024, 0, 1), new Date()),
        status: randomStatus,
        batchId: batchId.toString(),
        classification: randomStatus === 'Classified' ? {
          classificationId: `class-${batchId}-${i}`,
          documentId: `${batchId}-${i}`,
          category: this.getRandomCategory(),
          riskLevel: this.getRandomRiskLevel(),
          summary: 'This is a sample summary of the document content.',
          classificationDate: new Date(),
          classifiedBy: 'AI',
          confidenceScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
          isOverridden: false
        } : undefined
      });
    }
    
    // Apply filters
    let filteredDocuments = [...mockDocuments];
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredDocuments = filteredDocuments.filter(d => 
        d.fileName.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      filteredDocuments = filteredDocuments.filter(d => 
        filters.fileTypes.includes(d.fileType)
      );
    }
    
    if (filters.categories && filters.categories.length > 0) {
      filteredDocuments = filteredDocuments.filter(d => 
        d.classification && filters.categories.includes(d.classification.category)
      );
    }
    
    if (filters.riskLevels && filters.riskLevels.length > 0) {
      filteredDocuments = filteredDocuments.filter(d => 
        d.classification && filters.riskLevels.includes(d.classification.riskLevel)
      );
    }
    
    if (filters.status) {
      filteredDocuments = filteredDocuments.filter(d => d.status === filters.status);
    }
    
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filteredDocuments = filteredDocuments.filter(d => {
        const uploadDate = new Date(d.uploadDate);
        return uploadDate >= startDate && uploadDate <= endDate;
      });
    }
    
    // Apply sorting
    filteredDocuments.sort((a, b) => {
      if (sortField === 'uploadDate') {
        return sortOrder * (new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      }
      return 0;
    });
    
    // Apply pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedDocuments = filteredDocuments.slice(start, end);
    
    const response: ApiResponse<PaginatedResponse<DocumentDto>> = {
      data: {
        items: paginatedDocuments,
        totalCount: filteredDocuments.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filteredDocuments.length / pageSize)
      },
      success: true,
      message: 'Documents retrieved successfully'
    };
    
    return of(response).pipe(delay(800)); // Simulate network delay
  }
  
  uploadDocuments(batchId: string, formData: FormData): Observable<ApiResponse<any>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const response: ApiResponse<any> = {
      data: {
        uploadedCount: Math.floor(Math.random() * 10) + 1,
        batchId: batchId
      },
      success: true,
      message: 'Documents uploaded successfully'
    };
    
    return of(response).pipe(delay(2000)); // Simulate network delay
  }
  
  getDocumentStatistics(): Observable<DocumentStatistics> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const statistics: DocumentStatistics = {
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
    
    return of(statistics).pipe(delay(500)); // Simulate network delay
  }
  
  generateDocumentReport(documentId: string): Observable<ApiResponse<any>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const response: ApiResponse<any> = {
      data: {
        reportId: Math.floor(Math.random() * 1000).toString(),
        documentId: documentId,
        generationDate: new Date(),
        reportType: 'SingleDocument',
        filePath: `/reports/document-${documentId}.pdf`
      },
      success: true,
      message: 'Report generated successfully'
    };
    
    return of(response).pipe(delay(1500)); // Simulate network delay
  }
  
  downloadDocument(documentId: string): void {
    // In a real application, this would trigger a file download
    // For demo purposes, we'll just log a message
    console.log(`Downloading document ${documentId}`);
    
    // Simulate a file download by opening a new window
    window.open(`/api/document/${documentId}/download`, '_blank');
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
  
  private getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}