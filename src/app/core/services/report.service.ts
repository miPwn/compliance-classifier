import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiResponse } from './batch.service';

export interface ReportDto {
  reportId: string;
  batchId?: string;
  documentId?: string;
  generationDate: Date;
  reportType: string; // 'SingleDocument', 'BatchSummary'
  filePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = '/api/report'; // This would be replaced with the actual API URL
  
  constructor(private http: HttpClient) { }
  
  generateDocumentReport(documentId: string): Observable<ApiResponse<ReportDto>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const report: ReportDto = {
      reportId: Math.floor(Math.random() * 1000).toString(),
      documentId: documentId,
      generationDate: new Date(),
      reportType: 'SingleDocument',
      filePath: `/reports/document-${documentId}.pdf`
    };
    
    const response: ApiResponse<ReportDto> = {
      data: report,
      success: true,
      message: 'Report generated successfully'
    };
    
    return of(response).pipe(delay(1500)); // Simulate network delay
  }
  
  generateBatchReport(batchId: string): Observable<ApiResponse<ReportDto>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const report: ReportDto = {
      reportId: Math.floor(Math.random() * 1000).toString(),
      batchId: batchId,
      generationDate: new Date(),
      reportType: 'BatchSummary',
      filePath: `/reports/batch-${batchId}.pdf`
    };
    
    const response: ApiResponse<ReportDto> = {
      data: report,
      success: true,
      message: 'Report generated successfully'
    };
    
    return of(response).pipe(delay(2000)); // Simulate network delay
  }
  
  getReportById(reportId: string): Observable<ApiResponse<ReportDto>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const report: ReportDto = {
      reportId: reportId,
      batchId: Math.random() > 0.5 ? Math.floor(Math.random() * 10).toString() : undefined,
      documentId: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 20)}` : undefined,
      generationDate: new Date(),
      reportType: Math.random() > 0.5 ? 'SingleDocument' : 'BatchSummary',
      filePath: `/reports/report-${reportId}.pdf`
    };
    
    const response: ApiResponse<ReportDto> = {
      data: report,
      success: true,
      message: 'Report retrieved successfully'
    };
    
    return of(response).pipe(delay(500)); // Simulate network delay
  }
  
  downloadReport(reportId: string): void {
    // In a real application, this would trigger a file download
    // For demo purposes, we'll just log a message
    console.log(`Downloading report ${reportId}`);
    
    // Simulate a file download by opening a new window
    window.open(`/api/report/${reportId}/download`, '_blank');
  }
  
  shareReportByEmail(reportId: string, email: string): Observable<ApiResponse<any>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const response: ApiResponse<any> = {
      data: {
        reportId: reportId,
        email: email,
        sentAt: new Date()
      },
      success: true,
      message: `Report shared successfully with ${email}`
    };
    
    return of(response).pipe(delay(1000)); // Simulate network delay
  }
  
  getReportList(): Observable<ApiResponse<ReportDto[]>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    // Generate mock data
    const mockReports: ReportDto[] = [];
    for (let i = 1; i <= 20; i++) {
      const isBatchReport = Math.random() > 0.5;
      
      mockReports.push({
        reportId: i.toString(),
        batchId: isBatchReport ? Math.floor(Math.random() * 10).toString() : undefined,
        documentId: !isBatchReport ? `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 20)}` : undefined,
        generationDate: this.getRandomDate(new Date(2024, 0, 1), new Date()),
        reportType: isBatchReport ? 'BatchSummary' : 'SingleDocument',
        filePath: `/reports/report-${i}.pdf`
      });
    }
    
    // Sort by generation date (newest first)
    mockReports.sort((a, b) => new Date(b.generationDate).getTime() - new Date(a.generationDate).getTime());
    
    const response: ApiResponse<ReportDto[]> = {
      data: mockReports,
      success: true,
      message: 'Reports retrieved successfully'
    };
    
    return of(response).pipe(delay(800)); // Simulate network delay
  }
  
  private getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}