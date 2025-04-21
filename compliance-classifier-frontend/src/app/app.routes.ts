import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: async () => {
      const m = await import('./features/dashboard/dashboard.module');
      return m.DashboardModule;
    },
    // Dashboard is a commonly accessed route, so we'll preload it
    data: { preload: true }
  },
  {
    path: 'batches',
    loadChildren: async () => {
      const m = await import('./features/batch/batch.module');
      return m.BatchModule;
    },
    // Batches is a commonly accessed route, so we'll preload it
    data: { preload: true }
  },
  {
    path: 'documents',
    loadChildren: async () => {
      const m = await import('./features/document/document.module');
      return m.DocumentModule;
    },
    // Documents is a commonly accessed route, so we'll preload it
    data: { preload: true }
  },
  // These modules will be implemented later
  // {
  //   path: 'reports',
  //   loadChildren: () => import('./features/report/report.module').then(m => m.ReportModule),
  //   data: { preload: false } // Less commonly accessed, so don't preload
  // },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  //   data: { preload: false } // Only needed for login/logout, so don't preload
  // },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
