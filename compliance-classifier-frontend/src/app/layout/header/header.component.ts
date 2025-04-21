import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { SelectItem } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';

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
    AvatarModule,
    InputSwitchModule,
    TooltipModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  username: string | null = null;
  private authSubscription: Subscription | null = null;
  
  // Theme state
  isDarkTheme = false;
  
  // Menu items
  menuItems = [
    {label: 'Profile', icon: 'pi pi-user'},
    {label: 'Settings', icon: 'pi pi-cog'},
    {separator: true},
    {label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout(), styleClass: 'logout-button'}
  ];
  
  // AI Provider options
  aiProviders: SelectItem[] = [
    { label: 'OpenAI', value: 'openai' },
    { label: 'Azure AI', value: 'azure' },
    { label: 'Google AI', value: 'google' }
  ];
  selectedProvider: string = 'openai';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
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
    
    // Subscribe to theme changes
    this.themeService.getTheme().subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
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
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
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