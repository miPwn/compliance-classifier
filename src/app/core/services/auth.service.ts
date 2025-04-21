import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { catchError, map, tap, switchMap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_REFRESH_THRESHOLD = 60; // seconds before expiry to refresh
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
    this.initTokenRefreshScheduler();
  }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  login(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          // The server should set HttpOnly cookies for the tokens
          // This is just a fallback in case the server doesn't support HttpOnly cookies
          if (response.accessToken) {
            this.cookieService.set(this.ACCESS_TOKEN_KEY, response.accessToken, {
              expires: new Date(new Date().getTime() + response.expiresIn * 1000),
              path: '/',
              secure: environment.production,
              sameSite: 'Strict'
            });
          }
          
          if (response.refreshToken) {
            this.cookieService.set(this.REFRESH_TOKEN_KEY, response.refreshToken, {
              expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
              path: '/',
              secure: environment.production,
              sameSite: 'Strict'
            });
          }
          
          const user = this.getUserFromToken();
          this.currentUserSubject.next(user);
          this.initTokenRefreshScheduler();
          return user;
        }),
        map(() => this.currentUserValue as User),
        catchError(error => {
          console.error('Login error', error);
          return throwError(() => new Error('Username or password is incorrect'));
        })
      );
  }
  
  logout(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.cookieService.delete(this.ACCESS_TOKEN_KEY, '/');
          this.cookieService.delete(this.REFRESH_TOKEN_KEY, '/');
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        }),
        catchError(error => {
          console.error('Logout error', error);
          // Even if the server logout fails, clear cookies and user state
          this.cookieService.delete(this.ACCESS_TOKEN_KEY, '/');
          this.cookieService.delete(this.REFRESH_TOKEN_KEY, '/');
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
          return of(null);
        })
      );
  }
  
  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        filter(result => result),
        switchMap(() => of(null))
      );
    }
    
    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(false);
    
    const refreshToken = this.cookieService.get(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      this.refreshTokenInProgress = false;
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.accessToken) {
            this.cookieService.set(this.ACCESS_TOKEN_KEY, response.accessToken, {
              expires: new Date(new Date().getTime() + response.expiresIn * 1000),
              path: '/',
              secure: environment.production,
              sameSite: 'Strict'
            });
          }
          
          if (response.refreshToken) {
            this.cookieService.set(this.REFRESH_TOKEN_KEY, response.refreshToken, {
              expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
              path: '/',
              secure: environment.production,
              sameSite: 'Strict'
            });
          }
          
          const user = this.getUserFromToken();
          this.currentUserSubject.next(user);
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(true);
        }),
        catchError(error => {
          this.refreshTokenInProgress = false;
          this.logout();
          return throwError(() => error);
        })
      );
  }
  
  getAccessToken(): string | null {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY) || null;
  }
  
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }
  
  private getUserFromToken(): User | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    
    try {
      const decodedToken = jwtDecode<TokenPayload>(token);
      return {
        id: decodedToken.sub,
        username: decodedToken.username,
        role: decodedToken.role
      };
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode<TokenPayload>(token);
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate.valueOf() <= new Date().valueOf();
    } catch (error) {
      console.error('Error checking token expiration', error);
      return true;
    }
  }
  
  private getTokenExpirationTime(token: string): number | null {
    try {
      const decodedToken = jwtDecode<TokenPayload>(token);
      return decodedToken.exp;
    } catch (error) {
      console.error('Error getting token expiration time', error);
      return null;
    }
  }
  
  private initTokenRefreshScheduler(): void {
    const token = this.getAccessToken();
    if (!token) {
      return;
    }
    
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) {
      return;
    }
    
    const expiresInMilliseconds = expirationTime * 1000 - Date.now();
    const refreshInMilliseconds = expiresInMilliseconds - (this.TOKEN_REFRESH_THRESHOLD * 1000);
    
    if (refreshInMilliseconds <= 0) {
      // Token is already expired or about to expire, refresh immediately
      this.refreshToken().subscribe();
      return;
    }
    
    // Schedule token refresh
    timer(refreshInMilliseconds).subscribe(() => {
      if (this.isAuthenticated()) {
        this.refreshToken().subscribe();
      }
    });
  }
}