import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
import { ShareReportComponent } from './components/share-report/share-report.component';
import { ReportListComponent } from './components/report-list/report-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent
  },
  {
    path: ':id',
    component: ReportViewerComponent
  }
];

@NgModule({
  declarations: [
    ReportViewerComponent,
    ShareReportComponent,
    ReportListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportModule { }