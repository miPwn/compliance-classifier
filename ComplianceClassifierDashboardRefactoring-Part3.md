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