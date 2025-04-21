import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccessibilityPanelComponent } from './components/accessibility-panel/accessibility-panel.component';
import { OfflineIndicatorComponent } from './components/offline-indicator/offline-indicator.component';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    ChartModule,
    DialogModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    ToolbarModule,
    PanelModule,
    DividerModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    RippleModule,
    AccessibilityPanelComponent,
    OfflineIndicatorComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    ChartModule,
    DialogModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    ToolbarModule,
    PanelModule,
    DividerModule,
    TagModule,
    BadgeModule,
    TooltipModule,
    RippleModule
  ]
})
export class SharedModule { }