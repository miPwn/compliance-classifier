import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentDetailsComponent } from './components/document-details/document-details.component';
import { DocumentSearchComponent } from './components/document-search/document-search.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentListComponent
  },
  {
    path: 'search',
    component: DocumentSearchComponent
  },
  {
    path: ':id',
    component: DocumentDetailsComponent
  }
];

@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentDetailsComponent,
    DocumentSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DocumentModule { }