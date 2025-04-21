import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';

export interface Batch {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  documentCount: number;
  documents?: Document[];
}

export interface Document {
  id: string;
  filename: string;
  status: string;
}

export interface BatchCreateRequest {
  name: string;
  description?: string;
}

export interface BatchUpdateRequest {
  name?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private apiUrl = `${environment.apiUrl}/batches`;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_PREFIX = 'batch_';

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getBatches(): Observable<Batch[]> {
    const cacheKey = `${this.CACHE_PREFIX}all`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<Batch[]>(this.apiUrl),
      this.CACHE_TTL
    );
  }

  getBatchById(id: string): Observable<Batch> {
    const cacheKey = `${this.CACHE_PREFIX}${id}`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<Batch>(`${this.apiUrl}/${id}`),
      this.CACHE_TTL
    );
  }

  createBatch(batch: BatchCreateRequest): Observable<Batch> {
    return this.http.post<Batch>(this.apiUrl, batch).pipe(
      tap(() => this.invalidateBatchCache())
    );
  }

  updateBatch(id: string, batch: BatchUpdateRequest): Observable<Batch> {
    return this.http.put<Batch>(`${this.apiUrl}/${id}`, batch).pipe(
      tap(() => {
        // Invalidate specific batch and all batches cache
        this.cacheService.clear(`${this.CACHE_PREFIX}${id}`);
        this.cacheService.clear(`${this.CACHE_PREFIX}all`);
      })
    );
  }

  deleteBatch(id: string): Observable<null> {
    return this.http.delete<null>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.invalidateBatchCache())
    );
  }

  /**
   * Invalidates all batch-related cache entries
   */
  private invalidateBatchCache(): void {
    this.cacheService.clearByPrefix(this.CACHE_PREFIX);
  }
}