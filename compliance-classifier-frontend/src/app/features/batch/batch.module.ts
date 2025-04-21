import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BatchListComponent } from './components/batch-list/batch-list.component';

const routes: Routes = [
  {
    path: '',
    component: BatchListComponent
  },
  // These routes will be implemented later
  {
    path: 'create',
    loadChildren: () => import('./components/create-batch/create-batch.module').then(m => m.CreateBatchModule)
  }
  // {
  //   path: ':id',
  //   loadChildren: () => import('./components/batch-details/batch-details.module').then(m => m.BatchDetailsModule)
  // }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    BatchListComponent
  ]
})
export class BatchModule { }