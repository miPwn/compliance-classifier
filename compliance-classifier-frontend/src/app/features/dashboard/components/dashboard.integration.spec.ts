import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { BatchService } from '../../../core/services/batch.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { DocumentService } from '../../../core/services/document.service';

describe('DashboardComponent - Integration Tests', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let batchServiceSpy: jasmine.SpyObj<BatchService>;
  let classificationServiceSpy: jasmine.SpyObj<ClassificationService>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const batchSpy = jasmine.createSpyObj('BatchService', ['getBatches', 'deleteBatch']);
    const classSpy = jasmine.createSpyObj('ClassificationService', ['getClassificationCategories']);
    const docSpy = jasmine.createSpyObj('DocumentService', ['getDocumentsByBatchId']);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);
    const msgSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BatchService, useValue: batchSpy },
        { provide: ClassificationService, useValue: classSpy },
        { provide: DocumentService, useValue: docSpy },
        { provide: Router, useValue: routeSpy },
        { provide: MessageService, useValue: msgSpy }
      ]
    }).compileComponents();

    batchServiceSpy = TestBed.inject(BatchService) as jasmine.SpyObj<BatchService>;
    classificationServiceSpy = TestBed.inject(ClassificationService) as jasmine.SpyObj<ClassificationService>;
    documentServiceSpy = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    
    // Setup mock data
    const mockBatches = [
      { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 },
      { id: '2', name: 'Batch 2', createdAt: '2025-04-21T10:00:00Z', documentCount: 3 }
    ];
    
    const mockCategories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents' },
      { id: 'cat2', name: 'Contract', description: 'Contract documents' }
    ];
    
    const mockDocuments = [
      { id: 'doc1', batchId: '1', filename: 'document1.pdf', status: 'classified', uploadedAt: '2025-04-20T10:30:00Z' },
      { id: 'doc2', batchId: '1', filename: 'document2.pdf', status: 'processing', uploadedAt: '2025-04-20T10:35:00Z' }
    ];
    
    batchServiceSpy.getBatches.and.returnValue(of(mockBatches));
    classificationServiceSpy.getClassificationCategories.and.returnValue(of(mockCategories));
    documentServiceSpy.getDocumentsByBatchId.and.returnValue(of(mockDocuments));
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all data on initialization', () => {
    expect(batchServiceSpy.getBatches).toHaveBeenCalled();
    expect(classificationServiceSpy.getClassificationCategories).toHaveBeenCalled();
    expect(documentServiceSpy.getDocumentsByBatchId).toHaveBeenCalled();
  });

  it('should pass data correctly to pipeline-timeline component', () => {
    const pipelineComponent = fixture.debugElement.query(By.css('app-pipeline-timeline'));
    expect(pipelineComponent).toBeTruthy();
    
    expect(pipelineComponent.properties['pipelineEvents']).toBe(component.pipelineEvents);
    expect(pipelineComponent.properties['isLoading']).toBe(component.isLoading);
    expect(pipelineComponent.properties['autoRefresh']).toBe(component.autoRefresh);
  });

  it('should pass data correctly to recent-batches component', () => {
    const batchesComponent = fixture.debugElement.query(By.css('app-recent-batches'));
    expect(batchesComponent).toBeTruthy();
    
    expect(batchesComponent.properties['batches']).toBe(component.recentBatches);
    expect(batchesComponent.properties['isLoading']).toBe(component.isLoading);
    expect(batchesComponent.properties['error']).toBe(component.error);
  });

  it('should pass data correctly to category-summary component', () => {
    const categoryComponent = fixture.debugElement.query(By.css('app-category-summary'));
    expect(categoryComponent).toBeTruthy();
    
    expect(categoryComponent.properties['categories']).toBe(component.classificationCategoriesWithCounts);
    expect(categoryComponent.properties['isLoading']).toBe(component.isLoading);
  });

  it('should conditionally display file-upload component', () => {
    // Initially not displayed
    let fileUploadComponent = fixture.debugElement.query(By.css('app-file-upload'));
    expect(fileUploadComponent).toBeFalsy();
    
    // Set selected batch ID
    component.selectedBatchId = '1';
    fixture.detectChanges();
    
    // Now it should be displayed
    fileUploadComponent = fixture.debugElement.query(By.css('app-file-upload'));
    expect(fileUploadComponent).toBeTruthy();
    expect(fileUploadComponent.properties['batchId']).toBe('1');
  });

  it('should handle refresh toggle from pipeline-timeline component', () => {
    spyOn(component, 'toggleAutoRefresh');
    
    const pipelineComponent = fixture.debugElement.query(By.css('app-pipeline-timeline'));
    pipelineComponent.triggerEventHandler('refreshToggle', true);
    
    expect(component.toggleAutoRefresh).toHaveBeenCalledWith(true);
  });

  it('should handle manual refresh from pipeline-timeline component', () => {
    spyOn(component, 'refreshData');
    
    const pipelineComponent = fixture.debugElement.query(By.css('app-pipeline-timeline'));
    pipelineComponent.triggerEventHandler('manualRefresh', null);
    
    expect(component.refreshData).toHaveBeenCalled();
  });

  it('should handle view details event from recent-batches component', () => {
    const batchesComponent = fixture.debugElement.query(By.css('app-recent-batches'));
    batchesComponent.triggerEventHandler('viewDetails', '1');
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/batches', '1']);
  });

  it('should handle upload documents event from recent-batches component', () => {
    spyOn(component, 'uploadToBatch');
    
    const batchesComponent = fixture.debugElement.query(By.css('app-recent-batches'));
    batchesComponent.triggerEventHandler('uploadDocuments', '1');
    
    expect(component.uploadToBatch).toHaveBeenCalledWith('1');
    expect(component.selectedBatchId).toBe('1');
  });

  it('should handle create batch event from recent-batches component', () => {
    spyOn(component, 'createNewBatch');
    
    const batchesComponent = fixture.debugElement.query(By.css('app-recent-batches'));
    batchesComponent.triggerEventHandler('createBatch', null);
    
    expect(component.createNewBatch).toHaveBeenCalled();
  });

  it('should handle delete batch event from recent-batches component', () => {
    spyOn(component, 'deleteBatch');
    
    const batchesComponent = fixture.debugElement.query(By.css('app-recent-batches'));
    batchesComponent.triggerEventHandler('deleteBatch', '1');
    
    expect(component.deleteBatch).toHaveBeenCalledWith('1');
  });

  it('should handle batch created event from create-batch-modal component', () => {
    spyOn(component, 'onBatchCreated');
    const mockBatch = { id: '3', name: 'New Batch', createdAt: '2025-04-22T10:00:00Z', documentCount: 0 };
    
    const modalComponent = fixture.debugElement.query(By.css('app-create-batch-modal'));
    modalComponent.triggerEventHandler('batchCreated', mockBatch);
    
    expect(component.onBatchCreated).toHaveBeenCalledWith(mockBatch);
  });

  it('should handle upload complete event from file-upload component', () => {
    // First set a selected batch to make file-upload visible
    component.selectedBatchId = '1';
    fixture.detectChanges();
    
    spyOn(component, 'onUploadComplete');
    const mockEvent = { batchId: '1', files: [new File([''], 'test.pdf')] };
    
    const fileUploadComponent = fixture.debugElement.query(By.css('app-file-upload'));
    fileUploadComponent.triggerEventHandler('uploadComplete', mockEvent);
    
    expect(component.onUploadComplete).toHaveBeenCalledWith(mockEvent);
  });

  it('should show create batch modal when createNewBatch is called', () => {
    const modalComponent = fixture.debugElement.query(By.css('app-create-batch-modal')).componentInstance;
    spyOn(modalComponent, 'show');
    
    component.createNewBatch();
    
    expect(modalComponent.show).toHaveBeenCalled();
  });

  it('should update pipeline events when documents are loaded', () => {
    spyOn(component, 'updatePipelineEvents');
    
    component.loadRecentDocuments();
    
    expect(component.updatePipelineEvents).toHaveBeenCalled();
  });

  it('should transform documents into pipeline events correctly', () => {
    // Reset pipeline events
    component.pipelineEvents = [];
    
    // Call the method
    component.updatePipelineEvents();
    
    // Check the results
    expect(component.pipelineEvents.length).toBe(2);
    
    // Check the classified document
    expect(component.pipelineEvents[0].status).toBe('classified');
    expect(component.pipelineEvents[0].filename).toBe('document1.pdf');
    expect(component.pipelineEvents[0].color).toBe('var(--green-500)');
    expect(component.pipelineEvents[0].icon).toBe('pi pi-check-circle');
    
    // Check the processing document
    expect(component.pipelineEvents[1].status).toBe('processing');
    expect(component.pipelineEvents[1].filename).toBe('document2.pdf');
    expect(component.pipelineEvents[1].color).toBe('var(--blue-500)');
    expect(component.pipelineEvents[1].icon).toBe('pi pi-spin pi-spinner');
  });

  it('should handle auto-refresh toggle correctly', () => {
    // Start with auto-refresh enabled
    component.autoRefresh = true;
    
    // Disable auto-refresh
    component.toggleAutoRefresh(false);
    
    expect(component.autoRefresh).toBeFalse();
    expect(component.refreshSubscription).toBeNull();
    
    // Re-enable auto-refresh
    spyOn(component, 'setupAutoRefresh');
    component.toggleAutoRefresh(true);
    
    expect(component.autoRefresh).toBeTrue();
    expect(component.setupAutoRefresh).toHaveBeenCalled();
  });

  it('should handle batch deletion correctly', () => {
    const mockDeleteResponse = {};
    batchServiceSpy.deleteBatch.and.returnValue(of(mockDeleteResponse));
    
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'loadRecentBatches');
    
    component.deleteBatch('1');
    
    expect(batchServiceSpy.deleteBatch).toHaveBeenCalledWith('1');
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Batch Deleted',
      detail: 'The batch has been successfully deleted'
    });
    expect(component.loadRecentBatches).toHaveBeenCalled();
  });

  it('should not delete batch if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteBatch('1');
    
    expect(batchServiceSpy.deleteBatch).not.toHaveBeenCalled();
  });

  it('should be responsive on different screen sizes', () => {
    const gridElement = fixture.debugElement.query(By.css('.grid'));
    expect(gridElement).toBeTruthy();
    
    // Check for responsive classes
    const leftColumn = fixture.debugElement.query(By.css('.lg\\:col-6.xl\\:col-7'));
    expect(leftColumn).toBeTruthy();
    
    const rightColumn = fixture.debugElement.query(By.css('.lg\\:col-6.xl\\:col-5'));
    expect(rightColumn).toBeTruthy();
  });
});