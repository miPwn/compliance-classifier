import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

export interface ErrorDetails {
  message: string;
  status?: number;
  statusText?: string;
  path?: string;
  timestamp?: string;
  details?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  /**
   * Handle HTTP errors and display appropriate messages
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorDetails: ErrorDetails = {
      message: 'An unknown error occurred'
    };

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorDetails.message = `Client Error: ${error.error.message}`;
      this.logError('Client-side error', error);
    } else {
      // Server-side error
      errorDetails = this.parseServerError(error);
      this.logError('Server-side error', error);
    }

    // Display error message to user
    this.showErrorMessage(errorDetails, error.status);

    // Handle specific error codes
    this.handleSpecificErrors(error.status);

    // Return an observable with a user-facing error message
    return throwError(() => errorDetails);
  }

  /**
   * Parse server error response to extract meaningful information
   */
  private parseServerError(error: HttpErrorResponse): ErrorDetails {
    // Default error details
    const errorDetails: ErrorDetails = {
      message: 'Server error occurred',
      status: error.status,
      statusText: error.statusText,
      path: error.url || undefined
    };

    // Try to extract structured error information if available
    if (error.error) {
      if (typeof error.error === 'string') {
        errorDetails.message = error.error;
      } else if (error.error.message) {
        errorDetails.message = error.error.message;
        
        if (error.error.details) {
          errorDetails.details = Array.isArray(error.error.details) 
            ? error.error.details 
            : [error.error.details];
        }
        
        if (error.error.timestamp) {
          errorDetails.timestamp = error.error.timestamp;
        }
      }
    }

    // Provide more specific messages based on status code
    switch (error.status) {
      case 400:
        errorDetails.message = errorDetails.message || 'Bad request';
        break;
      case 401:
        errorDetails.message = 'Unauthorized access';
        break;
      case 403:
        errorDetails.message = 'Access forbidden';
        break;
      case 404:
        errorDetails.message = 'Resource not found';
        break;
      case 500:
        errorDetails.message = 'Internal server error';
        break;
      case 503:
        errorDetails.message = 'Service unavailable';
        break;
      case 0:
        errorDetails.message = 'Network error - server unreachable';
        break;
    }

    return errorDetails;
  }

  /**
   * Display error message to user
   */
  private showErrorMessage(errorDetails: ErrorDetails, status: number): void {
    // Don't show error messages for authentication errors (handled separately)
    if (status === 401) {
      return;
    }

    this.messageService.add({
      severity: 'error',
      summary: `Error ${status ? `(${status})` : ''}`,
      detail: errorDetails.message,
      life: 5000
    });

    // If there are additional details, show them as separate messages
    if (errorDetails.details && errorDetails.details.length > 0) {
      errorDetails.details.forEach(detail => {
        this.messageService.add({
          severity: 'error',
          summary: 'Additional Info',
          detail: detail,
          life: 5000
        });
      });
    }
  }

  /**
   * Handle specific error codes that require special actions
   */
  private handleSpecificErrors(status: number): void {
    switch (status) {
      case 401:
        // Unauthorized - handled by auth interceptor
        break;
      case 403:
        // Forbidden - redirect to dashboard
        this.router.navigate(['/dashboard']);
        break;
      case 404:
        // Not found - could redirect to a 404 page
        // this.router.navigate(['/not-found']);
        break;
      case 500:
        // Server error - could redirect to an error page for critical errors
        // this.router.navigate(['/server-error']);
        break;
    }
  }

  /**
   * Log error to console (in production, this could send to a logging service)
   */
  private logError(source: string, error: any): void {
    console.error(`[${source}]`, error);
    
    // In a production app, you might want to send this to a logging service
    // this.loggingService.logError(source, error);
  }
}