import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface PendingOperation {
  id: string;
  url: string;
  method: string;
  body?: any;
  timestamp: number;
  retryCount: number;
}

/**
 * Service for handling offline operations and background synchronization
 * Provides optimistic UI updates and offline support
 */
@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private readonly DB_NAME = 'compliance-classifier-offline';
  private readonly STORE_NAME = 'pending-operations';
  private readonly MAX_RETRY_COUNT = 5;
  private db: IDBDatabase | null = null;
  private dbInitialized = false;
  private dbInitPromise: Promise<boolean> | null = null;
  private syncInProgress = false;

  constructor(private http: HttpClient) {
    if (environment.features.offlineSupport) {
      this.initIndexedDB();
      
      // Listen for online/offline events
      window.addEventListener('online', () => this.syncPendingOperations());
      
      // Attempt to sync on startup
      if (navigator.onLine) {
        this.syncPendingOperations();
      }
    }
  }

  /**
   * Initialize IndexedDB for storing pending operations
   */
  private initIndexedDB(): Promise<boolean> {
    if (this.dbInitPromise) {
      return this.dbInitPromise;
    }

    this.dbInitPromise = new Promise<boolean>((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB is not supported in this browser. Offline support will be limited.');
        resolve(false);
        return;
      }

      const request = window.indexedDB.open(this.DB_NAME, 1);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB for offline support:', event);
        resolve(false);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.dbInitialized = true;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.dbInitPromise;
  }

  /**
   * Perform an HTTP request with offline support
   * If offline, the request will be stored and executed when online
   * @param method HTTP method
   * @param url URL to request
   * @param body Request body (for POST, PUT, PATCH)
   * @param optimisticResponse Optional response to return immediately for optimistic UI updates
   * @returns Observable of the response
   */
  performRequest<T>(
    method: string, 
    url: string, 
    body?: any, 
    optimisticResponse?: T
  ): Observable<T> {
    // If online, try to perform the request immediately
    if (navigator.onLine) {
      return this.http.request<T>(method, url, { body }).pipe(
        catchError(error => {
          // If the request fails due to network issues, store it for later
          if (error.status === 0 || error.status === 504) {
            return this.storeOperation<T>(method, url, body, optimisticResponse);
          }
          return throwError(() => error);
        })
      );
    } else {
      // If offline, store the operation and return optimistic response
      return this.storeOperation<T>(method, url, body, optimisticResponse);
    }
  }

  /**
   * Store an operation for later execution
   * @param method HTTP method
   * @param url URL to request
   * @param body Request body
   * @param optimisticResponse Optional response to return immediately
   * @returns Observable of the optimistic response or an error
   */
  private storeOperation<T>(
    method: string, 
    url: string, 
    body?: any, 
    optimisticResponse?: T
  ): Observable<T> {
    if (!environment.features.offlineSupport) {
      return throwError(() => new Error('Offline support is disabled'));
    }

    return from(this.initIndexedDB()).pipe(
      switchMap(initialized => {
        if (!initialized || !this.db) {
          return throwError(() => new Error('IndexedDB is not available for offline support'));
        }

        const operation: PendingOperation = {
          id: `${Date.now()}-${Math.random().toString().substr(2, 9)}`,
          url,
          method,
          body,
          timestamp: Date.now(),
          retryCount: 0
        };

        return from(this.savePendingOperation(operation)).pipe(
          map(() => {
            // Return optimistic response if provided
            if (optimisticResponse !== undefined) {
              return optimisticResponse;
            }
            
            // Otherwise, create a basic success response
            const defaultResponse = {
              success: true,
              message: 'Operation queued for processing when online',
              offlineId: operation.id
            } as unknown as T;
            
            return defaultResponse;
          })
        );
      })
    );
  }

  /**
   * Save a pending operation to IndexedDB
   * @param operation Operation to save
   * @returns Promise that resolves when the operation is saved
   */
  private savePendingOperation(operation: PendingOperation): Promise<void> {
    if (!this.db) {
      return Promise.reject('IndexedDB not initialized');
    }

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        const request = store.add(operation);

        request.onsuccess = () => resolve(undefined);
        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error saving pending operation:', error);
        reject(error);
      }
    });
  }

  /**
   * Sync all pending operations with the server
   * @returns Promise that resolves when all operations are synced
   */
  syncPendingOperations(): Promise<void> {
    if (!environment.features.offlineSupport || this.syncInProgress || !navigator.onLine) {
      return Promise.resolve();
    }

    this.syncInProgress = true;

    return this.initIndexedDB()
      .then(initialized => {
        if (!initialized || !this.db) {
          throw new Error('IndexedDB is not available for offline sync');
        }

        return this.getPendingOperations();
      })
      .then(operations => {
        if (operations.length === 0) {
          return Promise.resolve();
        }

        // Sort operations by timestamp (oldest first)
        operations.sort((a, b) => a.timestamp - b.timestamp);

        // Process operations sequentially
        return operations.reduce(
          (promise, operation) => promise.then(() => this.processPendingOperation(operation)),
          Promise.resolve()
        );
      })
      .catch(error => {
        console.error('Error syncing pending operations:', error);
      })
      .finally(() => {
        this.syncInProgress = false;
      });
  }

  /**
   * Get all pending operations from IndexedDB
   * @returns Promise that resolves with all pending operations
   */
  private getPendingOperations(): Promise<PendingOperation[]> {
    if (!this.db) {
      return Promise.resolve([]);
    }

    return new Promise<PendingOperation[]>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error getting pending operations:', error);
        reject(error);
      }
    });
  }

  /**
   * Process a single pending operation
   * @param operation Operation to process
   * @returns Promise that resolves when the operation is processed
   */
  private processPendingOperation(operation: PendingOperation): Promise<void> {
    return new Promise<void>((resolve) => {
      this.http.request(operation.method, operation.url, { body: operation.body })
        .pipe(
          tap(() => {
            // On success, remove the operation from the store
            this.deletePendingOperation(operation.id)
              .catch(error => console.error('Error deleting pending operation:', error));
          }),
          catchError(error => {
            // On error, increment retry count or remove if max retries reached
            if (operation.retryCount >= this.MAX_RETRY_COUNT) {
              this.deletePendingOperation(operation.id)
                .catch(error => console.error('Error deleting failed operation:', error));
            } else {
              operation.retryCount++;
              this.updatePendingOperation(operation)
                .catch(error => console.error('Error updating pending operation:', error));
            }
            return of(error);
          })
        )
        .subscribe(() => resolve(undefined));
    });
  }

  /**
   * Delete a pending operation from IndexedDB
   * @param id Operation ID
   * @returns Promise that resolves when the operation is deleted
   */
  private deletePendingOperation(id: string): Promise<void> {
    if (!this.db) {
      return Promise.reject('IndexedDB not initialized');
    }

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        const request = store.delete(id);

        request.onsuccess = () => resolve(undefined);
        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error deleting pending operation:', error);
        reject(error);
      }
    });
  }

  /**
   * Update a pending operation in IndexedDB
   * @param operation Operation to update
   * @returns Promise that resolves when the operation is updated
   */
  private updatePendingOperation(operation: PendingOperation): Promise<void> {
    if (!this.db) {
      return Promise.reject('IndexedDB not initialized');
    }

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        const request = store.put(operation);

        request.onsuccess = () => resolve(undefined);
        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error updating pending operation:', error);
        reject(error);
      }
    });
  }

  /**
   * Get the count of pending operations
   * @returns Observable of the count
   */
  getPendingOperationCount(): Observable<number> {
    return from(this.initIndexedDB()).pipe(
      switchMap(initialized => {
        if (!initialized || !this.db) {
          return of(0);
        }

        return from(this.getPendingOperations()).pipe(
          map(operations => operations.length)
        );
      })
    );
  }

  /**
   * Check if the application is online
   * @returns True if online, false otherwise
   */
  isOnline(): boolean {
    return navigator.onLine;
  }
}