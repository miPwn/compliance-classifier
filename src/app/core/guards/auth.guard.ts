import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      // Check if route has required roles
      const requiredRoles = route.data['roles'] as Array<string>;
      if (requiredRoles && requiredRoles.length > 0) {
        const currentUser = this.authService.currentUserValue;
        if (currentUser && requiredRoles.includes(currentUser.role)) {
          return true;
        } else {
          // User doesn't have required role
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to access this resource',
            life: 5000
          });
          this.router.navigate(['/dashboard']);
          return false;
        }
      }
      
      // No specific roles required, user is authenticated
      return true;
    }
    
    // Not logged in, redirect to login page with return URL
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}