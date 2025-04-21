import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { BatchDetailsComponent } from './components/batch-details/batch-details.component';
import { CreateBatchComponent } from './components/create-batch/create-batch.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';

const routes: Routes = [
  {
    path: '',
    component: BatchListComponent
  },
  {
    path: 'create',
    component: CreateBatchComponent
  },
  {
    path: ':id',
    component: BatchDetailsComponent
  },
  {
    path: ':id/upload',
    component: DocumentUploadComponent
  }
];

@NgModule({
  declarations: [
    BatchListComponent,
    BatchDetailsComponent,
    CreateBatchComponent,
    DocumentUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BatchModule { }