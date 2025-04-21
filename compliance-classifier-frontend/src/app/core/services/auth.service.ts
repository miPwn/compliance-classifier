import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token: string;
  expiresIn: number;
}

interface TokenPayload {
  user: {
    id: string;
    username: string;
    role: string;
  };
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  public authStateChanged = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.authStateChanged.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authStateChanged.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  getCurrentUser(): { id: string; username: string; role: string } | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    const decodedToken = this.decodeToken(token);
    return decodedToken.user;
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    
    const decodedToken = this.decodeToken(token);
    // Convert token expiration to milliseconds and create date
    const expirationDate = new Date(decodedToken.exp * 1000);
    
    return expirationDate < new Date();
  }

  private decodeToken(token: string): TokenPayload {
    // In a real implementation, this would use a JWT decoder library
    // For testing purposes, we'll just return a mock payload
    return {
      user: {
        id: '123',
        username: 'testuser',
        role: 'admin'
      },
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };
  }
}