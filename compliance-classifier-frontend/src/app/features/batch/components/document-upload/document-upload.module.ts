import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DocumentUploadComponent } from './document-upload.component';

// PrimeNG imports
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    ButtonModule,
    CardModule,
    TooltipModule,
    DropdownModule,
    InputTextModule,
    DocumentUploadComponent
  ],
  exports: [
    DocumentUploadComponent
  ]
})
export class DocumentUploadModule { }