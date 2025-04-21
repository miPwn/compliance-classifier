import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

import { BatchListComponent } from './batch-list.component';
import { BatchService, Batch } from '../../../../core/services/batch.service';
import { SharedModule } from '../../../../shared/shared.module';

describe('BatchListComponent', () => {
  let component: BatchListComponent;
  let fixture: ComponentFixture<BatchListComponent>;
  let batchServiceSpy: jasmine.SpyObj<BatchService>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationService>;

  const mockBatches: Batch[] = [
    { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 },
    { id: '2', name: 'Batch 2', createdAt: '2025-04-21T10:00:00Z', documentCount: 3 }
  ];

  beforeEach(async () => {
    const batchSpy = jasmine.createSpyObj('BatchService', ['getBatches', 'deleteBatch']);
    const confirmSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [BatchListComponent],
      providers: [
        { provide: BatchService, useValue: batchSpy },
        { provide: ConfirmationService, useValue: confirmSpy }
      ]
    }).compileComponents();

    batchServiceSpy = TestBed.inject(BatchService) as jasmine.SpyObj<BatchService>;
    confirmationServiceSpy = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
  });

  beforeEach(() => {
    batchServiceSpy.getBatches.and.returnValue(of(mockBatches));
    
    fixture = TestBed.createComponent(BatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load batches on init', () => {
    expect(batchServiceSpy.getBatches).toHaveBeenCalled();
    expect(component.batches.length).toBe(2);
    expect(component.batches).toEqual(mockBatches);
  });

  it('should display batches in the table', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('p-table tbody tr');
    
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Batch 1');
    expect(rows[1].textContent).toContain('Batch 2');
  });

  it('should navigate to batch details when view button is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.viewBatch('1');
    
    expect(routerSpy).toHaveBeenCalledWith(['/batches', '1']);
  });

  it('should navigate to create batch page when create button is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.createBatch();
    
    expect(routerSpy).toHaveBeenCalledWith(['/batches/create']);
  });

  it('should show confirmation dialog when delete button is clicked', () => {
    component.confirmDelete('1');
    
    expect(confirmationServiceSpy.confirm).toHaveBeenCalled();
    const confirmCall = confirmationServiceSpy.confirm.calls.mostRecent().args[0];
    expect(confirmCall.message).toContain('Are you sure');
  });

  it('should delete batch when confirmed', () => {
    batchServiceSpy.deleteBatch.and.returnValue(of(null));
    
    // Simulate confirmation by directly calling the accept function
    confirmationServiceSpy.confirm.and.callFake((confirmation) => {
      if (confirmation.accept) {
        confirmation.accept();
      }
    });
    
    component.confirmDelete('1');
    
    expect(batchServiceSpy.deleteBatch).toHaveBeenCalledWith('1');
    expect(batchServiceSpy.getBatches).toHaveBeenCalledTimes(2); // Initial load + after delete
  });

  it('should handle loading state', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const progressBar = compiled.querySelector('p-progressBar');
    
    expect(progressBar).toBeTruthy();
  });

  it('should handle error state', () => {
    component.error = 'Failed to load batches';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const errorMessage = compiled.querySelector('.error-message');
    
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Failed to load batches');
  });
});