import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * A custom preloading strategy that selectively preloads modules based on route data.
 * 
 * Usage:
 * In your route configuration, add { preload: true } to the data property of routes you want to preload:
 * 
 * {
 *   path: 'documents',
 *   loadChildren: () => import('./features/document/document.module').then(m => m.DocumentModule),
 *   data: { preload: true }
 * }
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  // Keep track of preloaded modules for debugging
  preloadedModules: string[] = [];

  /**
   * Determines whether a route should be preloaded
   * @param route The route to check
   * @param load Function to load the module
   * @returns Observable that resolves when the module is loaded, or null if not preloading
   */
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Skip preloading if feature is disabled in environment
    if (environment.preloadingStrategy !== 'SelectivePreloading') {
      return of(null);
    }

    // Check if this route should be preloaded based on data property
    if (route.data?.['preload'] === true) {
      // Add to list of preloaded modules for debugging
      this.preloadedModules.push(route.path || 'unnamed');
      
      // Log preloading in development mode
      if (!environment.production) {
        console.log(`Preloading: ${route.path}`);
      }
      
      return load();
    }
    
    return of(null);
  }
}