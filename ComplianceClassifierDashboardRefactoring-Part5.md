### 4.7 Create Batch Modal

#### Requirements
- Modal dialog for batch creation
- Form with validation
- Success/error feedback

#### Design Specification
- Clean, focused modal interface
- Form validation with visual feedback
- Smooth transitions and animations
- Clear action buttons

#### Pseudocode

```typescript
// create-batch-modal.component.ts
@Component({
  selector: 'app-create-batch-modal',
  templateUrl: './create-batch-modal.component.html',
  styleUrls: ['./create-batch-modal.component.scss']
})
export class CreateBatchModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() batchCreated = new EventEmitter<Batch>();
  
  batchForm: FormGroup;
  isLoading: boolean = false;
  submitted: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private batchService: BatchService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.batchForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }
  
  // Getter for easy access to form fields
  get f() { return this.batchForm.controls; }
  
  hideModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }
  
  resetForm(): void {
    this.submitted = false;
    this.batchForm.reset();
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.batchForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    const batchRequest: BatchCreateRequest = {
      name: this.f.name.value,
      description: this.f.description.value
    };
    
    this.batchService.createBatch(batchRequest)
      .subscribe({
        next: (batch) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch created successfully'
          });
          
          this.batchCreated.emit(batch);
          this.hideModal();
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
}
```

```html
<!-- create-batch-modal.component.html -->
<p-dialog 
  [(visible)]="visible" 
  [style]="{width: '450px'}" 
  header="Create New Batch" 
  [modal]="true" 
  [draggable]="false"
  [resizable]="false"
  styleClass="create-batch-modal"
  (onHide)="hideModal()">
  
  <div *ngIf="isLoading" class="flex justify-content-center">
    <p-progressSpinner></p-progressSpinner>
  </div>
  
  <form [formGroup]="batchForm" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
    <div class="field">
      <label for="name" class="block font-medium mb-2">Batch Name *</label>
      <input id="name" type="text" pInputText
        class="w-full"
        formControlName="name"
        [ngClass]="{'ng-invalid ng-dirty': submitted && f.name.errors}">
      <small *ngIf="submitted && f.name.errors?.required" class="p-error">Batch name is required</small>
      <small *ngIf="submitted && f.name.errors?.maxlength" class="p-error">Batch name cannot exceed 100 characters</small>
    </div>
    
    <div class="field mt-4">
      <label for="description" class="block font-medium mb-2">Description</label>
      <textarea id="description" pInputTextarea
        class="w-full"
        formControlName="description"
        rows="3">
      </textarea>
      <small *ngIf="submitted && f.description.errors?.maxlength" class="p-error">Description cannot exceed 500 characters</small>
    </div>
  </form>
  
  <ng-template pTemplate="footer">
    <button pButton pRipple label="Cancel"
      class="p-button-outlined"
      type="button"
      (click)="hideModal()">
    </button>
    <button pButton pRipple label="Create Batch"
      class="p-button-primary ml-2"
      type="button"
      (click)="onSubmit()"
      [disabled]="isLoading">
    </button>
  </ng-template>
</p-dialog>
```

```scss
// create-batch-modal.component.scss
:host ::ng-deep {
  .create-batch-modal {
    .p-dialog-header {
      border-bottom: 1px solid var(--surface-200);
    }
    
    .p-dialog-content {
      padding: 1.5rem;
    }
    
    .p-dialog-footer {
      border-top: 1px solid var(--surface-200);
      padding: 1rem 1.5rem;
    }
  }
}

.field {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}
```

## 5. State Management

### 5.1 Dashboard State

The dashboard will manage several pieces of state:

1. **Pipeline Events State**
   - Current pipeline events
   - Loading state
   - Auto-refresh toggle
   - Refresh interval

2. **Batches State**
   - Recent batches list
   - Loading state
   - Error state

3. **Classification Categories State**
   - Categories list
   - Loading state
   - Chart data

4. **AI Provider State**
   - Current provider
   - Available providers
   - Provider change in progress

### 5.2 State Management Strategy

For this refactoring, we'll use a combination of:

1. **Component State**: For UI-specific state like loading indicators, form values, and local component state.

2. **Service State**: For shared data that needs to be accessed across components, such as batches, documents, and classification categories.

3. **Configuration Service**: For application-wide settings like the AI provider.

```typescript
// dashboard.service.ts
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private refreshIntervalSubject = new BehaviorSubject<number>(30000);
  refreshInterval$ = this.refreshIntervalSubject.asObservable();
  
  private autoRefreshSubject = new BehaviorSubject<boolean>(true);
  autoRefresh$ = this.autoRefreshSubject.asObservable();
  
  constructor(
    private batchService: BatchService,
    private documentService: DocumentService,
    private classificationService: ClassificationService
  ) {}
  
  setRefreshInterval(interval: number): void {
    this.refreshIntervalSubject.next(interval);
  }
  
  setAutoRefresh(autoRefresh: boolean): void {
    this.autoRefreshSubject.next(autoRefresh);
  }
  
  getRecentBatches(): Observable<Batch[]> {
    return this.batchService.getBatches().pipe(
      map(batches => batches.slice(0, 5))
    );
  }
  
  getPipelineEvents(): Observable<any[]> {
    // Combine data from batches and documents to create pipeline events
    return combineLatest([
      this.batchService.getBatches(),
      this.documentService.getRecentDocuments()
    ]).pipe(
      map(([batches, documents]) => {
        return this.transformToPipelineEvents(batches, documents);
      })
    );
  }
  
  private transformToPipelineEvents(batches: Batch[], documents: Document[]): any[] {
    // Transform documents into timeline events
    const events = documents.map(doc => {
      let status = 'pending';
      let color = 'var(--yellow-500)';
      let icon = 'pi pi-clock';
      
      if (doc.status === 'classified') {
        status = 'classified';
        color = 'var(--green-500)';
        icon = 'pi pi-check-circle';
      } else if (doc.status === 'error') {
        status = 'error';
        color = 'var(--red-500)';
        icon = 'pi pi-exclamation-circle';
      } else if (doc.status === 'processing') {
        status = 'processing';
        color = 'var(--blue-500)';
        icon = 'pi pi-spin pi-spinner';
      }
      
      // Find the batch name
      const batch = batches.find(b => b.id === doc.batchId);
      
      return {
        status: status,
        time: new Date(doc.uploadedAt),
        icon: icon,
        color: color,
        filename: doc.filename,
        batchName: batch ? batch.name : 'Unknown Batch'
      };
    });
    
    // Sort by date (most recent first)
    events.sort((a, b) => b.time.getTime() - a.time.getTime());
    
    // Limit to 10 most recent events
    return events.slice(0, 10);
  }
}
```

```typescript
// config.service.ts
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private aiProviderSubject = new BehaviorSubject<string>('openai');
  aiProvider$ = this.aiProviderSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadInitialConfig();
  }
  
  private loadInitialConfig(): void {
    // Load from API or local storage
    const savedProvider = localStorage.getItem('aiProvider');
    if (savedProvider) {
      this.aiProviderSubject.next(savedProvider);
    }
  }
  
  getAIProvider(): Observable<string> {
    return this.aiProvider$;
  }
  
  setAIProvider(provider: string): Observable<any> {
    return this.http.post('/api/config/ai-provider', { provider }).pipe(
      tap(() => {
        this.aiProviderSubject.next(provider);
        localStorage.setItem('aiProvider', provider);
      })
    );
  }
}
```

## 6. Responsive Design Considerations

### 6.1 Breakpoints

The dashboard will be responsive across the following breakpoints:

- **Extra Small (xs)**: < 576px (Mobile phones)
- **Small (sm)**: >= 576px (Portrait tablets)
- **Medium (md)**: >= 768px (Landscape tablets)
- **Large (lg)**: >= 992px (Desktops)
- **Extra Large (xl)**: >= 1200px (Large desktops)

### 6.2 Responsive Strategies

1. **Fluid Grid Layout**
   - Use PrimeFlex grid system with responsive classes
   - Example: `col-12 md:col-6 lg:col-4 xl:col-3`

2. **Stacking on Mobile**
   - Components stack vertically on mobile
   - Side-by-side layout on larger screens

3. **Responsive Typography**
   - Font sizes adjust based on screen size
   - Use rem units for scalability

4. **Responsive Components**
   - Cards and panels adjust width based on screen size
   - Tables convert to cards on mobile
   - Charts resize to fit container

5. **Touch-Friendly UI**
   - Larger touch targets on mobile
   - Simplified interactions for touch devices

### 6.3 Mobile-Specific Adjustments

1. **Header**
   - Collapse navigation into a menu button
   - Hide labels, show only icons
   - Simplify AI provider dropdown

2. **Dashboard Layout**
   - Stack all sections vertically
   - Simplify charts for smaller screens

3. **Timeline**
   - Convert to vertical-only timeline on mobile
   - Reduce card size and content

4. **Batch Cards**
   - Full width on mobile
   - Simplified content

## 7. Implementation Strategy

### 7.1 Phased Approach

The refactoring will be implemented in phases:

1. **Phase 1: Core Structure and Layout**
   - Implement new header/navbar
   - Set up responsive grid layout
   - Create component shells

2. **Phase 2: Component Implementation**
   - Implement pipeline timeline
   - Implement recent batches
   - Implement category summary

3. **Phase 3: State Management**
   - Implement services
   - Connect components to data sources
   - Set up auto-refresh

4. **Phase 4: Upload Experience**
   - Implement enhanced file upload
   - Create batch modal
   - Integrate with existing functionality

5. **Phase 5: Testing and Refinement**
   - Cross-browser testing
   - Responsive testing
   - Performance optimization

### 7.2 Dependencies

The refactoring will require the following dependencies:

1. **PrimeNG**: UI component library
   - Version: 15.x or later
   - Components: Card, Button, Timeline, DataView, Chart, FileUpload, etc.

2. **PrimeFlex**: CSS utility library
   - Version: 3.x or later
   - Features: Grid system, flexbox utilities, spacing utilities

3. **PrimeIcons**: Icon library
   - Version: 6.x or later

4. **Chart.js**: For data visualization
   - Version: 3.x or later

### 7.3 Migration Considerations

When migrating from the existing implementation:

1. **Data Compatibility**
   - Ensure new components work with existing data structures
   - Maintain backward compatibility with APIs

2. **Route Preservation**
   - Maintain existing routes and navigation patterns
   - Ensure deep linking still works

3. **Feature Parity**
   - Ensure all existing functionality is preserved
   - Enhance UX without removing capabilities

4. **Performance**
   - Monitor bundle size
   - Implement lazy loading where appropriate
   - Optimize component rendering

## 8. Conclusion

This specification provides a comprehensive plan for refactoring the Angular dashboard using PrimeNG and PrimeFlex. The refactoring will improve the user interface, enhance user experience, and optimize the dashboard's functionality while maintaining its core features.

The modular approach to component design will make the dashboard more maintainable and extensible, while the responsive design considerations will ensure a consistent experience across all device sizes.

By following the implementation strategy outlined in this document, the refactoring can be completed in a systematic and efficient manner, with minimal disruption to existing functionality.