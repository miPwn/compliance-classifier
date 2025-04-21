import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';

// Components
import { FileUploadComponent } from './file-upload.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    ButtonModule,
    RippleModule,
    BadgeModule,
    CardModule,
    FileUploadComponent
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadComponentModule { }