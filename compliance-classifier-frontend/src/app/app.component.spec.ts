import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { AuthService } from './core/services/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authStateSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    authStateSubject = new BehaviorSubject<boolean>(false);
    
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated'], {
      authStateChanged: authStateSubject
    });
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        LayoutModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should contain header component', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('app-header');
    
    expect(header).toBeTruthy();
  });

  it('should contain footer component', () => {
    const compiled = fixture.nativeElement;
    const footer = compiled.querySelector('app-footer');
    
    expect(footer).toBeTruthy();
  });

  it('should contain sidebar when authenticated', () => {
    // Arrange
    authServiceSpy.isAuthenticated.and.returnValue(true);
    
    // Act - simulate auth state change
    authStateSubject.next(true);
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    const sidebar = compiled.querySelector('app-sidebar');
    
    expect(sidebar).toBeTruthy();
  });

  it('should not contain sidebar when not authenticated', () => {
    // Assert
    const compiled = fixture.nativeElement;
    const sidebar = compiled.querySelector('app-sidebar');
    
    expect(sidebar).toBeFalsy();
  });

  it('should have main content area with correct class when authenticated', () => {
    // Arrange
    authServiceSpy.isAuthenticated.and.returnValue(true);
    
    // Act - simulate auth state change
    authStateSubject.next(true);
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    const mainContent = compiled.querySelector('.main-content');
    
    expect(mainContent).toBeTruthy();
    expect(mainContent.classList).toContain('with-sidebar');
  });

  it('should have main content area without sidebar class when not authenticated', () => {
    // Assert
    const compiled = fixture.nativeElement;
    const mainContent = compiled.querySelector('.main-content');
    
    expect(mainContent).toBeTruthy();
    expect(mainContent.classList).not.toContain('with-sidebar');
  });
});
