import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { BatchService, BatchCreateRequest } from '../../../../core/services/batch.service';

@Component({
  selector: 'app-create-batch',
  template: `
    <div class="create-batch-container">
      <p-toast></p-toast>
      
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center">
            <div class="flex align-items-center">
              <button pButton pRipple icon="pi pi-arrow-left"
                class="p-button-text mr-2"
                (click)="goBack()">
              </button>
              <h2>Create New Batch</h2>
            </div>
          </div>
        </ng-template>
        
        <div *ngIf="isLoading" class="flex justify-content-center">
          <p-progressSpinner></p-progressSpinner>
        </div>
        
        <form [formGroup]="batchForm" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
          <div class="field">
            <label for="name" class="block font-medium mb-2">Batch Name *</label>
            <input id="name" type="text" pInputText
              class="w-full"
              formControlName="name"
              [ngClass]="{'ng-invalid ng-dirty': submitted && f.name.errors}">
            <small *ngIf="submitted && f.name.errors?.required" class="p-error">Batch name is required</small>
          </div>
          
          <div class="field mt-4">
            <label for="description" class="block font-medium mb-2">Description</label>
            <textarea id="description" pInputTextarea
              class="w-full"
              formControlName="description"
              rows="3">
            </textarea>
          </div>
          
          <div class="flex justify-content-end mt-4">
            <button pButton pRipple label="Cancel"
              class="p-button-outlined mr-2"
              type="button"
              (click)="goBack()">
            </button>
            <button pButton pRipple label="Create Batch"
              class="p-button-primary"
              type="submit"
              [disabled]="isLoading">
            </button>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .create-batch-container {
      padding: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    :host ::ng-deep .p-card {
      margin-bottom: 1rem;
    }
    
    .field {
      margin-bottom: 1.5rem;
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
    InputTextModule,
    InputTextarea,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService]
})
export class CreateBatchComponent implements OnInit {
  batchForm: FormGroup;
  isLoading = false;
  submitted = false;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private batchService: BatchService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.batchForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }
  
  // Getter for easy access to form fields
  get f() { return this.batchForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.batchForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    const batchRequest: BatchCreateRequest = {
      name: this.f.name.value,
      description: this.f.description.value
    };
    
    this.batchService.createBatch(batchRequest)
      .subscribe({
        next: (batch) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch created successfully'
          });
          
          // Navigate to the batch details page
          setTimeout(() => {
            this.router.navigate(['/batches', batch.id]);
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create batch'
          });
          console.error('Error creating batch:', err);
        }
      });
  }
  
  goBack(): void {
    this.router.navigate(['/batches']);
  }
}