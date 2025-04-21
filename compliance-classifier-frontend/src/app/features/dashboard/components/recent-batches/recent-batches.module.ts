import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { DataViewModule } from 'primeng/dataview';

import { RecentBatchesComponent } from './recent-batches.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    TooltipModule,
    RippleModule,
    BadgeModule,
    DataViewModule,
    RecentBatchesComponent
  ],
  exports: [
    RecentBatchesComponent
  ]
})
export class RecentBatchesModule { }