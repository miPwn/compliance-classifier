import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return a token when login is successful', () => {
      const mockCredentials = { username: 'testuser', password: 'password123' };
      const mockResponse = { token: 'mock-jwt-token', expiresIn: 3600 };

      service.login(mockCredentials.username, mockCredentials.password).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const mockCredentials = { username: 'testuser', password: 'wrongpassword' };
      const mockError = { status: 401, statusText: 'Unauthorized' };

      service.login(mockCredentials.username, mockCredentials.password).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush('Invalid credentials', mockError);
    });
  });

  describe('logout', () => {
    it('should clear token from storage on logout', () => {
      // Arrange
      spyOn(localStorage, 'removeItem');
      spyOn(service.authStateChanged, 'next');

      // Act
      service.logout();

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(service.authStateChanged.next).toHaveBeenCalledWith(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists and is valid', () => {
      // Arrange
      spyOn(service as any, 'getToken').and.returnValue('valid-token');
      spyOn(service as any, 'isTokenExpired').and.returnValue(false);

      // Act
      const result = service.isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when token does not exist', () => {
      // Arrange
      spyOn(service as any, 'getToken').and.returnValue(null);

      // Act
      const result = service.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when token is expired', () => {
      // Arrange
      spyOn(service as any, 'getToken').and.returnValue('expired-token');
      spyOn(service as any, 'isTokenExpired').and.returnValue(true);

      // Act
      const result = service.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user information from token', () => {
      // Arrange
      const mockUser = { id: '123', username: 'testuser', role: 'admin' };
      spyOn(service as any, 'decodeToken').and.returnValue({ user: mockUser });
      spyOn(service as any, 'getToken').and.returnValue('valid-token');

      // Act
      const result = service.getCurrentUser();

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('should return null when no token exists', () => {
      // Arrange
      spyOn(service as any, 'getToken').and.returnValue(null);

      // Act
      const result = service.getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });
  });
});