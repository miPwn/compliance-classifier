import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // First check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if route has required roles
    const requiredRoles = route.data['roles'] as Array<string>;
    if (!requiredRoles || requiredRoles.length === 0) {
      // No specific roles required
      return true;
    }

    const currentUser = this.authService.currentUserValue;
    if (currentUser && requiredRoles.includes(currentUser.role)) {
      return true;
    }

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