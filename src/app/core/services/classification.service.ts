import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiResponse } from './batch.service';
import { ClassificationDto } from './document.service';

export interface ClassificationOverrideDto {
  category: string;
  riskLevel: string;
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private apiUrl = '/api/classification'; // This would be replaced with the actual API URL
  
  constructor(private http: HttpClient) { }
  
  getClassificationByDocumentId(documentId: string): Observable<ApiResponse<ClassificationDto>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const classification: ClassificationDto = {
      classificationId: `class-${documentId}`,
      documentId: documentId,
      category: this.getRandomCategory(),
      riskLevel: this.getRandomRiskLevel(),
      summary: 'This document contains information related to compliance requirements for data privacy. It outlines the procedures for handling sensitive customer information and the steps to be taken in case of a data breach. The document also includes references to relevant regulations and internal policies.',
      classificationDate: new Date(),
      classifiedBy: 'AI',
      confidenceScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      isOverridden: false
    };
    
    const response: ApiResponse<ClassificationDto> = {
      data: classification,
      success: true,
      message: 'Classification retrieved successfully'
    };
    
    return of(response).pipe(delay(500)); // Simulate network delay
  }
  
  getBatchClassifications(batchId: string): Observable<ApiResponse<ClassificationDto[]>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    // Generate mock data
    const mockClassifications: ClassificationDto[] = [];
    for (let i = 1; i <= 25; i++) {
      mockClassifications.push({
        classificationId: `class-${batchId}-${i}`,
        documentId: `${batchId}-${i}`,
        category: this.getRandomCategory(),
        riskLevel: this.getRandomRiskLevel(),
        summary: 'This is a sample summary of the document content.',
        classificationDate: new Date(),
        classifiedBy: 'AI',
        confidenceScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        isOverridden: false
      });
    }
    
    const response: ApiResponse<ClassificationDto[]> = {
      data: mockClassifications,
      success: true,
      message: 'Classifications retrieved successfully'
    };
    
    return of(response).pipe(delay(800)); // Simulate network delay
  }
  
  overrideClassification(
    classificationId: string,
    overrideData: ClassificationOverrideDto
  ): Observable<ApiResponse<ClassificationDto>> {
    // In a real application, this would make an HTTP request to the API
    // For demo purposes, we'll return mock data
    
    const documentId = classificationId.replace('class-', '');
    
    const classification: ClassificationDto = {
      classificationId: classificationId,
      documentId: documentId,
      category: overrideData.category,
      riskLevel: overrideData.riskLevel,
      summary: overrideData.summary,
      classificationDate: new Date(),
      classifiedBy: 'User',
      confidenceScore: 1.0, // User override has 100% confidence
      isOverridden: true
    };
    
    const response: ApiResponse<ClassificationDto> = {
      data: classification,
      success: true,
      message: 'Classification overridden successfully'
    };
    
    return of(response).pipe(delay(1000)); // Simulate network delay
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
}