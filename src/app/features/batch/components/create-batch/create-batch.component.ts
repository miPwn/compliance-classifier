import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss']
})
export class CreateBatchComponent implements OnInit {
  batchForm: FormGroup;
  submitting: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    this.batchForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }
  
  onSubmit(): void {
    if (this.batchForm.invalid) {
      this.markFormGroupTouched(this.batchForm);
      return;
    }
    
    this.submitting = true;
    
    // Simulate API call
    setTimeout(() => {
      // Generate a random batch ID
      const batchId = Math.floor(Math.random() * 1000).toString();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Batch Created',
        detail: 'Batch has been created successfully'
      });
      
      this.submitting = false;
      
      // Navigate to document upload page with the new batch ID
      this.router.navigate(['/batches', batchId, 'upload']);
    }, 1000);
  }
  
  cancel(): void {
    this.router.navigate(['/batches']);
  }
  
  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}