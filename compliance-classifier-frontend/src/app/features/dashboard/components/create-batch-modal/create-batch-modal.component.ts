import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

// Services
import { BatchService, BatchCreateRequest, Batch } from '../../../../core/services/batch.service';

@Component({
  selector: 'app-create-batch-modal',
  templateUrl: './create-batch-modal.component.html',
  styleUrls: ['./create-batch-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    RippleModule,
    ToastModule
  ]
})
export class CreateBatchModalComponent implements OnInit {
  @Output() batchCreated = new EventEmitter<Batch>();
  @Output() modalClosed = new EventEmitter<void>();
  
  visible: boolean = false;
  batchForm: FormGroup;
  submitting: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private messageService: MessageService
  ) {
    this.batchForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }
  
  ngOnInit(): void {
    // Initialize form
  }
  
  /**
   * Show the modal
   */
  show(): void {
    this.resetForm();
    this.visible = true;
  }
  
  /**
   * Hide the modal
   */
  hide(): void {
    this.visible = false;
    this.modalClosed.emit();
  }
  
  /**
   * Reset the form
   */
  resetForm(): void {
    this.batchForm.reset({
      name: '',
      description: ''
    });
    this.submitting = false;
  }
  
  /**
   * Submit the form
   */
  onSubmit(): void {
    if (this.batchForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.batchForm.controls).forEach(key => {
        const control = this.batchForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.submitting = true;
    
    const batchRequest: BatchCreateRequest = {
      name: this.batchForm.value.name,
      description: this.batchForm.value.description
    };
    
    this.batchService.createBatch(batchRequest)
      .subscribe({
        next: (batch) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Batch Created',
            detail: `Batch "${batch.name}" has been created successfully`
          });
          this.batchCreated.emit(batch);
          this.hide();
        },
        error: (error) => {
          this.submitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to create batch: ${error.message || 'Unknown error'}`
          });
        }
      });
  }
  
  /**
   * Check if a field is invalid and touched
   * @param fieldName Name of the form field
   * @returns True if the field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.batchForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }
  
  /**
   * Get error message for a field
   * @param fieldName Name of the form field
   * @returns Error message
   */
  getErrorMessage(fieldName: string): string {
    const field = this.batchForm.get(fieldName);
    
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'This field is required';
    }
    
    if (field.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    
    return '';
  }
}