import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { BreadcrumbModule } from 'primeng/breadcrumb';

// Directives
import { InputSanitizerDirective } from './directives/input-sanitizer.directive';

@NgModule({
  declarations: [],
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
    DialogModule,
    ConfirmDialogModule,
    ChartModule,
    CalendarModule,
    MultiSelectModule,
    MenubarModule,
    SidebarModule,
    PanelModule,
    DividerModule,
    TooltipModule,
    RatingModule,
    BreadcrumbModule,
    InputSanitizerDirective
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
    DialogModule,
    ConfirmDialogModule,
    ChartModule,
    CalendarModule,
    MultiSelectModule,
    MenubarModule,
    SidebarModule,
    PanelModule,
    DividerModule,
    TooltipModule,
    RatingModule,
    BreadcrumbModule,
    InputSanitizerDirective
  ]
})
export class SharedModule { }