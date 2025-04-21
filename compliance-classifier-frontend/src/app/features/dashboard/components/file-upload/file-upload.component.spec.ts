import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { FileUploadComponent } from './file-upload.component';
import { DocumentService } from '../../../../core/services/document.service';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const docSpy = jasmine.createSpyObj('DocumentService', ['uploadDocument']);
    const msgSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        FileUploadComponent,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: DocumentService, useValue: docSpy },
        { provide: MessageService, useValue: msgSpy }
      ]
    }).compileComponents();

    documentServiceSpy = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title correctly', () => {
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleElement.textContent).toContain('Upload Documents');
  });

  it('should have default input values', () => {
    expect(component.batchId).toBe('');
    expect(component.maxFileSize).toBe(10000000);
    expect(component.multiple).toBeTrue();
    expect(component.accept).toBe('.pdf,.docx,.doc,.txt');
  });

  it('should show drag and drop area when not uploading', () => {
    component.uploading = false;
    fixture.detectChanges();
    const dragDropArea = fixture.debugElement.query(By.css('.drag-drop-area'));
    expect(dragDropArea).toBeTruthy();
    expect(dragDropArea.nativeElement.textContent).toContain('Drag and drop files here');
  });

  it('should not show drag and drop area when uploading', () => {
    component.uploading = true;
    fixture.detectChanges();
    const dragDropArea = fixture.debugElement.query(By.css('.drag-drop-area'));
    expect(dragDropArea).toBeFalsy();
  });

  it('should show progress bar when uploading', () => {
    component.uploading = true;
    fixture.detectChanges();
    const progressBar = fixture.debugElement.query(By.css('p-progressBar'));
    expect(progressBar).toBeTruthy();
  });

  it('should show uploaded files list when files are uploaded and not uploading', () => {
    component.uploadedFiles = [
      { name: 'test.pdf', size: 1024, type: 'application/pdf', id: '1' }
    ];
    component.uploading = false;
    fixture.detectChanges();
    const uploadedFiles = fixture.debugElement.query(By.css('.uploaded-files'));
    expect(uploadedFiles).toBeTruthy();
    
    const fileItem = uploadedFiles.query(By.css('.file-item'));
    expect(fileItem).toBeTruthy();
    expect(fileItem.nativeElement.textContent).toContain('test.pdf');
  });

  it('should not show uploaded files list when uploading', () => {
    component.uploadedFiles = [
      { name: 'test.pdf', size: 1024, type: 'application/pdf', id: '1' }
    ];
    component.uploading = true;
    fixture.detectChanges();
    const uploadedFiles = fixture.debugElement.query(By.css('.uploaded-files'));
    expect(uploadedFiles).toBeFalsy();
  });

  it('should handle file selection', () => {
    const mockEvent = {
      files: [
        { name: 'test.pdf', size: 1024, type: 'application/pdf' }
      ]
    };
    
    component.onSelect(mockEvent);
    
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Files Selected',
      detail: '1 files selected'
    });
  });

  it('should initialize upload progress when upload starts', () => {
    const mockEvent = {
      files: [
        { name: 'test1.pdf', size: 1024, type: 'application/pdf' },
        { name: 'test2.docx', size: 2048, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ]
    };
    
    documentServiceSpy.uploadDocument.and.returnValue(of({ id: '1' }));
    
    component.onUpload(mockEvent);
    
    expect(component.uploading).toBeTrue();
    expect(component.totalProgress).toBe(0);
    expect(component.uploadProgress['test1.pdf']).toBe(0);
    expect(component.uploadProgress['test2.docx']).toBe(0);
  });

  it('should upload files sequentially', () => {
    const mockFiles = [
      new File(['test content'], 'test1.pdf', { type: 'application/pdf' }),
      new File(['test content'], 'test2.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    ];
    
    documentServiceSpy.uploadDocument.and.returnValue(of({ id: '1' }));
    
    component.batchId = 'batch-1';
    component.uploadFilesSequentially(mockFiles, 0);
    
    expect(documentServiceSpy.uploadDocument).toHaveBeenCalledWith('batch-1', mockFiles[0]);
    expect(component.uploadProgress['test1.pdf']).toBe(100);
    expect(component.uploadedFiles.length).toBe(1);
    expect(component.uploadedFiles[0].name).toBe('test1.pdf');
  });

  it('should handle upload completion', () => {
    const mockFiles = [
      new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    ];
    
    documentServiceSpy.uploadDocument.and.returnValue(of({ id: '1' }));
    spyOn(component.uploadComplete, 'emit');
    
    component.batchId = 'batch-1';
    component.uploadFilesSequentially(mockFiles, 0);
    
    expect(component.uploadComplete.emit).toHaveBeenCalledWith({
      batchId: 'batch-1',
      files: mockFiles
    });
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Upload Complete',
      detail: '1 files uploaded successfully'
    });
  });

  it('should handle upload error', () => {
    const mockFiles = [
      new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    ];
    
    const errorResponse = { message: 'Upload failed' };
    documentServiceSpy.uploadDocument.and.returnValue(throwError(() => errorResponse));
    spyOn(component.uploadError, 'emit');
    
    component.batchId = 'batch-1';
    component.uploadFilesSequentially(mockFiles, 0);
    
    expect(component.uploading).toBeFalse();
    expect(component.uploadError.emit).toHaveBeenCalledWith({
      file: mockFiles[0],
      error: errorResponse
    });
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Failed to upload test.pdf: Upload failed'
    });
  });

  it('should update total progress correctly', () => {
    component.uploadProgress = {
      'file1.pdf': 50,
      'file2.pdf': 100
    };
    
    component['updateTotalProgress']();
    
    expect(component.totalProgress).toBe(75);
  });

  it('should handle empty progress values', () => {
    component.uploadProgress = {};
    
    component['updateTotalProgress']();
    
    expect(component.totalProgress).toBe(0);
  });

  it('should get correct file type badge for different file extensions', () => {
    expect(component.getFileTypeBadge('document.pdf')).toBe('danger');
    expect(component.getFileTypeBadge('document.docx')).toBe('info');
    expect(component.getFileTypeBadge('document.doc')).toBe('info');
    expect(component.getFileTypeBadge('document.txt')).toBe('success');
    expect(component.getFileTypeBadge('document.unknown')).toBe('warning');
  });

  it('should get correct file type label for different file extensions', () => {
    expect(component.getFileTypeLabel('document.pdf')).toBe('PDF');
    expect(component.getFileTypeLabel('document.docx')).toBe('DOCX');
    expect(component.getFileTypeLabel('document.txt')).toBe('TXT');
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(0)).toBe('0 B');
    expect(component.formatFileSize(1024)).toBe('1 KB');
    expect(component.formatFileSize(1048576)).toBe('1 MB');
    expect(component.formatFileSize(1073741824)).toBe('1 GB');
    expect(component.formatFileSize(500)).toBe('500 B');
    expect(component.formatFileSize(1500)).toBe('1.46 KB');
  });

  it('should clear uploaded files', () => {
    component.uploadedFiles = [
      { name: 'test.pdf', size: 1024, type: 'application/pdf', id: '1' }
    ];
    
    component.clearUploadedFiles();
    
    expect(component.uploadedFiles.length).toBe(0);
  });

  it('should be responsive on different screen sizes', () => {
    fixture.detectChanges();
    const uploadComponent = fixture.debugElement.query(By.css('.upload-component'));
    expect(uploadComponent).toBeTruthy();
  });

  it('should disable upload button when uploading', () => {
    component.uploading = true;
    fixture.detectChanges();
    const fileUpload = fixture.debugElement.query(By.css('p-fileUpload'));
    expect(fileUpload.attributes['ng-reflect-disabled']).toBe('true');
  });
});