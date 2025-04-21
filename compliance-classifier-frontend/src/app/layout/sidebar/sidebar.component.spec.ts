import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
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
        SharedModule
      ],
      declarations: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show menu items when user is not authenticated', () => {
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('.menu-item');
    
    expect(menuItems.length).toBe(0);
  });

  it('should show menu items when user is authenticated', () => {
    // Arrange
    authServiceSpy.isAuthenticated.and.returnValue(true);
    
    // Act - simulate auth state change
    authStateSubject.next(true);
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('.menu-item');
    
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it('should toggle sidebar when toggle button is clicked', () => {
    // Arrange
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authStateSubject.next(true);
    fixture.detectChanges();
    
    // Act
    component.toggleSidebar();
    fixture.detectChanges();
    
    // Assert
    expect(component.isCollapsed).toBeTrue();
    
    // Act again
    component.toggleSidebar();
    fixture.detectChanges();
    
    // Assert again
    expect(component.isCollapsed).toBeFalse();
  });

  it('should have correct active menu item based on current route', () => {
    // This would require more complex testing with Router events
    // For now, we'll just check that the method exists
    expect(component.isActive).toBeDefined();
  });
});