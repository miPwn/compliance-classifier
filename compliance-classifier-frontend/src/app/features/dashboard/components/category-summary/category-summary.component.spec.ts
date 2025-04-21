import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CategorySummaryComponent } from './category-summary.component';

describe('CategorySummaryComponent', () => {
  let component: CategorySummaryComponent;
  let fixture: ComponentFixture<CategorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CategorySummaryComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategorySummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title correctly', () => {
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleElement.textContent).toContain('Classification Categories');
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

  it('should display empty state when no categories', () => {
    component.categories = [];
    component.isLoading = false;
    fixture.detectChanges();
    const emptyState = fixture.debugElement.query(By.css('.empty-categories'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain('No classification categories available');
  });

  it('should initialize charts when categories are provided', () => {
    spyOn(component, 'initCharts');
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 },
      { id: 'cat2', name: 'Contract', description: 'Contract documents', documentCount: 5 }
    ];
    component.ngOnChanges({
      categories: {
        currentValue: component.categories,
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.initCharts).toHaveBeenCalled();
  });

  it('should not initialize charts when categories array is empty', () => {
    component.categories = [];
    component.initCharts();
    expect(component.pieChartData).toBeUndefined();
    expect(component.barChartData).toBeUndefined();
  });

  it('should create pie chart data with correct values', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 },
      { id: 'cat2', name: 'Contract', description: 'Contract documents', documentCount: 5 }
    ];
    component.initCharts();
    
    expect(component.pieChartData).toBeTruthy();
    expect(component.pieChartData.labels).toEqual(['Financial', 'Contract']);
    expect(component.pieChartData.datasets[0].data).toEqual([10, 5]);
    expect(component.pieChartData.datasets[0].backgroundColor.length).toBe(2);
  });

  it('should create bar chart data with correct values', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 },
      { id: 'cat2', name: 'Contract', description: 'Contract documents', documentCount: 5 }
    ];
    component.initCharts();
    
    expect(component.barChartData).toBeTruthy();
    expect(component.barChartData.labels).toEqual(['Financial', 'Contract']);
    expect(component.barChartData.datasets[0].data).toEqual([10, 5]);
    expect(component.barChartData.datasets[0].label).toBe('Document Count');
  });

  it('should configure pie chart options correctly', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 }
    ];
    component.initCharts();
    
    expect(component.pieChartOptions).toBeTruthy();
    expect(component.pieChartOptions.plugins.legend.position).toBe('right');
    expect(component.pieChartOptions.responsive).toBeTrue();
    expect(component.pieChartOptions.maintainAspectRatio).toBeFalse();
    expect(component.pieChartOptions.plugins.tooltip.callbacks.label).toBeTruthy();
  });

  it('should configure bar chart options correctly', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 }
    ];
    component.initCharts();
    
    expect(component.barChartOptions).toBeTruthy();
    expect(component.barChartOptions.indexAxis).toBe('y');
    expect(component.barChartOptions.plugins.legend.display).toBeFalse();
    expect(component.barChartOptions.scales.x.beginAtZero).toBeTrue();
    expect(component.barChartOptions.responsive).toBeTrue();
    expect(component.barChartOptions.maintainAspectRatio).toBeFalse();
  });

  it('should display both charts when categories are available', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 },
      { id: 'cat2', name: 'Contract', description: 'Contract documents', documentCount: 5 }
    ];
    component.isLoading = false;
    component.initCharts();
    fixture.detectChanges();
    
    const charts = fixture.debugElement.queryAll(By.css('p-chart'));
    expect(charts.length).toBe(2);
    expect(charts[0].attributes['type']).toBe('pie');
    expect(charts[1].attributes['type']).toBe('bar');
  });

  it('should display category cards for each category', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10, riskLevel: 'High' },
      { id: 'cat2', name: 'Contract', description: 'Contract documents', documentCount: 5, riskLevel: 'Low' }
    ];
    component.isLoading = false;
    component.initCharts();
    fixture.detectChanges();
    
    const categoryCards = fixture.debugElement.queryAll(By.css('.category-card'));
    expect(categoryCards.length).toBe(2);
    
    const firstCardTitle = categoryCards[0].query(By.css('h5')).nativeElement;
    expect(firstCardTitle.textContent).toContain('Financial');
    
    const firstCardDescription = categoryCards[0].query(By.css('p')).nativeElement;
    expect(firstCardDescription.textContent).toContain('Financial documents');
    
    const firstCardDocCount = categoryCards[0].query(By.css('.document-count')).nativeElement;
    expect(firstCardDocCount.textContent).toBe('10');
  });

  it('should display risk level badge when risk level is provided', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10, riskLevel: 'High' }
    ];
    component.isLoading = false;
    component.initCharts();
    fixture.detectChanges();
    
    const riskBadge = fixture.debugElement.query(By.css('.risk-badge')).nativeElement;
    expect(riskBadge.textContent.trim()).toBe('High');
    expect(riskBadge.classList.contains('risk-high')).toBeTrue();
  });

  it('should not display risk level badge when risk level is not provided', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 }
    ];
    component.isLoading = false;
    component.initCharts();
    fixture.detectChanges();
    
    const riskBadge = fixture.debugElement.query(By.css('.risk-badge'));
    expect(riskBadge).toBeFalsy();
  });

  it('should be responsive on different screen sizes', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 10 }
    ];
    component.isLoading = false;
    component.initCharts();
    fixture.detectChanges();
    
    const gridElements = fixture.debugElement.queryAll(By.css('.grid'));
    expect(gridElements.length).toBeGreaterThan(0);
    
    const colElements = fixture.debugElement.queryAll(By.css('[class*="col-"]'));
    expect(colElements.length).toBeGreaterThan(0);
    
    // Check for responsive classes
    const mdColElement = fixture.debugElement.query(By.css('.md\\:col-6'));
    expect(mdColElement).toBeTruthy();
  });

  it('should handle tooltip percentage calculation correctly', () => {
    component.categories = [
      { id: 'cat1', name: 'Financial', description: 'Financial documents', documentCount: 75 },
      { id: 'cat2', name: 'Contract', description: 'Contract documents', documentCount: 25 }
    ];
    component.initCharts();
    
    const tooltipCallback = component.pieChartOptions.plugins.tooltip.callbacks.label;
    const mockContext = {
      label: 'Financial',
      raw: 75,
      dataset: {
        data: [75, 25]
      }
    };
    
    const result = tooltipCallback(mockContext);
    expect(result).toBe('Financial: 75 (75%)');
  });
});