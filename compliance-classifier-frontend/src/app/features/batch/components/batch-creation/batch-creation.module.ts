import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchCreationComponent } from './batch-creation.component';

const routes: Routes = [
  {
    path: '',
    component: BatchCreationComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    BatchCreationComponent
  ]
})
export class BatchCreationModule { }