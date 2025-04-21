import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface CacheEntry {
  data: any;
  expiry: number;
  createdAt: number;
  size?: number; // Approximate size in bytes
}

/**
 * Enhanced cache service with support for:
 * - In-memory caching
 * - Persistent storage using IndexedDB
 * - Cache size management
 * - Detailed cache statistics
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private memoryCache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = environment.caching?.defaultTTL || 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly MAX_CACHE_SIZE = environment.caching?.maxCacheSize || 50 * 1024 * 1024; // 50MB default
  private readonly USE_PERSISTENT_STORAGE = environment.caching?.persistentStorage || false;
  private readonly DB_NAME = 'compliance-classifier-cache';
  private readonly STORE_NAME = 'cache-store';
  private db: IDBDatabase | null = null;
  private dbInitialized = false;
  private dbInitPromise: Promise<boolean> | null = null;

  // Cache statistics
  private cacheStats = {
    hits: 0,
    misses: 0,
    totalEntries: 0,
    totalSize: 0,
    oldestEntry: 0,
    newestEntry: 0
  };

  constructor() {
    if (this.USE_PERSISTENT_STORAGE) {
      this.initIndexedDB();
    }
  }

  /**
   * Initialize IndexedDB for persistent caching
   */
  private initIndexedDB(): Promise<boolean> {
    if (this.dbInitPromise) {
      return this.dbInitPromise;
    }

    this.dbInitPromise = new Promise<boolean>((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB is not supported in this browser. Falling back to in-memory cache only.');
        resolve(false);
        return;
      }

      const request = window.indexedDB.open(this.DB_NAME, 1);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
        resolve(false);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.dbInitialized = true;
        this.loadCacheFromIndexedDB();
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          store.createIndex('expiry', 'expiry', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });

    return this.dbInitPromise;
  }

  /**
   * Load cache entries from IndexedDB into memory cache
   */
  private async loadCacheFromIndexedDB(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const entry = cursor.value;
          // Skip expired entries
          if (entry.expiry > Date.now()) {
            this.memoryCache.set(entry.key, {
              data: entry.data,
              expiry: entry.expiry,
              createdAt: entry.createdAt,
              size: entry.size
            });
          } else {
            // Delete expired entries
            this.deleteFromIndexedDB(entry.key);
          }
          cursor.continue();
        } else {
          // Update cache statistics
          this.updateCacheStats();
        }
      };
    } catch (error) {
      console.error('Error loading cache from IndexedDB:', error);
    }
  }

  /**
   * Save an entry to IndexedDB
   */
  private saveToIndexedDB(key: string, entry: CacheEntry): Promise<void> {
    if (!this.db) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        const request = store.put({
          key,
          data: entry.data,
          expiry: entry.expiry,
          createdAt: entry.createdAt,
          size: entry.size
        });

        request.onsuccess = () => resolve(undefined);
        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error saving to IndexedDB:', error);
        reject(error);
      }
    });
  }

  /**
   * Delete an entry from IndexedDB
   */
  private deleteFromIndexedDB(key: string): Promise<void> {
    if (!this.db) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        const request = store.delete(key);

        request.onsuccess = () => resolve(undefined);
        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error deleting from IndexedDB:', error);
        reject(error);
      }
    });
  }

  /**
   * Clear all entries from IndexedDB
   */
  private clearIndexedDB(): Promise<void> {
    if (!this.db) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        const request = store.clear();

        request.onsuccess = () => resolve(undefined);
        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error clearing IndexedDB:', error);
        reject(error);
      }
    });
  }

  /**
   * Delete entries by prefix from IndexedDB
   */
  private deleteByPrefixFromIndexedDB(prefix: string): Promise<void> {
    if (!this.db) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            if (cursor.key.toString().startsWith(prefix)) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve(undefined);
          }
        };

        request.onerror = (event) => reject(event);
      } catch (error) {
        console.error('Error deleting by prefix from IndexedDB:', error);
        reject(error);
      }
    });
  }

  /**
   * Calculate approximate size of data in bytes
   */
  private calculateSize(data: any): number {
    try {
      const jsonString = JSON.stringify(data);
      return jsonString.length * 2; // Approximate size in bytes (2 bytes per character)
    } catch (error) {
      return 0;
    }
  }

  /**
   * Update cache statistics
   */
  private updateCacheStats(): void {
    let totalSize = 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;

    for (const entry of this.memoryCache.values()) {
      totalSize += entry.size || 0;
      oldestEntry = Math.min(oldestEntry, entry.createdAt);
      newestEntry = Math.max(newestEntry, entry.createdAt);
    }

    this.cacheStats.totalEntries = this.memoryCache.size;
    this.cacheStats.totalSize = totalSize;
    this.cacheStats.oldestEntry = oldestEntry;
    this.cacheStats.newestEntry = newestEntry;
  }

  /**
   * Enforce cache size limits by removing oldest entries
   */
  private async enforceCacheSizeLimit(): Promise<void> {
    if (this.cacheStats.totalSize <= this.MAX_CACHE_SIZE) {
      return;
    }

    // Sort entries by creation time (oldest first)
    const entriesArray = Array.from(this.memoryCache.entries());
    const entries = entriesArray.map((item) => {
      const key = item[0];
      const entry = item[1];
      return { key, entry };
    }).sort((a, b) => a.entry.createdAt - b.entry.createdAt);

    // Remove oldest entries until we're under the size limit
    for (const { key, entry } of entries) {
      if (this.cacheStats.totalSize <= this.MAX_CACHE_SIZE * 0.8) { // Remove until we're at 80% of max
        break;
      }
      
      this.cacheStats.totalSize -= entry.size || 0;
      this.memoryCache.delete(key);
      
      if (this.USE_PERSISTENT_STORAGE) {
        try {
          await this.deleteFromIndexedDB(key);
        } catch (error) {
          console.error('Error deleting from IndexedDB during size enforcement:', error);
        }
      }
    }
  }

  /**
   * Gets data from cache if available and not expired, otherwise returns null
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  async get(key: string): Promise<any> {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)!;
      
      // Check if entry has expired
      if (entry.expiry < Date.now()) {
        this.memoryCache.delete(key);
        if (this.USE_PERSISTENT_STORAGE) {
          await this.deleteFromIndexedDB(key);
        }
        this.cacheStats.misses++;
        this.updateCacheStats();
        return null;
      }
      
      this.cacheStats.hits++;
      return entry.data;
    }

    // If not in memory cache and persistent storage is enabled, check IndexedDB
    if (this.USE_PERSISTENT_STORAGE && this.dbInitialized && this.db) {
      try {
        const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(key);

        return new Promise<any>((resolve) => {
          request.onsuccess = () => {
            const entry = request.result;
            if (entry && entry.expiry > Date.now()) {
              // Add to memory cache
              this.memoryCache.set(key, {
                data: entry.data,
                expiry: entry.expiry,
                createdAt: entry.createdAt,
                size: entry.size
              });
              this.cacheStats.hits++;
              this.updateCacheStats();
              resolve(entry.data);
            } else {
              // Delete expired entry
              if (entry) {
                this.deleteFromIndexedDB(key);
              }
              this.cacheStats.misses++;
              resolve(null);
            }
          };

          request.onerror = () => {
            this.cacheStats.misses++;
            resolve(null);
          };
        });
      } catch (error) {
        console.error('Error getting from IndexedDB:', error);
        this.cacheStats.misses++;
        return null;
      }
    }

    this.cacheStats.misses++;
    return null;
  }

  /**
   * Sets data in cache with a specified TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (default: from environment or 5 minutes)
   */
  async set(key: string, data: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    const now = Date.now();
    const expiry = now + ttl;
    const size = this.calculateSize(data);
    
    const entry: CacheEntry = {
      data,
      expiry,
      createdAt: now,
      size
    };
    
    // Add to memory cache
    this.memoryCache.set(key, entry);
    
    // Update cache statistics
    this.updateCacheStats();
    
    // Enforce cache size limits
    this.enforceCacheSizeLimit();
    
    // If persistent storage is enabled, save to IndexedDB
    if (this.USE_PERSISTENT_STORAGE) {
      await this.initIndexedDB();
      if (this.dbInitialized) {
        await this.saveToIndexedDB(key, entry);
      }
    }
  }

  /**
   * Clears a specific entry from cache
   * @param key Cache key
   */
  async clear(key: string): Promise<void> {
    this.memoryCache.delete(key);
    
    if (this.USE_PERSISTENT_STORAGE && this.dbInitialized) {
      await this.deleteFromIndexedDB(key);
    }
    
    this.updateCacheStats();
  }

  /**
   * Clears all entries from cache
   */
  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    
    if (this.USE_PERSISTENT_STORAGE && this.dbInitialized) {
      await this.clearIndexedDB();
    }
    
    this.cacheStats = {
      hits: 0,
      misses: 0,
      totalEntries: 0,
      totalSize: 0,
      oldestEntry: 0,
      newestEntry: 0
    };
  }

  /**
   * Clears all entries that match a prefix
   * @param prefix Key prefix to match
   */
  async clearByPrefix(prefix: string): Promise<void> {
    // Clear from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Clear from IndexedDB if enabled
    if (this.USE_PERSISTENT_STORAGE && this.dbInitialized) {
      await this.deleteByPrefixFromIndexedDB(prefix);
    }
    
    this.updateCacheStats();
  }

  /**
   * Wraps an Observable with caching functionality
   * @param key Cache key
   * @param observable Observable to wrap
   * @param ttl Time to live in milliseconds (default: from environment or 5 minutes)
   * @returns Observable with caching
   */
  cacheObservable<T>(key: string, observable: Observable<T>, ttl: number = this.DEFAULT_TTL): Observable<T> {
    // First check if we have it in cache
    return from(this.get(key)).pipe(
      switchMap(cachedData => {
        if (cachedData) {
          return of(cachedData);
        }
        
        // If not in cache, get from source and cache the result
        return observable.pipe(
          tap(data => {
            this.set(key, data, ttl);
          }),
          catchError(error => {
            console.error(`Error fetching data for key ${key}:`, error);
            throw error;
          })
        );
      })
    );
  }

  /**
   * Get cache statistics
   * @returns Cache statistics object
   */
  getCacheStats(): any {
    return { ...this.cacheStats };
  }
}