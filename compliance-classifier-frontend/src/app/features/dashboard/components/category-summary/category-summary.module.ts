import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { BadgeModule } from 'primeng/badge';

import { CategorySummaryComponent } from './category-summary.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    ProgressBarModule,
    ChartModule,
    BadgeModule,
    CategorySummaryComponent
  ],
  exports: [
    CategorySummaryComponent
  ]
})
export class CategorySummaryModule { }