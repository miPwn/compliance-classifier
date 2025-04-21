import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { DataViewModule } from 'primeng/dataview';

// Models
import { Batch } from '../../../../core/services/batch.service';

@Component({
  selector: 'app-recent-batches',
  templateUrl: './recent-batches.component.html',
  styleUrls: ['./recent-batches.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    TooltipModule,
    RippleModule,
    BadgeModule,
    DataViewModule
  ]
})
export class RecentBatchesComponent {
  @Input() batches: Batch[] = [];
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  
  @Output() viewDetails = new EventEmitter<string>();
  @Output() uploadDocuments = new EventEmitter<string>();
  @Output() deleteBatch = new EventEmitter<string>();
  @Output() createBatch = new EventEmitter<void>();
  
  /**
   * Navigate to batch details
   * @param batchId The ID of the batch to view
   */
  onViewDetails(batchId: string): void {
    this.viewDetails.emit(batchId);
  }
  
  /**
   * Navigate to document upload for a batch
   * @param batchId The ID of the batch to upload to
   */
  onUploadDocuments(batchId: string): void {
    this.uploadDocuments.emit(batchId);
  }
  
  /**
   * Delete a batch
   * @param batchId The ID of the batch to delete
   */
  onDeleteBatch(batchId: string, event: Event): void {
    event.stopPropagation();
    this.deleteBatch.emit(batchId);
  }
  
  /**
   * Create a new batch
   */
  onCreateBatch(): void {
    this.createBatch.emit();
  }
}