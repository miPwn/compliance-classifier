# Angular Dashboard Refactoring Specification

## Table of Contents

1. [Overview and Goals](#1-overview-and-goals)
2. [Component Architecture](#2-component-architecture)
3. [UI/UX Design Specifications](#3-uiux-design-specifications)
4. [Detailed Component Specifications](#4-detailed-component-specifications)
   - [4.1 Header/Navbar](#41-headernavbar)
   - [4.2 Dashboard Layout](#42-dashboard-layout)
   - [4.3 Real-Time Pipeline Component](#43-real-time-pipeline-component)
   - [4.4 Recent Batches Component](#44-recent-batches-component)
   - [4.5 Classification Category Summary Component](#45-classification-category-summary-component)
   - [4.6 Upload Experience](#46-upload-experience)
   - [4.7 Create Batch Modal](#47-create-batch-modal)
5. [State Management](#5-state-management)
6. [Responsive Design Considerations](#6-responsive-design-considerations)
7. [Implementation Strategy](#7-implementation-strategy)
8. [Conclusion](#8-conclusion)

## 1. Overview and Goals

This specification outlines the refactoring of the Compliance Classifier Angular dashboard using PrimeNG and PrimeFlex. The refactoring aims to improve the user interface, enhance user experience, and optimize the dashboard's functionality while maintaining its core features.

### Primary Goals:
- Implement a modern, responsive UI using PrimeNG components and PrimeFlex grid system
- Improve the header/navbar with better organization and accessibility
- Create a more intuitive dashboard layout with clear sections
- Enhance the upload experience with drag-and-drop functionality
- Implement real-time pipeline visualization
- Provide better classification category visualization
- Ensure responsive design across all device sizes

## 2. Component Architecture

```
app/
├── layout/
│   ├── header/
│   │   ├── header.component.ts
│   │   ├── header.component.html
│   │   └── header.component.scss
│   └── footer/
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html
│   │   │   └── dashboard.component.scss
│   │   ├── components/
│   │   │   ├── pipeline-timeline/
│   │   │   ├── recent-batches/
│   │   │   └── category-summary/
│   ├── batch/
│   │   ├── components/
│   │   │   ├── create-batch/
│   │   │   ├── batch-details/
│   │   │   └── document-upload/
│   └── shared/
│       ├── components/
│       │   ├── file-upload/
│       │   ├── status-badge/
│       │   └── chart-card/
│       └── directives/
└── core/
    ├── services/
    ├── models/
    └── interceptors/
```

## 3. UI/UX Design Specifications

### Color Palette
- Primary: var(--primary-color) - PrimeNG theme default
- Secondary: var(--surface-200)
- Success: var(--green-500)
- Warning: var(--yellow-500)
- Error: var(--red-500)
- Info: var(--blue-500)
- Background: var(--surface-0)
- Card Background: var(--surface-card)

### Typography
- Font Family: PrimeNG default (system font stack)
- Headings: 
  - H1: 1.75rem, 600 weight
  - H2: 1.5rem, 600 weight
  - H3: 1.25rem, 600 weight
  - H4: 1.1rem, 500 weight
- Body: 1rem, 400 weight
- Small: 0.875rem

### Component Styling
- Border Radius: 8px (cards, buttons), 4px (inputs, badges)
- Shadows: subtle elevation (0 2px 4px rgba(0,0,0,0.1))
- Hover Effects: scale transform (1.02) and shadow increase
- Transitions: 0.2s for all hover/active states

## 4. Detailed Component Specifications

### 4.1 Header/Navbar

#### Requirements
- Logo placement at top-left
- Horizontal navbar with AI Provider dropdown
- "Create New Batch" button (rounded, primary style)
- Optional user icon/status

#### Design Specification
- Fixed position header with shadow
- Height: 64px
- Logo: Left-aligned, 40px height
- Navigation: Centered, horizontal layout
- AI Provider: Dropdown with icon
- Create Batch Button: Right-aligned, rounded with primary color
- User Menu: Far right, with dropdown for profile options

#### Pseudocode

```typescript
// header.component.ts
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  aiProviders: SelectItem[] = [
    { label: 'OpenAI', value: 'openai' },
    { label: 'Azure AI', value: 'azure' },
    { label: 'Google AI', value: 'google' }
  ];
  
  selectedProvider: string = 'openai';
  isAuthenticated: boolean = true;
  username: string = 'User';
  
  constructor(
    private router: Router,
    private configService: ConfigService
  ) {}
  
  ngOnInit(): void {
    // Load current AI provider from config service
    this.loadCurrentProvider();
  }
  
  loadCurrentProvider(): void {
    this.configService.getAIProvider().subscribe(provider => {
      this.selectedProvider = provider;
    });
  }
  
  onProviderChange(event: any): void {
    // Update AI provider in config service
    this.configService.setAIProvider(event.value).subscribe();
  }
  
  createNewBatch(): void {
    this.router.navigate(['/batches/create']);
  }
  
  logout(): void {
    // Handle logout
  }
}
```

```html
<!-- header.component.html -->
<header class="header">
  <div class="header-container">
    <!-- Logo -->
    <div class="logo-container">
      <a routerLink="/" class="logo">
        <img src="assets/images/cube-logo.svg" alt="CUBE Logo" class="logo-image" />
      </a>
    </div>
    
    <!-- Navigation -->
    <nav class="main-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
        </li>
        <li class="nav-item">
          <a routerLink="/batches" routerLinkActive="active" class="nav-link">Batches</a>
        </li>
        <li class="nav-item">
          <a routerLink="/reports" routerLinkActive="active" class="nav-link">Reports</a>
        </li>
      </ul>
    </nav>
    
    <!-- AI Provider Dropdown -->
    <div class="ai-provider-container">
      <p-dropdown 
        [options]="aiProviders" 
        [(ngModel)]="selectedProvider"
        (onChange)="onProviderChange($event)"
        optionLabel="label"
        styleClass="p-dropdown-sm">
        <ng-template pTemplate="selectedItem">
          <div class="flex align-items-center">
            <i class="pi pi-server mr-2"></i>
            <span>{{ selectedProvider | titlecase }}</span>
          </div>
        </ng-template>
      </p-dropdown>
    </div>
    
    <!-- Create Batch Button -->
    <div class="create-batch-container">
      <button 
        pButton 
        pRipple 
        label="Create New Batch" 
        icon="pi pi-plus" 
        class="p-button-rounded" 
        (click)="createNewBatch()">
      </button>
    </div>
    
    <!-- User Menu -->
    <div class="user-menu-container" *ngIf="isAuthenticated">
      <p-menu #menu [popup]="true" [model]="[
        {label: 'Profile', icon: 'pi pi-user'},
        {label: 'Settings', icon: 'pi pi-cog'},
        {separator: true},
        {label: 'Logout', icon: 'pi pi-sign-out', command: () => logout()}
      ]"></p-menu>
      
      <button 
        pButton 
        type="button" 
        class="p-button-text p-button-rounded" 
        icon="pi pi-user" 
        (click)="menu.toggle($event)">
        <span class="username">{{ username }}</span>
      </button>
    </div>
  </div>
</header>
```

```scss
// header.component.scss
.header {
  background-color: var(--surface-0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
}

.header-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.logo-image {
  height: 40px;
  width: auto;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0 0.5rem;
}

.nav-link {
  display: block;
  padding: 0.5rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: var(--surface-100);
  }
  
  &.active {
    color: var(--primary-color);
    background-color: var(--primary-50);
  }
}

.ai-provider-container {
  margin: 0 1rem;
}

.create-batch-container {
  margin: 0 1rem;
}

.user-menu-container {
  margin-left: auto;
}

// Responsive adjustments
@media (max-width: 992px) {
  .ai-provider-container {
    margin: 0 0.5rem;
  }
  
  .create-batch-container button {
    .p-button-label {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
  
  .header-container {
    justify-content: space-between;
  }
  
  .ai-provider-container,
  .create-batch-container,
  .user-menu-container {
    margin: 0 0.25rem;
  }
}
```

### 4.2 Dashboard Layout

#### Requirements
- Grid layout with three main sections
- Left section: Real-Time Pipeline
- Right section: Recent Batches
- Bottom section: Classification Category Summary

#### Design Specification
- Container with max-width: 1400px
- PrimeFlex grid system
- Responsive breakpoints for different screen sizes
- Card-based layout with consistent styling
- Subtle shadows and rounded corners

#### Pseudocode

```html
<!-- dashboard.component.html -->
<div class="dashboard-container">
  <p-toast></p-toast>
  
  <div class="grid">
    <!-- Real-Time Pipeline (Left Section) -->
    <div class="col-12 lg:col-6 xl:col-7">
      <app-pipeline-timeline 
        [pipelineEvents]="pipelineEvents"
        [isLoading]="isLoading"
        [autoRefresh]="autoRefresh"
        (refreshToggle)="toggleAutoRefresh()"
        (manualRefresh)="refreshData()">
      </app-pipeline-timeline>
    </div>
    
    <!-- Recent Batches (Right Section) -->
    <div class="col-12 lg:col-6 xl:col-5">
      <app-recent-batches
        [batches]="recentBatches"
        [isLoading]="isLoading"
        [error]="error"
        (viewDetails)="viewBatchDetails($event)"
        (uploadDocuments)="uploadToBatch($event)">
      </app-recent-batches>
    </div>
    
    <!-- Classification Category Summary (Bottom Section) -->
    <div class="col-12">
      <app-category-summary
        [categories]="classificationCategories"
        [isLoading]="isLoading">
      </app-category-summary>
    </div>
  </div>
</div>
```

```scss
// dashboard.component.scss
.dashboard-container {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 64px; // Account for fixed header
}

:host ::ng-deep {
  .p-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  .p-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
  }
}
```

### 4.3 Real-Time Pipeline Component

#### Requirements
- Timeline visualization using p-timeline
- Status indicators with appropriate colors
- Auto-refresh toggle
- Manual refresh button

#### Design Specification
- Vertical timeline with alternating content
- Custom markers with status-specific colors
- Event cards with batch and document information
- Empty state for no events

#### Pseudocode

```typescript
// pipeline-timeline.component.ts
@Component({
  selector: 'app-pipeline-timeline',
  templateUrl: './pipeline-timeline.component.html',
  styleUrls: ['./pipeline-timeline.component.scss']
})
export class PipelineTimelineComponent {
  @Input() pipelineEvents: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() autoRefresh: boolean = true;
  
  @Output() refreshToggle = new EventEmitter<boolean>();
  @Output() manualRefresh = new EventEmitter<void>();
  
  toggleAutoRefresh(): void {
    this.refreshToggle.emit(!this.autoRefresh);
  }
  
  refresh(): void {
    this.manualRefresh.emit();
  }
}
```

```html
<!-- pipeline-timeline.component.html -->
<p-card>
  <ng-template pTemplate="header">
    <div class="flex justify-content-between align-items-center">
      <h3>
        <i class="pi pi-clock mr-2"></i>
        Real-Time Processing Pipeline
      </h3>
      <div class="refresh-controls flex align-items-center">
        <p-inputSwitch [(ngModel)]="autoRefresh" (onChange)="toggleAutoRefresh()"></p-inputSwitch>
        <span class="ml-2 mr-3">Auto-refresh</span>
        <button pButton pRipple icon="pi pi-refresh"
          class="p-button-rounded p-button-text"
          (click)="refresh()"
          [disabled]="isLoading"
          pTooltip="Refresh data">
        </button>
      </div>
    </div>
  </ng-template>
  
  <p-progressBar *ngIf="isLoading" mode="indeterminate" [style]="{'height': '6px'}"></p-progressBar>
  
  <div class="pipeline-content">
    <p-timeline [value]="pipelineEvents" align="alternate" styleClass="pipeline-timeline">
      <ng-template pTemplate="content" let-event>
        <div class="pipeline-event-card" [ngClass]="event.status">
          <div class="event-header">
            <span class="event-status">{{ event.status | titlecase }}</span>
          </div>
          <div class="event-body">
            <div class="event-batch">{{ event.batchName }}</div>
            <div class="event-filename">{{ event.filename }}</div>
            <div class="event-time">{{ event.time | date:'short' }}</div>
          </div>
        </div>
      </ng-template>
      <ng-template pTemplate="opposite" let-event>
        <div class="pipeline-stage" [style.color]="event.color">
          <i [class]="event.icon"></i>
        </div>
      </ng-template>
      <ng-template pTemplate="marker" let-event>
        <span class="custom-marker" [style.backgroundColor]="event.color">
          <i [class]="event.icon"></i>
        </span>
      </ng-template>
    </p-timeline>
    
    <div *ngIf="pipelineEvents.length === 0" class="empty-pipeline">
      <i class="pi pi-inbox empty-icon"></i>
      <p>No recent document processing activity.</p>
    </div>
  </div>
</p-card>
```

```scss
// pipeline-timeline.component.scss
.pipeline-timeline {
  margin: 2rem 0;
  min-height: 300px;
}

.pipeline-event-card {
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--surface-card);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 250px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  &.classified {
    border-left: 4px solid var(--green-500);
  }
  
  &.processing {
    border-left: 4px solid var(--blue-500);
  }
  
  &.error {
    border-left: 4px solid var(--red-500);
  }
  
  &.pending {
    border-left: 4px solid var(--yellow-500);
  }
}

.event-header {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.event-body {
  font-size: 0.875rem;
}

.event-batch {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.event-filename {
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.event-time {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.custom-marker {
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1;
  
  i {
    font-size: 1.25rem;
    color: var(--surface-0);
  }
}

.empty-pipeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-color-secondary);
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
}

.refresh-controls {
  margin-left: auto;
}
```

### 4.4 Recent Batches Component

#### Requirements
- Card-based list of recent batches
- Actions for each batch (view details, upload)
- Loading state and error handling
- Empty state for no batches

#### Design Specification
- Card layout with hover effects
- Batch information (name, creation date, document count)
- Action buttons with tooltips
- Pagination for more than 5 batches

#### Pseudocode

```typescript
// recent-batches.component.ts
@Component({
  selector: 'app-recent-batches',
  templateUrl: './recent-batches.component.html',
  styleUrls: ['./recent-batches.component.scss']
})
export class RecentBatchesComponent {
  @Input() batches: Batch[] = [];
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  
  @Output() viewDetails = new EventEmitter<string>();
  @Output() uploadDocuments = new EventEmitter<string>();
  
  onViewDetails(batchId: string): void {
    this.viewDetails.emit(batchId);
  }
  
  onUploadDocuments(batchId: string): void {
    this.uploadDocuments.emit(batchId);
  }
}
```

```html
<!-- recent-batches.component.html -->
<p-card>
  <ng-template pTemplate="header">
    <div class="flex justify-content-between align-items-center">
      <h3>
        <i class="pi pi-folder-open mr-2"></i>
        Recent Batches
      </h3>
    </div>
  </ng-template>
  
  <p-progressBar *ngIf="isLoading" mode="indeterminate" [style]="{'height': '6px'}"></p-progressBar>
  
  <div *ngIf="error" class="p-message p-message-error">
    <span class="p-message-text">{{ error }}</span>
  </div>
  
  <div *ngIf="!isLoading && !error" class="batches-list">
    <p-dataView [value]="batches" [paginator]="batches.length > 5" [rows]="5">
      <ng-template pTemplate="list" let-batches>
        <div class="grid">
          <div *ngFor="let batch of batches" class="col-12 p-2">
            <div class="batch-card p-card">
              <div class="p-card-body">
                <div class="flex justify-content-between align-items-center">
                  <div>
                    <h4>{{ batch.name }}</h4>
                    <p>Created: {{ batch.createdAt | date:'medium' }}</p>
                    <p-badge [value]="batch.documentCount.toString()" severity="info" styleClass="document-badge"></p-badge>
                    <span class="ml-2">Documents</span>
                  </div>
                  <div class="batch-actions">
                    <button pButton pRipple icon="pi pi-upload"
                      class="p-button-rounded p-button-outlined mr-2"
                      pTooltip="Upload Documents"
                      (click)="onUploadDocuments(batch.id)">
                    </button>
                    <button pButton pRipple icon="pi pi-eye"
                      class="p-button-rounded p-button-outlined"
                      pTooltip="View Details"
                      (click)="onViewDetails(batch.id)">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
      <ng-template pTemplate="empty">
        <div class="empty-batches">
          <i class="pi pi-folder empty-icon"></i>
          <p>No batches found. Create a new batch to get started.</p>
        </div>
      </ng-template>
    </p-dataView>
  </div>
</p-card>
```

```scss
// recent-batches.component.scss
.batches-list {
  margin-top: 1rem;
}

.batch-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.batch-actions {
  display: flex;
}

.document-badge {
  font-size: 0.75rem;
}

.empty-batches {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-color-secondary);
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
}
```

### 4.5 Classification Category Summary Component

#### Requirements
- Visual representation of classification categories
- Charts for category distribution
- Card-based layout

#### Design Specification
- Grid of category cards
- PrimeNG charts (pie, bar) for visualization
- Color-coded categories
- Responsive grid layout

#### Pseudocode

```typescript
// category-summary.component.ts
@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.scss']
})
export class CategorySummaryComponent implements OnInit {
  @Input() categories: ClassificationCategory[] = [];
  @Input() isLoading: boolean = false;
  
  pieChartData: any;
  pieChartOptions: any;
  barChartData: any;
  barChartOptions: any;
  
  ngOnInit(): void {
    this.initCharts();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.categories) {
      this.initCharts();
    }
  }
  
  initCharts(): void {
    if (this.categories.length === 0) return;
    
    // Prepare data for pie chart
    const labels = this.categories.map(c => c.name);
    const data = this.categories.map(c => c.documentCount || 0);
    const backgroundColors = [
      '#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2',
      '#EC407A', '#AB47BC', '#5C6BC0', '#29B6F6', '#26A69A'
    ];
    
    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors.slice(0, data.length)
        }
      ]
    };
    
    this.pieChartOptions = {
      plugins: {
        legend: {
          position: 'right'
        }
      }
    };
    
    // Prepare data for bar chart
    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Document Count',
          data: data,
          backgroundColor: '#42A5F5'
        }
      ]
    };
    
    this.barChartOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    };
  }
}
```

```html
<!-- category-summary.component.html -->
<p-card>
  <ng-template pTemplate="header">
    <div class="flex justify-content-between align-items-center">
      <h3>
        <i class="pi pi-chart-pie mr-2"></i>
        Classification Categories
      </h3>
    </div>
  </ng-template>
  
  <p-progressBar *ngIf="isLoading" mode="indeterminate" [style]="{'height': '6px'}"></p-progressBar>
  
  <div *ngIf="!isLoading" class="category-content">
    <div *ngIf="categories.length > 0" class="grid">
      <!-- Charts Section -->
      <div class="col-12 md:col-6">
        <div class="chart-container">
          <h4>Category Distribution</h4>
          <p-chart type="pie" [data]="pieChartData" [options]="pieChartOptions"></p-chart>
        </div>
      </div>
      
      <div class="col-12 md:col-6">
        <div class="chart-container">
          <h4>Document Count by Category</h4>
          <p-chart type="bar" [data]="barChartData" [options]="barChartOptions"></p-chart>
        </div>
      </div>
      
      <!-- Category Cards -->
      <div class="col-12">
        <h4>Category Details</h4>
        <div class="grid">
          <div *ngFor="let category of categories; let i = index" class="col-12 md:col-6 lg:col-4 xl:col-3 p-2">
            <div class="category-card p-card">
              <div class="category-card-header" [style.backgroundColor]="pieChartData?.datasets[0]?.backgroundColor[i]">
                <h5>{{ category.name }}</h5>
              </div>
              <div class="p-card-body">
                <p>{{ category.description }}</p>
                <div class="category-stats">
                  <span class="document-count">{{ category.documentCount || 0 }}</span>
                  <span class="document-label">Documents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div *ngIf="categories.length === 0" class="empty-categories">
      <i class="pi pi-chart-pie empty-icon"></i>
      <p>No classification categories available.</p>
    </div>
  </div>
</p-card>
```

```scss
// category-summary.component.scss
.category-content {
  margin-top: 1rem;
}

.chart-container {
  margin-bottom: 2rem;
  
  h4 {
    text-align: center;
    margin-bottom: 1rem;
  }
}

.category-card {
