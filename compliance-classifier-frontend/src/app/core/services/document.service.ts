import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';

export interface Document {
  id: string;
  batchId: string;
  filename: string;
  status: string;
  uploadedAt: string;
  fileSize?: number;
  contentType?: string;
  classifications?: Classification[];
}

export interface Classification {
  category: string;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_PREFIX = 'document_';
  private readonly BATCH_DOCUMENTS_PREFIX = 'batch_documents_';

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getDocumentsByBatchId(batchId: string): Observable<Document[]> {
    const cacheKey = `${this.BATCH_DOCUMENTS_PREFIX}${batchId}`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<Document[]>(`${this.apiUrl}/batches/${batchId}/documents`),
      this.CACHE_TTL
    );
  }

  getDocumentById(id: string): Observable<Document> {
    const cacheKey = `${this.CACHE_PREFIX}${id}`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<Document>(`${this.apiUrl}/documents/${id}`),
      this.CACHE_TTL
    );
  }

  uploadDocument(batchId: string, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Document>(`${this.apiUrl}/batches/${batchId}/documents`, formData).pipe(
      tap(() => {
        // Invalidate batch documents cache
        this.cacheService.clear(`${this.BATCH_DOCUMENTS_PREFIX}${batchId}`);
      })
    );
  }

  deleteDocument(id: string): Observable<null> {
    return this.http.delete<null>(`${this.apiUrl}/documents/${id}`).pipe(
      tap(() => {
        // Invalidate document cache
        this.cacheService.clear(`${this.CACHE_PREFIX}${id}`);
        // We don't know which batch this document belongs to, so we can't invalidate the batch documents cache
        // Instead, we'll invalidate all batch documents caches
        this.cacheService.clearByPrefix(this.BATCH_DOCUMENTS_PREFIX);
      })
    );
  }

  getDocumentContent(id: string): Observable<Blob> {
    // Don't cache binary content
    return this.http.get(`${this.apiUrl}/documents/${id}/content`, {
      responseType: 'blob'
    });
  }

  /**
   * Invalidates all document-related cache entries
   */
  invalidateDocumentCache(): void {
    this.cacheService.clearByPrefix(this.CACHE_PREFIX);
    this.cacheService.clearByPrefix(this.BATCH_DOCUMENTS_PREFIX);
  }
}