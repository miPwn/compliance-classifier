import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

import { PipelineTimelineComponent } from './pipeline-timeline.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    TimelineModule,
    InputSwitchModule,
    TooltipModule,
    RippleModule,
    PipelineTimelineComponent
  ],
  exports: [
    PipelineTimelineComponent
  ]
})
export class PipelineTimelineModule { }