import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'batches',
    loadChildren: () => import('./features/batch/batch.module').then(m => m.BatchModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'manager', 'user'] }
  },
  {
    path: 'documents',
    loadChildren: () => import('./features/document/document.module').then(m => m.DocumentModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'manager', 'user'] }
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/report/report.module').then(m => m.ReportModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];