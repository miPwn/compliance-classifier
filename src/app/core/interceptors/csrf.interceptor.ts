import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpXsrfTokenExtractor
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const csrfInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  
  // Skip for non-mutating methods or external domains
  if (request.method === 'GET' || request.method === 'HEAD' ||
      !request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  // Get the CSRF token from the cookie
  const csrfToken = tokenExtractor.getToken();
  
  // If the token exists, add it to the request headers
  if (csrfToken !== null) {
    request = request.clone({
      setHeaders: {
        'X-XSRF-TOKEN': csrfToken
      }
    });
  }

  return next(request);
};