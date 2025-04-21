import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';

export interface Classification {
  id: string;
  documentId: string;
  category: string;
  confidence: number;
  timestamp: string;
  isManual?: boolean;
}

export interface ClassificationCategory {
  id: string;
  name: string;
  description: string;
}

export interface ClassificationStats {
  totalDocuments: number;
  classifiedDocuments: number;
  pendingDocuments: number;
  categoryDistribution: CategoryDistribution[];
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface ClassificationUpdateRequest {
  category: string;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private apiUrl = environment.apiUrl;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_PREFIX = 'classification_';
  private readonly DOC_CLASSIFICATIONS_PREFIX = 'doc_classifications_';
  private readonly CATEGORIES_CACHE_KEY = 'classification_categories';
  private readonly BATCH_STATS_PREFIX = 'batch_classification_stats_';

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getClassificationsByDocumentId(documentId: string): Observable<Classification[]> {
    const cacheKey = `${this.DOC_CLASSIFICATIONS_PREFIX}${documentId}`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<Classification[]>(`${this.apiUrl}/documents/${documentId}/classifications`),
      this.CACHE_TTL
    );
  }

  getClassificationCategories(): Observable<ClassificationCategory[]> {
    // Categories rarely change, so we can cache them for longer
    return this.cacheService.cacheObservable(
      this.CATEGORIES_CACHE_KEY,
      this.http.get<ClassificationCategory[]>(`${this.apiUrl}/classifications/categories`),
      this.CACHE_TTL * 6 // 30 minutes
    );
  }

  getClassificationStatsByBatchId(batchId: string): Observable<ClassificationStats> {
    const cacheKey = `${this.BATCH_STATS_PREFIX}${batchId}`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<ClassificationStats>(`${this.apiUrl}/batches/${batchId}/classifications/stats`),
      this.CACHE_TTL
    );
  }

  updateClassification(classificationId: string, data: ClassificationUpdateRequest): Observable<Classification> {
    return this.http.put<Classification>(`${this.apiUrl}/classifications/${classificationId}`, data).pipe(
      tap((classification) => {
        // Invalidate document classifications cache
        this.cacheService.clear(`${this.DOC_CLASSIFICATIONS_PREFIX}${classification.documentId}`);
        // Invalidate batch stats cache - but we don't know which batch this belongs to
        // This would require additional logic to track document-to-batch relationships
        this.cacheService.clearByPrefix(this.BATCH_STATS_PREFIX);
      })
    );
  }

  manualClassify(documentId: string, data: ClassificationUpdateRequest): Observable<Classification> {
    return this.http.post<Classification>(`${this.apiUrl}/documents/${documentId}/classify/manual`, data).pipe(
      tap(() => {
        // Invalidate document classifications cache
        this.cacheService.clear(`${this.DOC_CLASSIFICATIONS_PREFIX}${documentId}`);
        // Invalidate batch stats cache - but we don't know which batch this belongs to
        this.cacheService.clearByPrefix(this.BATCH_STATS_PREFIX);
      })
    );
  }

  /**
   * Invalidates all classification-related cache entries
   */
  invalidateClassificationCache(): void {
    this.cacheService.clearByPrefix(this.CACHE_PREFIX);
    this.cacheService.clearByPrefix(this.DOC_CLASSIFICATIONS_PREFIX);
    this.cacheService.clearByPrefix(this.BATCH_STATS_PREFIX);
    this.cacheService.clear(this.CATEGORIES_CACHE_KEY);
  }
}