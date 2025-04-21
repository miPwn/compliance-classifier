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