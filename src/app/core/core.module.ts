import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { BatchService } from './services/batch.service';
import { DocumentService } from './services/document.service';
import { ClassificationService } from './services/classification.service';
import { ReportService } from './services/report.service';
import { ErrorService } from './services/error.service';
import { FileUploadService } from './services/file-upload.service';
import { SensitiveDataService } from './services/sensitive-data.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    // Services
    AuthService,
    BatchService,
    DocumentService,
    ClassificationService,
    ReportService,
    ErrorService,
    FileUploadService,
    SensitiveDataService,
    
    // Guards
    AuthGuard,
    RoleGuard
  ],
  exports: [
    HttpClientModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}