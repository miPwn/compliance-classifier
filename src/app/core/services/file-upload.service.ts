import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ErrorService } from './error.service';

export interface FileUploadOptions {
  url?: string;
  allowedTypes?: string[];
  maxSizeInMB?: number;
  additionalParams?: { [key: string]: string };
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly DEFAULT_MAX_SIZE_MB = 10; // 10MB
  private readonly DEFAULT_ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png'
  ];
  
  private readonly DEFAULT_UPLOAD_URL = `${environment.apiUrl}/documents/upload`;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private errorService: ErrorService
  ) {}

  /**
   * Upload a file with security validation
   */
  uploadFile(file: File, options?: FileUploadOptions): Observable<HttpEvent<any>> {
    // Validate file before uploading
    const validationResult = this.validateFile(file, options);
    if (!validationResult.valid) {
      return throwError(() => new Error(validationResult.errors.join(', ')));
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    // Add any additional parameters
    if (options?.additionalParams) {
      Object.keys(options.additionalParams).forEach(key => {
        formData.append(key, options.additionalParams![key]);
      });
    }

    // Create request
    const uploadUrl = options?.url || this.DEFAULT_UPLOAD_URL;
    const req = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true
    });

    // Execute request
    return this.http.request(req).pipe(
      catchError(error => this.errorService.handleError(error))
    );
  }

  /**
   * Validate file type and size
   */
  validateFile(file: File, options?: FileUploadOptions): FileValidationResult {
    const errors: string[] = [];
    const maxSizeInMB = options?.maxSizeInMB || this.DEFAULT_MAX_SIZE_MB;
    const allowedTypes = options?.allowedTypes || this.DEFAULT_ALLOWED_TYPES;
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      errors.push(`File size exceeds the maximum allowed size of ${maxSizeInMB}MB`);
    }
    
    // Check file type
    if (!this.isValidFileType(file, allowedTypes)) {
      errors.push(`File type not allowed. Allowed types: ${this.formatAllowedTypes(allowedTypes)}`);
    }
    
    // Check file name for security
    if (!this.isValidFileName(file.name)) {
      errors.push('File name contains invalid characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a safe URL for file preview
   */
  createSafeUrl(file: File): SafeUrl {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * Revoke a previously created object URL
   */
  revokeUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Check if file type is allowed
   */
  private isValidFileType(file: File, allowedTypes: string[]): boolean {
    // First check MIME type
    if (allowedTypes.includes(file.type)) {
      return true;
    }
    
    // If MIME type check fails, check file extension as fallback
    const fileExtension = this.getFileExtension(file.name).toLowerCase();
    const allowedExtensions = this.getAllowedExtensions(allowedTypes);
    
    return allowedExtensions.includes(fileExtension);
  }

  /**
   * Extract file extension
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  /**
   * Get allowed extensions from MIME types
   */
  private getAllowedExtensions(allowedTypes: string[]): string[] {
    const mimeToExtMap: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'text/plain': 'txt',
      'text/csv': 'csv',
      'image/jpeg': 'jpg',
      'image/png': 'png'
    };
    
    return allowedTypes.map(type => mimeToExtMap[type] || '').filter(ext => ext !== '');
  }

  /**
   * Format allowed types for display
   */
  private formatAllowedTypes(allowedTypes: string[]): string {
    const extensions = this.getAllowedExtensions(allowedTypes);
    return extensions.map(ext => `.${ext}`).join(', ');
  }

  /**
   * Validate file name for security
   */
  private isValidFileName(filename: string): boolean {
    // Check for potentially dangerous characters or patterns
    const invalidCharsRegex = /[<>:"/\\|?*\x00-\x1F]/;
    const hasInvalidChars = invalidCharsRegex.test(filename);
    
    // Check for path traversal attempts
    const hasPathTraversal = filename.includes('../') || filename.includes('..\\');
    
    // Check for hidden files (starting with .)
    const isHiddenFile = filename.startsWith('.');
    
    // Check for excessively long filenames
    const isTooLong = filename.length > 255;
    
    return !(hasInvalidChars || hasPathTraversal || isHiddenFile || isTooLong);
  }
}