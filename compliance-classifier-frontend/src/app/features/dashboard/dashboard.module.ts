import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// PrimeNG imports
import { ToastModule } from 'primeng/toast';

// Component modules
import { PipelineTimelineModule } from './components/pipeline-timeline/pipeline-timeline.module';
import { RecentBatchesModule } from './components/recent-batches/recent-batches.module';
import { CategorySummaryModule } from './components/category-summary/category-summary.module';
import { FileUploadComponentModule } from './components/file-upload/file-upload.module';
import { CreateBatchModalModule } from './components/create-batch-modal/create-batch-modal.module';

// Components
import { DashboardComponent } from './components/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToastModule,
    PipelineTimelineModule,
    RecentBatchesModule,
    CategorySummaryModule,
    FileUploadComponentModule,
    CreateBatchModalModule,
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }