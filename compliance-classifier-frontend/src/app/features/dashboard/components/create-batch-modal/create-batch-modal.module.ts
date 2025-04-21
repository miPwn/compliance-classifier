import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

// Components
import { CreateBatchModalComponent } from './create-batch-modal.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    RippleModule,
    ToastModule,
    CreateBatchModalComponent
  ],
  exports: [
    CreateBatchModalComponent
  ]
})
export class CreateBatchModalModule { }