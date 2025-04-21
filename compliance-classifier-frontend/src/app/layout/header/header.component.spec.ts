import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authStateSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    authStateSubject = new BehaviorSubject<boolean>(false);
    
    const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'getCurrentUser', 'isAuthenticated'], {
      authStateChanged: authStateSubject
    });
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    authServiceSpy.getCurrentUser.and.returnValue(null);
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login button when user is not authenticated', () => {
    const compiled = fixture.nativeElement;
    const loginButton = compiled.querySelector('.login-button');
    const userMenu = compiled.querySelector('.user-menu');
    
    expect(loginButton).toBeTruthy();
    expect(userMenu).toBeFalsy();
  });

  it('should show user menu when user is authenticated', () => {
    // Arrange
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({
      id: '123',
      username: 'testuser',
      role: 'admin'
    });
    
    // Act - simulate auth state change
    authStateSubject.next(true);
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    const loginButton = compiled.querySelector('.login-button');
    const userMenu = compiled.querySelector('.user-menu');
    const username = compiled.querySelector('.username');
    
    expect(loginButton).toBeFalsy();
    expect(userMenu).toBeTruthy();
    expect(username.textContent).toContain('testuser');
  });

  it('should call logout when logout button is clicked', () => {
    // Arrange
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({
      id: '123',
      username: 'testuser',
      role: 'admin'
    });
    authStateSubject.next(true);
    fixture.detectChanges();
    
    // Act
    const compiled = fixture.nativeElement;
    const logoutButton = compiled.querySelector('.logout-button');
    logoutButton.click();
    
    // Assert
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should navigate to login page when login button is clicked', () => {
    // Arrange
    const routerSpy = spyOn(component['router'], 'navigate');
    
    // Act
    const compiled = fixture.nativeElement;
    const loginButton = compiled.querySelector('.login-button');
    loginButton.click();
    
    // Assert
    expect(routerSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should update isAuthenticated when auth state changes', () => {
    // Arrange - initial state is not authenticated
    expect(component.isAuthenticated).toBeFalse();
    
    // Act - simulate auth state change
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authStateSubject.next(true);
    
    // Assert
    expect(component.isAuthenticated).toBeTrue();
  });
});