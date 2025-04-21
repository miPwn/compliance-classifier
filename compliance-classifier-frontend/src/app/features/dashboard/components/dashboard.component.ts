import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BatchService, Batch } from '../../../core/services/batch.service';
import { ClassificationService, ClassificationCategory } from '../../../core/services/classification.service';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    MessageModule
  ]
})
export class DashboardComponent implements OnInit {
  recentBatches: Batch[] = [];
  classificationCategories: ClassificationCategory[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private batchService: BatchService,
    private classificationService: ClassificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecentBatches();
    this.loadClassificationCategories();
  }

  loadRecentBatches(): void {
    this.isLoading = true;
    this.batchService.getBatches()
      .subscribe({
        next: (batches) => {
          this.recentBatches = batches;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load recent batches';
          this.isLoading = false;
          console.error('Error loading batches:', err);
        }
      });
  }

  loadClassificationCategories(): void {
    this.classificationService.getClassificationCategories()
      .subscribe({
        next: (categories) => {
          this.classificationCategories = categories;
        },
        error: (err) => {
          console.error('Error loading classification categories:', err);
        }
      });
  }

  viewBatchDetails(batchId: string): void {
    this.router.navigate(['/batches', batchId]);
  }

  createNewBatch(): void {
    this.router.navigate(['/batches/create']);
  }
}