import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-pipeline-timeline',
  templateUrl: './pipeline-timeline.component.html',
  styleUrls: ['./pipeline-timeline.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    TimelineModule,
    InputSwitchModule,
    TooltipModule,
    RippleModule
  ]
})
export class PipelineTimelineComponent {
  @Input() pipelineEvents: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() autoRefresh: boolean = true;
  
  @Output() refreshToggle = new EventEmitter<boolean>();
  @Output() manualRefresh = new EventEmitter<void>();
  
  /**
   * Toggle auto-refresh and emit the new state
   */
  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    this.refreshToggle.emit(this.autoRefresh);
  }
  
  /**
   * Trigger a manual refresh of the pipeline data
   */
  refresh(): void {
    this.manualRefresh.emit();
  }
}