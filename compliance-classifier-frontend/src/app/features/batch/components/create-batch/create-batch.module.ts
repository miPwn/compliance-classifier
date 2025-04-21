import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBatchComponent } from './create-batch.component';

const routes: Routes = [
  {
    path: '',
    component: CreateBatchComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CreateBatchComponent
  ]
})
export class CreateBatchModule { }