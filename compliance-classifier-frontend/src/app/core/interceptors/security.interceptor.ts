import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecurityService } from '../services/security.service';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(private securityService: SecurityService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add CSRF token to all mutating requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const csrfToken = this.securityService.generateCsrfToken();
      request = request.clone({
        setHeaders: {
          'X-CSRF-Token': csrfToken
        }
      });
    }

    // Add security headers to all requests
    request = request.clone({
      setHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log security-related errors
        if (error.status === 401 || error.status === 403) {
          console.error('Security error:', error);
          // In a real app, you might want to redirect to login page or show an error message
        }
        return throwError(() => error);
      })
    );
  }
}