import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-batch',
  template: `
    <div class="create-batch-container">
      <div class="card">
        <div class="card-header">
          <div class="flex justify-content-between align-items-center">
            <div class="flex align-items-center">
              <button class="p-button-text mr-2" (click)="goBack()">
                <i class="pi pi-arrow-left"></i>
              </button>
              <h2>Create New Batch</h2>
            </div>
          </div>
        </div>
        
        <div class="card-body">
          <p>This is a placeholder for the Create Batch functionality.</p>
          <p>This feature will be implemented in a future update.</p>
          
          <div class="mt-4">
            <button class="p-button mr-2" (click)="goBack()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-batch-container {
      padding: 1rem;
    }
    .card {
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    }
    .card-header {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    .card-body {
      padding: 1rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
    }
    .mt-4 {
      margin-top: 1.5rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule
  ]
})
export class CreateBatchComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/batches']);
  }
}