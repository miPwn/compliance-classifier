import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PipelineTimelineComponent } from './pipeline-timeline.component';

describe('PipelineTimelineComponent', () => {
  let component: PipelineTimelineComponent;
  let fixture: ComponentFixture<PipelineTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PipelineTimelineComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PipelineTimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title correctly', () => {
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleElement.textContent).toContain('Real-Time Processing Pipeline');
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

  it('should display empty state when no events', () => {
    component.pipelineEvents = [];
    fixture.detectChanges();
    const emptyState = fixture.debugElement.query(By.css('.empty-pipeline'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain('No recent document processing activity');
  });

  it('should display timeline events when available', () => {
    component.pipelineEvents = [
      {
        status: 'processing',
        time: new Date(),
        icon: 'pi pi-spin pi-spinner',
        color: 'var(--blue-500)',
        filename: 'document1.pdf',
        batchName: 'Batch 1'
      },
      {
        status: 'classified',
        time: new Date(),
        icon: 'pi pi-check-circle',
        color: 'var(--green-500)',
        filename: 'document2.pdf',
        batchName: 'Batch 1'
      }
    ];
    fixture.detectChanges();
    const timelineComponent = fixture.debugElement.query(By.css('p-timeline'));
    expect(timelineComponent).toBeTruthy();
    
    const eventCards = fixture.debugElement.queryAll(By.css('.pipeline-event-card'));
    expect(eventCards.length).toBe(2);
  });

  it('should toggle auto-refresh when switch is clicked', () => {
    spyOn(component.refreshToggle, 'emit');
    component.autoRefresh = true;
    
    component.toggleAutoRefresh();
    
    expect(component.autoRefresh).toBeFalse();
    expect(component.refreshToggle.emit).toHaveBeenCalledWith(false);
  });

  it('should emit manual refresh event when refresh button is clicked', () => {
    spyOn(component.manualRefresh, 'emit');
    
    component.refresh();
    
    expect(component.manualRefresh.emit).toHaveBeenCalled();
  });

  it('should apply correct status class to event cards', () => {
    component.pipelineEvents = [
      {
        status: 'processing',
        time: new Date(),
        icon: 'pi pi-spin pi-spinner',
        color: 'var(--blue-500)',
        filename: 'document1.pdf',
        batchName: 'Batch 1'
      },
      {
        status: 'classified',
        time: new Date(),
        icon: 'pi pi-check-circle',
        color: 'var(--green-500)',
        filename: 'document2.pdf',
        batchName: 'Batch 1'
      },
      {
        status: 'error',
        time: new Date(),
        icon: 'pi pi-exclamation-circle',
        color: 'var(--red-500)',
        filename: 'document3.pdf',
        batchName: 'Batch 1'
      }
    ];
    fixture.detectChanges();
    
    const eventCards = fixture.debugElement.queryAll(By.css('.pipeline-event-card'));
    expect(eventCards[0].classes['processing']).toBeTrue();
    expect(eventCards[1].classes['classified']).toBeTrue();
    expect(eventCards[2].classes['error']).toBeTrue();
  });

  it('should display event details correctly', () => {
    const now = new Date();
    component.pipelineEvents = [
      {
        status: 'classified',
        time: now,
        icon: 'pi pi-check-circle',
        color: 'var(--green-500)',
        filename: 'test-document.pdf',
        batchName: 'Test Batch'
      }
    ];
    fixture.detectChanges();
    
    const eventCard = fixture.debugElement.query(By.css('.pipeline-event-card'));
    const statusElement = eventCard.query(By.css('.event-status')).nativeElement;
    const batchElement = eventCard.query(By.css('.event-batch')).nativeElement;
    const filenameElement = eventCard.query(By.css('.event-filename')).nativeElement;
    
    expect(statusElement.textContent).toContain('Classified');
    expect(batchElement.textContent).toContain('Test Batch');
    expect(filenameElement.textContent).toContain('test-document.pdf');
  });

  it('should be responsive on different screen sizes', () => {
    fixture.detectChanges();
    const cardElement = fixture.debugElement.query(By.css('p-card'));
    expect(cardElement).toBeTruthy();
    
    // Check that the timeline has the appropriate class for responsive layout
    const timelineElement = fixture.debugElement.query(By.css('.pipeline-timeline'));
    expect(timelineElement).toBeTruthy();
  });
});