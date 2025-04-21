import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentDetailsComponent } from './components/document-details/document-details.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentListComponent
  },
  {
    path: ':id',
    component: DocumentDetailsComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    DocumentListComponent,
    DocumentDetailsComponent
  ]
})
export class DocumentModule { }