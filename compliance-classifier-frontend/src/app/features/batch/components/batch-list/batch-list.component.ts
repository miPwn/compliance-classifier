import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BatchService, Batch } from '../../../../core/services/batch.service';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss'],
  providers: [ConfirmationService, MessageService],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    InputTextModule,
    TooltipModule,
    MessageModule
  ]
})
export class BatchListComponent implements OnInit {
  batches: Batch[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private batchService: BatchService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.isLoading = true;
    this.error = null;
    
    this.batchService.getBatches()
      .subscribe({
        next: (batches) => {
          this.batches = batches;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load batches';
          this.isLoading = false;
          console.error('Error loading batches:', err);
        }
      });
  }

  viewBatch(batchId: string): void {
    this.router.navigate(['/batches', batchId]);
  }

  createBatch(): void {
    this.router.navigate(['/batches/create']);
  }

  confirmDelete(batchId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this batch? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteBatch(batchId);
      }
    });
  }

  private deleteBatch(batchId: string): void {
    this.isLoading = true;
    
    this.batchService.deleteBatch(batchId)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch deleted successfully'
          });
          this.loadBatches();
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete batch'
          });
          console.error('Error deleting batch:', err);
        }
      });
  }
}