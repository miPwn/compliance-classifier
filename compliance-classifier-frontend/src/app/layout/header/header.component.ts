import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SelectItem } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    MenuModule,
    RippleModule,
    AvatarModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  username: string | null = null;
  private authSubscription: Subscription | null = null;
  
  // AI Provider options
  aiProviders: SelectItem[] = [
    { label: 'OpenAI', value: 'openai' },
    { label: 'Azure AI', value: 'azure' },
    { label: 'Google AI', value: 'google' }
  ];
  selectedProvider: string = 'openai';

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
    
    // Load current AI provider (would typically come from a config service)
    this.loadCurrentProvider();
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
  
  loadCurrentProvider(): void {
    // This would typically come from a config service
    // For now, we'll just use the default value
    this.selectedProvider = 'openai';
  }
  
  onProviderChange(event: any): void {
    // This would typically update the provider in a config service
    this.selectedProvider = event.value;
    console.log('AI Provider changed to:', this.selectedProvider);
  }
  
  createNewBatch(): void {
    this.router.navigate(['/batches/create']);
  }

  login(): void {
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}