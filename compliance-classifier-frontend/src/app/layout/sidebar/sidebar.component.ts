import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isCollapsed = false;
  currentRoute = '';
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard'
    },
    {
      label: 'Batches',
      icon: 'pi pi-folder',
      route: '/batches',
      children: [
        {
          label: 'All Batches',
          icon: 'pi pi-list',
          route: '/batches'
        },
        {
          label: 'Create Batch',
          icon: 'pi pi-plus',
          route: '/batches/create'
        }
      ]
    },
    {
      label: 'Documents',
      icon: 'pi pi-file',
      route: '/documents'
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      route: '/reports'
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      route: '/settings'
    }
  ];
  
  private authSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;

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
    
    // Track current route for active menu item
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateAuthState(isAuthenticated: boolean): void {
    this.isAuthenticated = isAuthenticated;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  isActive(route: string): boolean {
    // Special case for the root batches route to avoid highlighting when on child routes
    if (route === '/batches' && this.currentRoute !== '/batches') {
      return false;
    }
    return this.currentRoute.startsWith(route);
  }
}