import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { BatchCreationComponent } from './batch-creation.component';
import { BatchService } from '../../../../core/services/batch.service';
import { DocumentService } from '../../../../core/services/document.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { MessageService } from 'primeng/api';

describe('BatchCreationComponent', () => {
  let component: BatchCreationComponent;
  let fixture: ComponentFixture<BatchCreationComponent>;
  let batchService: jasmine.SpyObj<BatchService>;
  let documentService: jasmine.SpyObj<DocumentService>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: Router;

  beforeEach(async () => {
    const batchServiceSpy = jasmine.createSpyObj('BatchService', ['createBatch']);
    const documentServiceSpy = jasmine.createSpyObj('DocumentService', ['uploadDocument']);
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['getTheme']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    
    // Mock theme service to return observable of 'light' theme
    themeServiceSpy.getTheme.and.returnValue(of('light'));
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        BatchCreationComponent
      ],
      providers: [
        { provide: BatchService, useValue: batchServiceSpy },
        { provide: DocumentService, useValue: documentServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    batchService = TestBed.inject(BatchService) as jasmine.SpyObj<BatchService>;
    documentService = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router);
    
    fixture = TestBed.createComponent(BatchCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the forms with empty values', () => {
    // Check batch form
    expect(component.batchForm.get('name')?.value).toBe('');
    expect(component.batchForm.get('description')?.value).toBe('');
    
    // Check metadata form
    expect(component.metadataForm.get('documentType')?.value).toBe('');
    expect(component.metadataForm.get('classification')?.value).toBe('');
    expect(component.metadataForm.get('tags')?.value).toBe('');
    expect(component.metadataForm.get('notes')?.value).toBe('');
  });

  it('should mark form as invalid when name is empty', () => {
    component.batchForm.get('name')?.setValue('');
    component.submitted = true;
    fixture.detectChanges();
    
    expect(component.batchForm.valid).toBeFalsy();
  });

  it('should create a batch when form is valid', () => {
    const mockBatch = { id: '123', name: 'Test Batch', createdAt: new Date().toISOString(), documentCount: 0 };
    batchService.createBatch.and.returnValue(of(mockBatch));
    
    component.batchForm.get('name')?.setValue('Test Batch');
    component.batchForm.get('description')?.setValue('Test Description');
    
    component.onSubmit();
    
    expect(batchService.createBatch).toHaveBeenCalledWith({
      name: 'Test Batch',
      description: 'Test Description'
    });
    expect(component.createdBatchId).toBe('123');
  });

  it('should navigate back when goBack is called', () => {
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/batches']);
  });

  it('should navigate to batch details when viewBatch is called with a valid batch ID', () => {
    spyOn(router, 'navigate');
    component.createdBatchId = '123';
    component.viewBatch();
    expect(router.navigate).toHaveBeenCalledWith(['/batches', '123']);
  });

  it('should not navigate to batch details when viewBatch is called without a batch ID', () => {
    spyOn(router, 'navigate');
    component.createdBatchId = null;
    component.viewBatch();
    expect(router.navigate).not.toHaveBeenCalled();
  });
  
  it('should subscribe to theme service on init', () => {
    expect(themeService.getTheme).toHaveBeenCalled();
    expect(component.currentTheme).toBe('light');
  });
  
  it('should validate metadata form correctly', () => {
    // Form should be invalid when required fields are empty
    expect(component.metadataForm.valid).toBeFalsy();
    
    // Fill in required fields
    component.metadataForm.get('documentType')?.setValue('Report');
    component.metadataForm.get('classification')?.setValue('Confidential');
    
    // Form should now be valid
    expect(component.metadataForm.valid).toBeTruthy();
  });
  
  it('should handle file selection correctly', () => {
    const mockEvent = {
      files: [
        new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      ]
    };
    
    component.onFileSelect(mockEvent);
    
    expect(component.selectedFiles.length).toBe(1);
    expect(component.uploadProgress).toBe(0);
    expect(messageService.add).toHaveBeenCalled();
  });
  
  it('should validate file types correctly', () => {
    // Valid file
    const validFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    expect(component.isValidFile(validFile)).toBeTrue();
    
    // Invalid file type
    const invalidTypeFile = new File(['test content'], 'test.exe', { type: 'application/octet-stream' });
    expect(component.isValidFile(invalidTypeFile)).toBeFalse();
    
    // File too large
    const mockLargeFile = new File(['test content'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(mockLargeFile, 'size', { value: 20000000 }); // 20MB
    expect(component.isValidFile(mockLargeFile)).toBeFalse();
  });
  
  it('should handle drag and drop events correctly', () => {
    const dragOverEvent = new DragEvent('dragover');
    const dragLeaveEvent = new DragEvent('dragleave');
    
    spyOn(dragOverEvent, 'preventDefault');
    spyOn(dragOverEvent, 'stopPropagation');
    spyOn(dragLeaveEvent, 'preventDefault');
    spyOn(dragLeaveEvent, 'stopPropagation');
    
    component.onDragOver(dragOverEvent);
    
    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
    expect(dragOverEvent.stopPropagation).toHaveBeenCalled();
    expect(component.dragOver).toBeTrue();
    
    component.onDragLeave(dragLeaveEvent);
    
    expect(dragLeaveEvent.preventDefault).toHaveBeenCalled();
    expect(dragLeaveEvent.stopPropagation).toHaveBeenCalled();
    expect(component.dragOver).toBeFalse();
  });
  
  it('should handle file upload errors correctly', async () => {
    // Set up batch ID
    component.createdBatchId = '123';
    
    // Mock document service to throw an error
    documentService.uploadDocument.and.returnValue(throwError('Upload error'));
    
    const mockEvent = {
      files: [
        new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      ]
    };
    
    await component.onUpload(mockEvent);
    
    expect(component.failedFiles).toBe(1);
    expect(component.uploadedFiles).toBe(0);
    expect(messageService.add).toHaveBeenCalled();
  });
  
  it('should format file size correctly', () => {
    expect(component.formatFileSize(0)).toBe('0 Bytes');
    expect(component.formatFileSize(1024)).toBe('1 KB');
    expect(component.formatFileSize(1048576)).toBe('1 MB');
    expect(component.formatFileSize(1500)).toBe('1.46 KB');
  });
  
  it('should get correct file icon based on extension', () => {
    expect(component.getFileIcon('document.pdf')).toBe('pi pi-file-pdf');
    expect(component.getFileIcon('document.doc')).toBe('pi pi-file-word');
    expect(component.getFileIcon('document.docx')).toBe('pi pi-file-word');
    expect(component.getFileIcon('document.txt')).toBe('pi pi-file-text');
    expect(component.getFileIcon('document.rtf')).toBe('pi pi-file');
    expect(component.getFileIcon('document.unknown')).toBe('pi pi-file');
  });
  
  it('should cancel upload correctly', () => {
    component.uploadingFiles = true;
    component.uploadProgress = 50;
    component.selectedFiles = [new File(['test'], 'test.pdf')];
    
    component.cancelUpload();
    
    expect(component.uploadingFiles).toBeFalse();
    expect(component.uploadProgress).toBe(0);
    expect(component.selectedFiles.length).toBe(0);
    expect(messageService.add).toHaveBeenCalled();
  });
  
  it('should clear selected files on onClear', () => {
    component.selectedFiles = [new File(['test'], 'test.pdf')];
    component.uploadProgress = 50;
    
    component.onClear();
    
    expect(component.selectedFiles.length).toBe(0);
    expect(component.uploadProgress).toBe(0);
  });
});