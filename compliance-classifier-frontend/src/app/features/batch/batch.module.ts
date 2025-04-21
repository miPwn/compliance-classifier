import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { DocumentUploadModule } from './components/document-upload/document-upload.module';

const routes: Routes = [
  {
    path: '',
    component: BatchListComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./components/batch-creation/batch-creation.module').then(m => m.BatchCreationModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./components/batch-details/batch-details.module').then(m => m.BatchDetailsModule)
  },
  {
    path: ':id/upload',
    loadChildren: () => import('./components/document-upload/document-upload.module').then(m => m.DocumentUploadModule)
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    BatchListComponent,
    DocumentUploadModule
  ]
})
export class BatchModule { }