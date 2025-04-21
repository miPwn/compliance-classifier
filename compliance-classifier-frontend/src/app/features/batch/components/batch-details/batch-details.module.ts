import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { TimelineModule } from 'primeng/timeline';
import { ChartModule } from 'primeng/chart';

import { BatchDetailsComponent } from './batch-details.component';
import { DocumentUploadModule } from '../document-upload/document-upload.module';

const routes: Routes = [
  {
    path: '',
    component: BatchDetailsComponent
  }
];

@NgModule({
  imports: [
    BatchDetailsComponent,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CardModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    TooltipModule,
    TimelineModule,
    ChartModule,
    DocumentUploadModule
  ]
})
export class BatchDetailsModule { }