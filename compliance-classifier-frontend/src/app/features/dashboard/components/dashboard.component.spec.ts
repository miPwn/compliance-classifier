import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { BatchService } from '../../../core/services/batch.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { SharedModule } from '../../../shared/shared.module';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let batchServiceSpy: jasmine.SpyObj<BatchService>;
  let classificationServiceSpy: jasmine.SpyObj<ClassificationService>;

  beforeEach(async () => {
    const batchSpy = jasmine.createSpyObj('BatchService', ['getBatches']);
    const classificationSpy = jasmine.createSpyObj('ClassificationService', ['getClassificationCategories']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [DashboardComponent],
      providers: [
        { provide: BatchService, useValue: batchSpy },
        { provide: ClassificationService, useValue: classificationSpy }
      ]
    }).compileComponents();

    batchServiceSpy = TestBed.inject(BatchService) as jasmine.SpyObj<BatchService>;
    classificationServiceSpy = TestBed.inject(ClassificationService) as jasmine.SpyObj<ClassificationService>;
  });

  beforeEach(() => {
    const mockBatches = [
      { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 },
      { id: '2', name: 'Batch 2', createdAt: '2025-04-21T10:00:00Z', documentCount: 3 }
    ];
    
    const mockCategories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents' },
      { id: 'cat2', name: 'Contract', description: 'Contract documents' }
    ];

    batchServiceSpy.getBatches.and.returnValue(of(mockBatches));
    classificationServiceSpy.getClassificationCategories.and.returnValue(of(mockCategories));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent batches on init', () => {
    expect(batchServiceSpy.getBatches).toHaveBeenCalled();
    expect(component.recentBatches.length).toBe(2);
  });

  it('should load classification categories on init', () => {
    expect(classificationServiceSpy.getClassificationCategories).toHaveBeenCalled();
    expect(component.classificationCategories.length).toBe(2);
  });

  it('should display recent batches in the template', () => {
    const compiled = fixture.nativeElement;
    const batchElements = compiled.querySelectorAll('.batch-card');
    
    expect(batchElements.length).toBe(2);
    expect(batchElements[0].textContent).toContain('Batch 1');
    expect(batchElements[1].textContent).toContain('Batch 2');
  });

  it('should display classification categories in the template', () => {
    const compiled = fixture.nativeElement;
    const categoryElements = compiled.querySelectorAll('.category-item');
    
    expect(categoryElements.length).toBe(2);
    expect(categoryElements[0].textContent).toContain('Financial');
    expect(categoryElements[1].textContent).toContain('Contract');
  });

  it('should navigate to batch details when a batch is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.viewBatchDetails('1');
    
    expect(routerSpy).toHaveBeenCalledWith(['/batches', '1']);
  });

  it('should navigate to create batch page when create batch button is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.createNewBatch();
    
    expect(routerSpy).toHaveBeenCalledWith(['/batches/create']);
  });
});