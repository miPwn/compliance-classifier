import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('themeToggleBtn') themeToggleBtn!: ElementRef;
  isAuthenticated = false;
  username: string | null = null;
  private authSubscription: Subscription | null = null;
  
  // Theme state
  isDarkTheme = false;
  showThemeNotification = false;
  
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
    
    // Initialize theme from localStorage
    this.initTheme();
  }
  
  /**
   * Initialize theme from localStorage or system preference
   */
  private initTheme(): void {
    console.log('HeaderComponent: Initializing theme');
    
    try {
      // Try to get theme from localStorage
      const savedTheme = localStorage.getItem('compliance-classifier-theme');
      console.log('HeaderComponent: Saved theme from localStorage:', savedTheme);
      
      if (savedTheme === 'dark') {
        console.log('HeaderComponent: Using dark theme from localStorage');
        this.isDarkTheme = true;
        document.body.classList.add('dark-theme');
        // Force update CSS variables directly
        document.documentElement.style.setProperty('--primary-color', 'var(--dark-primary-color)');
        document.documentElement.style.setProperty('--text-color', 'var(--dark-text-color)');
        document.documentElement.style.setProperty('--surface-ground', 'var(--dark-surface-ground)');
      } else if (savedTheme === 'light') {
        console.log('HeaderComponent: Using light theme from localStorage');
        this.isDarkTheme = false;
        document.body.classList.remove('dark-theme');
        // Reset CSS variables to light theme
        document.documentElement.style.setProperty('--primary-color', 'var(--light-primary-color)');
        document.documentElement.style.setProperty('--text-color', 'var(--light-text-color)');
        document.documentElement.style.setProperty('--surface-ground', 'var(--light-surface-ground)');
      } else {
        // Check if user prefers dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('HeaderComponent: No saved theme, user prefers dark mode:', prefersDark);
        this.isDarkTheme = prefersDark;
        
        if (prefersDark) {
          document.body.classList.add('dark-theme');
          // Force update CSS variables directly
          document.documentElement.style.setProperty('--primary-color', 'var(--dark-primary-color)');
          document.documentElement.style.setProperty('--text-color', 'var(--dark-text-color)');
          document.documentElement.style.setProperty('--surface-ground', 'var(--dark-surface-ground)');
        }
        
        // Save to localStorage
        localStorage.setItem('compliance-classifier-theme', prefersDark ? 'dark' : 'light');
      }
      
      console.log('HeaderComponent: Theme initialized, isDarkTheme =', this.isDarkTheme);
      console.log('HeaderComponent: Body classes after init:', document.body.className);
    } catch (error) {
      console.error('HeaderComponent: Error initializing theme:', error);
      // Fallback to light theme
      this.isDarkTheme = false;
      document.body.classList.remove('dark-theme');
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
  ngAfterViewInit(): void {
    // Add a direct event listener to the button as a fallback
    if (this.themeToggleBtn && this.themeToggleBtn.nativeElement) {
      console.log('HeaderComponent: Adding direct event listener to theme toggle button');
      this.themeToggleBtn.nativeElement.addEventListener('click', () => {
        console.log('HeaderComponent: Direct button click detected');
        this.toggleTheme();
      });
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
    console.log('HeaderComponent: toggleTheme called');
    
    // Toggle the isDarkTheme value directly
    this.isDarkTheme = !this.isDarkTheme;
    console.log('HeaderComponent: Toggled isDarkTheme to:', this.isDarkTheme);
    
    // Apply theme directly to DOM
    if (this.isDarkTheme) {
      console.log('HeaderComponent: Adding dark-theme class to body');
      document.body.classList.add('dark-theme');
      // Force update CSS variables directly
      document.documentElement.style.setProperty('--primary-color', 'var(--dark-primary-color)');
      document.documentElement.style.setProperty('--text-color', 'var(--dark-text-color)');
      document.documentElement.style.setProperty('--surface-ground', 'var(--dark-surface-ground)');
    } else {
      console.log('HeaderComponent: Removing dark-theme class from body');
      document.body.classList.remove('dark-theme');
      // Reset CSS variables to light theme
      document.documentElement.style.setProperty('--primary-color', 'var(--light-primary-color)');
      document.documentElement.style.setProperty('--text-color', 'var(--light-text-color)');
      document.documentElement.style.setProperty('--surface-ground', 'var(--light-surface-ground)');
    }
    
    // Save to localStorage
    localStorage.setItem('compliance-classifier-theme', this.isDarkTheme ? 'dark' : 'light');
    
    // Add visual feedback
    document.body.classList.add('theme-changing');
    setTimeout(() => {
      document.body.classList.remove('theme-changing');
    }, 300);
    
    console.log('HeaderComponent: Theme toggled, body classes:', document.body.className);
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