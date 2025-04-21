import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  
  // Skip adding the token for auth endpoints
  if (request.url.includes('/auth/login') || request.url.includes('/auth/refresh')) {
    return next(request);
  }

  // Add authorization header with JWT token if available
  const token = authService.getAccessToken();
  if (token) {
    request = addTokenToRequest(request, token);
  }
  
  return next(request).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Token has expired, try to refresh it
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<any> {
  return authService.refreshToken().pipe(
    switchMap(() => {
      const token = authService.getAccessToken();
      if (token) {
        return next(addTokenToRequest(request, token));
      }
      // If we don't have a token after refresh, redirect to login
      authService.logout();
      return throwError(() => new Error('Session expired'));
    }),
    catchError(error => {
      // If refresh token fails, redirect to login
      authService.logout();
      return throwError(() => error);
    })
  );
}