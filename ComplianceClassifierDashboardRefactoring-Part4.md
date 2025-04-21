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
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.category-card-header {
  padding: 0.75rem;
  color: white;
  
  h5 {
    margin: 0;
    font-weight: 500;
  }
}

.category-stats {
  display: flex;
  align-items: baseline;
  margin-top: 0.5rem;
  
  .document-count {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-right: 0.5rem;
  }
  
  .document-label {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }
}

.empty-categories {
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

### 4.6 Upload Experience

#### Requirements
- Drag-and-drop file area using p-fileUpload
- Progress and file type badges
- Batch context integration

#### Design Specification
- Modern drag-and-drop interface
- Visual feedback for upload progress
- File type validation with visual indicators
- Clear error messaging
- Integration with batch context

#### Pseudocode

```typescript
// document-upload.component.ts
@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {
  @Input() batchId: string;
  
  uploadMode: 'existing' | 'new' = 'existing';
  selectedBatchId: string = '';
  newBatchName: string = '';
  batches: Batch[] = [];
  isLoading: boolean = false;
  uploadProgress: number = 0;
  
  acceptedFileTypes: string = '.pdf,.doc,.docx,.txt,.rtf';
  maxFileSize: number = 10000000; // 10MB
  
  constructor(
    private batchService: BatchService,
    private documentService: DocumentService,
    private messageService: MessageService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    if (this.batchId) {
      this.uploadMode = 'existing';
      this.selectedBatchId = this.batchId;
    }
    
    this.loadBatches();
  }
  
  loadBatches(): void {
    this.isLoading = true;
    this.batchService.getBatches()
      .subscribe({
        next: (batches) => {
          this.batches = batches;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load batches'
          });
          console.error('Error loading batches:', err);
        }
      });
  }
  
  onUploadMode(mode: 'existing' | 'new'): void {
    this.uploadMode = mode;
  }
  
  onFileSelect(event: any): void {
    // Validate files
    const files = event.files;
    let validFiles = true;
    
    for (const file of files) {
      if (file.size > this.maxFileSize) {
        validFiles = false;
        this.messageService.add({
          severity: 'error',
          summary: 'File Too Large',
          detail: `${file.name} exceeds the maximum file size of 10MB`
        });
      }
      
      // Check file type
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!this.acceptedFileTypes.includes(fileExt)) {
        validFiles = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid File Type',
          detail: `${file.name} is not a supported file type`
        });
      }
    }
    
    return validFiles;
  }
  
  onUpload(event: any): void {
    const files = event.files;
    
    if (!this.validateUploadContext()) {
      return;
    }
    
    // Create batch if needed
    if (this.uploadMode === 'new') {
      this.createBatchAndUpload(files);
    } else {
      this.uploadFilesToBatch(this.selectedBatchId, files);
    }
  }
  
  validateUploadContext(): boolean {
    if (this.uploadMode === 'existing' && !this.selectedBatchId) {
      this.messageService.add({
        severity: 'error',
        summary: 'No Batch Selected',
        detail: 'Please select a batch to upload to'
      });
      return false;
    }
    
    if (this.uploadMode === 'new' && !this.newBatchName.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'No Batch Name',
        detail: 'Please enter a name for the new batch'
      });
      return false;
    }
    
    return true;
  }
  
  createBatchAndUpload(files: File[]): void {
    const batchRequest = {
      name: this.newBatchName.trim(),
      description: `Batch created on ${new Date().toLocaleDateString()}`
    };
    
    this.isLoading = true;
    this.batchService.createBatch(batchRequest)
      .subscribe({
        next: (batch) => {
          this.uploadFilesToBatch(batch.id, files);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create batch'
          });
          console.error('Error creating batch:', err);
        }
      });
  }
  
  uploadFilesToBatch(batchId: string, files: File[]): void {
    this.uploadProgress = 0;
    
    this.documentService.uploadDocuments(batchId, files, (progress) => {
      this.uploadProgress = progress;
    }).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.uploadProgress = 100;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Upload Complete',
          detail: `Successfully uploaded ${files.length} document(s)`
        });
        
        // Navigate to batch details
        setTimeout(() => {
          this.router.navigate(['/batches', batchId]);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.uploadProgress = 0;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'Failed to upload documents'
        });
        console.error('Error uploading documents:', err);
      }
    });
  }
}
```

```html
<!-- document-upload.component.html -->
<div class="document-upload-container">
  <p-toast></p-toast>
  
  <p-card>
    <ng-template pTemplate="header">
      <div class="flex justify-content-between align-items-center">
        <div class="flex align-items-center">
          <button pButton pRipple icon="pi pi-arrow-left"
            class="p-button-text mr-2"
            (click)="goBack()">
          </button>
          <h3>Upload Documents</h3>
        </div>
      </div>
    </ng-template>
    
    <div *ngIf="isLoading" class="flex justify-content-center">
      <p-progressBar mode="indeterminate"></p-progressBar>
    </div>
    
    <div *ngIf="!isLoading">
      <!-- Upload Mode Selection -->
      <div class="upload-mode-selection mb-4">
        <h4>Upload to:</h4>
        <div class="flex gap-2">
          <p-button 
            [label]="'Existing Batch'" 
            [outlined]="uploadMode !== 'existing'"
            [raised]="uploadMode === 'existing'"
            (onClick)="onUploadMode('existing')"
            styleClass="p-button-sm">
          </p-button>
          <p-button 
            [label]="'New Batch'" 
            [outlined]="uploadMode !== 'new'"
            [raised]="uploadMode === 'new'"
            (onClick)="onUploadMode('new')"
            styleClass="p-button-sm">
          </p-button>
        </div>
      </div>
      
      <!-- Existing Batch Selection -->
      <div *ngIf="uploadMode === 'existing'" class="mb-4">
        <label for="batchSelect" class="block font-medium mb-2">Select Batch</label>
        <p-dropdown 
          id="batchSelect"
          [options]="batches" 
          [(ngModel)]="selectedBatchId" 
          optionLabel="name" 
          optionValue="id"
          placeholder="Select a batch"
          [disabled]="batches.length === 0"
          styleClass="w-full">
        </p-dropdown>
        
        <div *ngIf="batches.length === 0" class="mt-2 p-error">
          No batches available. Please create a new batch.
        </div>
      </div>
      
      <!-- New Batch Creation -->
      <div *ngIf="uploadMode === 'new'" class="mb-4">
        <label for="newBatchName" class="block font-medium mb-2">New Batch Name</label>
        <input 
          id="newBatchName"
          type="text" 
          pInputText 
          [(ngModel)]="newBatchName" 
          placeholder="Enter batch name"
          class="w-full">
      </div>
      
      <!-- File Upload -->
      <div class="file-upload-section">
        <h4>Select Files</h4>
        <p-fileUpload 
          name="documents[]" 
          [multiple]="true"
          [showUploadButton]="true"
          [showCancelButton]="true"
          [fileLimit]="10"
          [accept]="acceptedFileTypes"
          [maxFileSize]="maxFileSize"
          [customUpload]="true"
          (uploadHandler)="onUpload($event)"
          (onSelect)="onFileSelect($event)"
          (onError)="onError($event)"
          [disabled]="(uploadMode === 'existing' && !selectedBatchId) || (uploadMode === 'new' && !newBatchName.trim())"
          chooseLabel="Browse"
          uploadLabel="Upload All"
          cancelLabel="Clear"
          styleClass="upload-component">
          <ng-template pTemplate="content">
            <div class="upload-instructions">
              <div class="upload-icon">
                <i class="pi pi-cloud-upload"></i>
              </div>
              <p>Drag and drop files here or click Browse to select files.</p>
              <div class="file-type-badges">
                <p-badge value="PDF" severity="info" styleClass="mr-2"></p-badge>
                <p-badge value="DOC" severity="info" styleClass="mr-2"></p-badge>
                <p-badge value="DOCX" severity="info" styleClass="mr-2"></p-badge>
                <p-badge value="TXT" severity="info" styleClass="mr-2"></p-badge>
                <p-badge value="RTF" severity="info"></p-badge>
              </div>
              <p class="upload-limits">
                <small>Maximum file size: 10MB</small>
                <small>Maximum files: 10</small>
              </p>
            </div>
            
            <div *ngIf="uploadProgress > 0" class="mt-3">
              <p-progressBar [value]="uploadProgress"></p-progressBar>
              <div class="text-center mt-2">
                <small>Uploading: {{ uploadProgress }}%</small>
              </div>
            </div>
          </ng-template>
        </p-fileUpload>
      </div>
    </div>
  </p-card>
</div>
```

```scss
// document-upload.component.scss
.document-upload-container {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.upload-mode-selection {
  margin-bottom: 1.5rem;
}

.file-upload-section {
  margin-top: 2rem;
}

:host ::ng-deep {
  .upload-component {
    .p-fileupload-content {
      padding: 2rem;
      border: 2px dashed var(--surface-300);
      border-radius: 8px;
      transition: background-color 0.2s, border-color 0.2s;
      
      &:hover {
        background-color: var(--surface-50);
        border-color: var(--primary-color);
      }
    }
    
    .p-fileupload-row {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-radius: 4px;
      
      &:hover {
        background-color: var(--surface-100);
      }
    }
  }
}

.upload-instructions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  color: var(--text-color-secondary);
}

.upload-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  opacity: 0.7;
}

.file-type-badges {
  margin: 1rem 0;
}

.upload-limits {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
  
  small {
    margin: 0.25rem 0;
  }
}