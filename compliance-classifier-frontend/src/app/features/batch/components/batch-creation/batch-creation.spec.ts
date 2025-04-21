import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { BatchCreationComponent } from './batch-creation.component';
import { BatchService } from '../../../../core/services/batch.service';
import { DocumentService } from '../../../../core/services/document.service';
import { ThemeService } from '../../../../core/services/theme.service';

describe('BatchCreationComponent', () => {
  let component: BatchCreationComponent;
  let fixture: ComponentFixture<BatchCreationComponent>;
  let batchService: jasmine.SpyObj<BatchService>;
  let documentService: jasmine.SpyObj<DocumentService>;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const batchServiceSpy = jasmine.createSpyObj('BatchService', ['createBatch']);
    const documentServiceSpy = jasmine.createSpyObj('DocumentService', ['uploadDocument']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['getTheme']);
    
    themeServiceSpy.getTheme.and.returnValue(of('light'));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        BatchCreationComponent
      ],
      providers: [
        { provide: BatchService, useValue: batchServiceSpy },
        { provide: DocumentService, useValue: documentServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BatchCreationComponent);
    component = fixture.componentInstance;
    batchService = TestBed.inject(BatchService) as jasmine.SpyObj<BatchService>;
    documentService = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Batch Creation Workflow', () => {
    it('should create a batch when form is valid', () => {
      // Arrange
      const mockBatch = { id: '123', name: 'Test Batch', createdAt: new Date().toISOString(), documentCount: 0 };
      batchService.createBatch.and.returnValue(of(mockBatch));
      
      component.batchForm.setValue({
        name: 'Test Batch',
        description: 'Test Description'
      });
      
      // Act
      component.onSubmit();
      
      // Assert
      expect(batchService.createBatch).toHaveBeenCalledWith({
        name: 'Test Batch',
        description: 'Test Description'
      });
      expect(component.createdBatchId).toBe('123');
      expect(messageService.add).toHaveBeenCalled();
    });
    
    it('should show error message when batch creation fails', () => {
      // Arrange
      batchService.createBatch.and.returnValue(throwError(() => new Error('Server error')));
      
      component.batchForm.setValue({
        name: 'Test Batch',
        description: 'Test Description'
      });
      
      // Act
      component.onSubmit();
      
      // Assert
      expect(batchService.createBatch).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalled();
      expect(component.createdBatchId).toBeNull();
    });
    
    it('should upload files and navigate to dashboard after successful upload', fakeAsync(() => {
      // Arrange
      const mockBatch = { id: '123', name: 'Test Batch', createdAt: new Date().toISOString(), documentCount: 0 };
      batchService.createBatch.and.returnValue(of(mockBatch));
      documentService.uploadDocument.and.returnValue(of({ id: 'doc1', filename: 'test.pdf', status: 'uploaded' }));
      
      component.createdBatchId = '123';
      
      const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const mockEvent = {
        files: [mockFile]
      };
      
      // Act
      component.onUpload(mockEvent);
      tick(2000); // Wait for the setTimeout to complete
      
      // Assert
      expect(documentService.uploadDocument).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(messageService.add).toHaveBeenCalled();
    }));
  });
});