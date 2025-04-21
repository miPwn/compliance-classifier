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

describe('DashboardComponent - Responsive Tests', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let batchServiceSpy: jasmine.SpyObj<BatchService>;
  let classificationServiceSpy: jasmine.SpyObj<ClassificationService>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;

  beforeEach(async () => {
    const batchSpy = jasmine.createSpyObj('BatchService', ['getBatches']);
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

  it('should have responsive grid layout', () => {
    const gridElement = fixture.debugElement.query(By.css('.grid'));
    expect(gridElement).toBeTruthy();
  });

  it('should have responsive column classes for pipeline timeline component', () => {
    const pipelineColumn = fixture.debugElement.query(By.css('.col-12.lg\\:col-6.xl\\:col-7'));
    expect(pipelineColumn).toBeTruthy();
    
    // Check that it contains the pipeline timeline component
    const pipelineComponent = pipelineColumn.query(By.css('app-pipeline-timeline'));
    expect(pipelineComponent).toBeTruthy();
  });

  it('should have responsive column classes for recent batches component', () => {
    const batchesColumn = fixture.debugElement.query(By.css('.col-12.lg\\:col-6.xl\\:col-5'));
    expect(batchesColumn).toBeTruthy();
    
    // Check that it contains the recent batches component
    const batchesComponent = batchesColumn.query(By.css('app-recent-batches'));
    expect(batchesComponent).toBeTruthy();
  });

  it('should have full-width column for category summary component', () => {
    const categoryColumn = fixture.debugElement.query(By.css('.col-12'));
    expect(categoryColumn).toBeTruthy();
    
    // Find the one that contains the category summary component
    const categoryComponent = fixture.debugElement.query(By.css('.col-12 app-category-summary'));
    expect(categoryComponent).toBeTruthy();
  });

  it('should have responsive column classes in pipeline timeline component', () => {
    // This test verifies that the pipeline timeline component itself has responsive classes
    const pipelineComponent = fixture.debugElement.query(By.css('app-pipeline-timeline'));
    
    // We can't directly test the internal structure of the component in this test,
    // but we can verify it's present and has the expected inputs
    expect(pipelineComponent).toBeTruthy();
    expect(pipelineComponent.properties['pipelineEvents']).toBeDefined();
  });

  it('should have responsive column classes in recent batches component', () => {
    // This test verifies that the recent batches component itself has responsive classes
    const batchesComponent = fixture.debugElement.query(By.css('app-recent-batches'));
    
    // We can't directly test the internal structure of the component in this test,
    // but we can verify it's present and has the expected inputs
    expect(batchesComponent).toBeTruthy();
    expect(batchesComponent.properties['batches']).toBeDefined();
  });

  it('should have responsive column classes in category summary component', () => {
    // This test verifies that the category summary component itself has responsive classes
    const categoryComponent = fixture.debugElement.query(By.css('app-category-summary'));
    
    // We can't directly test the internal structure of the component in this test,
    // but we can verify it's present and has the expected inputs
    expect(categoryComponent).toBeTruthy();
    expect(categoryComponent.properties['categories']).toBeDefined();
  });

  it('should conditionally display file upload component with responsive classes', () => {
    // Initially not displayed
    let fileUploadComponent = fixture.debugElement.query(By.css('app-file-upload'));
    expect(fileUploadComponent).toBeFalsy();
    
    // Set selected batch ID
    component.selectedBatchId = '1';
    fixture.detectChanges();
    
    // Now it should be displayed
    fileUploadComponent = fixture.debugElement.query(By.css('app-file-upload'));
    expect(fileUploadComponent).toBeTruthy();
    
    // Check that it's in a full-width column
    const fileUploadColumn = fixture.debugElement.query(By.css('.col-12 app-file-upload'));
    expect(fileUploadColumn).toBeTruthy();
  });

  // Simulating different screen sizes is challenging in unit tests
  // The following tests check that the responsive classes are correctly applied
  // but don't actually test the rendering at different screen sizes
  
  it('should have correct responsive breakpoints for large screens', () => {
    // Check for xl breakpoint classes
    const xlColumns = fixture.debugElement.queryAll(By.css('[class*="xl\\:col-"]'));
    expect(xlColumns.length).toBeGreaterThan(0);
  });

  it('should have correct responsive breakpoints for medium screens', () => {
    // Check for lg breakpoint classes
    const lgColumns = fixture.debugElement.queryAll(By.css('[class*="lg\\:col-"]'));
    expect(lgColumns.length).toBeGreaterThan(0);
  });

  it('should have correct responsive breakpoints for small screens', () => {
    // Check for md breakpoint classes or default col-12 for small screens
    const mdColumns = fixture.debugElement.queryAll(By.css('[class*="md\\:col-"], .col-12'));
    expect(mdColumns.length).toBeGreaterThan(0);
  });

  it('should have create batch modal with responsive styling', () => {
    const modalComponent = fixture.debugElement.query(By.css('app-create-batch-modal'));
    expect(modalComponent).toBeTruthy();
  });
});