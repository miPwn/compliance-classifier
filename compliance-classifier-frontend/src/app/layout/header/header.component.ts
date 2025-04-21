import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  username: string | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check initial authentication state
    this.updateAuthState(this.authService.isAuthenticated());
    
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.authStateChanged.subscribe(
      (isAuthenticated) => {
        this.updateAuthState(isAuthenticated);
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private updateAuthState(isAuthenticated: boolean): void {
    this.isAuthenticated = isAuthenticated;
    
    if (isAuthenticated) {
      const user = this.authService.getCurrentUser();
      this.username = user?.username || null;
    } else {
      this.username = null;
    }
  }

  login(): void {
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}