import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RecentBatchesComponent } from './recent-batches.component';

describe('RecentBatchesComponent', () => {
  let component: RecentBatchesComponent;
  let fixture: ComponentFixture<RecentBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecentBatchesComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentBatchesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title correctly', () => {
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleElement.textContent).toContain('Recent Batches');
  });

  it('should show progress bar when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const progressBar = fixture.debugElement.query(By.css('p-progressBar'));
    expect(progressBar).toBeTruthy();
  });

  it('should not show progress bar when not loading', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const progressBar = fixture.debugElement.query(By.css('p-progressBar'));
    expect(progressBar).toBeFalsy();
  });

  it('should display error message when error exists', () => {
    component.error = 'Test error message';
    component.isLoading = false;
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('.p-message-error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Test error message');
  });

  it('should display empty state when no batches', () => {
    component.batches = [];
    component.isLoading = false;
    component.error = null;
    fixture.detectChanges();
    const emptyState = fixture.debugElement.query(By.css('.empty-batches'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain('No batches found');
  });

  it('should display batch cards when batches are available', () => {
    component.batches = [
      { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 },
      { id: '2', name: 'Batch 2', createdAt: '2025-04-21T10:00:00Z', documentCount: 3 }
    ];
    component.isLoading = false;
    component.error = null;
    fixture.detectChanges();
    
    const batchCards = fixture.debugElement.queryAll(By.css('.batch-card'));
    expect(batchCards.length).toBe(2);
    
    const firstBatchName = batchCards[0].query(By.css('h4')).nativeElement;
    expect(firstBatchName.textContent).toContain('Batch 1');
    
    const secondBatchName = batchCards[1].query(By.css('h4')).nativeElement;
    expect(secondBatchName.textContent).toContain('Batch 2');
  });

  it('should emit viewDetails event when view details button is clicked', () => {
    spyOn(component.viewDetails, 'emit');
    component.onViewDetails('1');
    expect(component.viewDetails.emit).toHaveBeenCalledWith('1');
  });

  it('should emit uploadDocuments event when upload documents button is clicked', () => {
    spyOn(component.uploadDocuments, 'emit');
    component.onUploadDocuments('1');
    expect(component.uploadDocuments.emit).toHaveBeenCalledWith('1');
  });

  it('should emit deleteBatch event when delete batch button is clicked', () => {
    spyOn(component.deleteBatch, 'emit');
    const mockEvent = new MouseEvent('click');
    component.onDeleteBatch('1', mockEvent);
    expect(component.deleteBatch.emit).toHaveBeenCalledWith('1');
  });

  it('should emit createBatch event when create batch button is clicked', () => {
    spyOn(component.createBatch, 'emit');
    component.onCreateBatch();
    expect(component.createBatch.emit).toHaveBeenCalled();
  });

  it('should display document count badge correctly', () => {
    component.batches = [
      { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 }
    ];
    component.isLoading = false;
    component.error = null;
    fixture.detectChanges();
    
    const badge = fixture.debugElement.query(By.css('p-badge')).nativeElement;
    expect(badge.textContent).toContain('5');
  });

  it('should display batch creation date correctly', () => {
    component.batches = [
      { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 }
    ];
    component.isLoading = false;
    component.error = null;
    fixture.detectChanges();
    
    const dateElement = fixture.debugElement.query(By.css('.batch-card p')).nativeElement;
    expect(dateElement.textContent).toContain('Created:');
    expect(dateElement.textContent).toContain('2025-04-20');
  });

  it('should have action buttons for each batch', () => {
    component.batches = [
      { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 }
    ];
    component.isLoading = false;
    component.error = null;
    fixture.detectChanges();
    
    const actionButtons = fixture.debugElement.queryAll(By.css('.batch-actions button'));
    expect(actionButtons.length).toBe(3); // Upload, View, Delete
    
    // Check tooltips
    expect(actionButtons[0].attributes['pTooltip']).toBe('Add Files to Batch');
    expect(actionButtons[1].attributes['pTooltip']).toBe('View Details');
    expect(actionButtons[2].attributes['pTooltip']).toBe('Delete Batch');
  });

  it('should be responsive on different screen sizes', () => {
    fixture.detectChanges();
    const gridElement = fixture.debugElement.query(By.css('.grid'));
    expect(gridElement).toBeTruthy();
    
    component.batches = [
      { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 }
    ];
    component.isLoading = false;
    component.error = null;
    fixture.detectChanges();
    
    const colElement = fixture.debugElement.query(By.css('.col-12'));
    expect(colElement).toBeTruthy();
  });

  it('should handle pagination when there are more than 5 batches', () => {
    component.batches = Array(6).fill(0).map((_, i) => ({
      id: i.toString(),
      name: `Batch ${i}`,
      createdAt: '2025-04-20T10:00:00Z',
      documentCount: i
    }));
    component.isLoading = false;
    component.error = null;
    fixture.detectChanges();
    
    const dataView = fixture.debugElement.query(By.css('p-dataView'));
    expect(dataView).toBeTruthy();
    expect(dataView.attributes['ng-reflect-paginator']).toBe('true');
    expect(dataView.attributes['ng-reflect-rows']).toBe('5');
  });
});