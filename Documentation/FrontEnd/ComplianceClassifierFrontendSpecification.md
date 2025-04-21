# Compliance Document Classifier - Angular Frontend Specification

## 1. Introduction

### 1.1 Purpose
This document provides detailed specifications for an Angular frontend with PrimeNG that integrates with the existing .NET Core API for the Compliance Document Classifier system. The frontend will provide a modern, responsive interface for users to manage, classify, and review compliance documents.

### 1.2 Scope
The frontend application will include:
- A dashboard for displaying batches of compliance documents with metadata and status
- Batch operations (create new, upload documents, append to existing)
- Document view to see classification results
- Modern, responsive design using PrimeNG components

### 1.3 System Context
The frontend will integrate with the existing .NET Core API that provides document management, classification, and reporting capabilities. The API follows a clean architecture approach with clear separation of concerns.

## 2. Functional Requirements

### 2.1 Authentication and Authorization

#### 2.1.1 User Authentication
```typescript
// Authentication Service Pseudocode
class AuthenticationService {
  // Store JWT token and user information
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  
  constructor(private http: HttpClient) {
    // Initialize from local storage if available
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  // Login method
  login(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password })
      .pipe(
        map(response => {
          // Store user details and JWT token in local storage
          const user = {
            id: response.data.userId,
            username: username,
            token: response.data.token
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }
  
  // Logout method
  logout() {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  // Get current user value
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
}
```

#### 2.1.2 JWT Interceptor
```typescript
// JWT Interceptor Pseudocode
class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authorization header with JWT token if available
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }
    
    return next.handle(request);
  }
}
```

#### 2.1.3 Auth Guard
```typescript
// Auth Guard Pseudocode
class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      // Authorized, return true
      return true;
    }
    
    // Not logged in, redirect to login page with return URL
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

### 2.2 Dashboard

#### 2.2.1 Dashboard Overview
The dashboard will provide a high-level overview of the system's status and recent activity.

```typescript
// Dashboard Component Pseudocode
class DashboardComponent implements OnInit {
  recentBatches: BatchSummary[] = [];
  documentStatistics: DocumentStatistics;
  processingStatus: ProcessingStatus;
  
  constructor(
    private batchService: BatchService,
    private documentService: DocumentService
  ) {}
  
  ngOnInit() {
    this.loadRecentBatches();
    this.loadDocumentStatistics();
    this.loadProcessingStatus();
  }
  
  loadRecentBatches() {
    this.batchService.getRecentBatches().subscribe(
      data => this.recentBatches = data
    );
  }
  
  loadDocumentStatistics() {
    this.documentService.getDocumentStatistics().subscribe(
      data => this.documentStatistics = data
    );
  }
  
  loadProcessingStatus() {
    this.batchService.getProcessingStatus().subscribe(
      data => this.processingStatus = data
    );
  }
  
  createNewBatch() {
    // Navigate to batch creation page
  }
  
  viewBatchDetails(batchId: string) {
    // Navigate to batch details page
  }
}
```

#### 2.2.2 Dashboard UI Components
- Recent Batches Card: Displays the 5 most recent batches with status indicators
- Document Statistics Card: Shows counts of documents by classification category and risk level
- Processing Status Card: Shows current processing status (documents pending, in progress)
- Quick Action Buttons: Create New Batch, View All Batches, View All Documents

### 2.3 Batch Management

#### 2.3.1 Batch List
```typescript
// Batch List Component Pseudocode
class BatchListComponent implements OnInit {
  batches: BatchDto[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  
  // Pagination and filtering
  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = 'uploadDate';
  sortOrder: number = -1; // Descending
  filterStatus: string = null;
  
  constructor(private batchService: BatchService) {}
  
  ngOnInit() {
    this.loadBatches();
  }
  
  loadBatches() {
    this.loading = true;
    this.batchService.getBatches(
      this.currentPage,
      this.pageSize,
      this.sortField,
      this.sortOrder,
      this.filterStatus
    ).subscribe(
      response => {
        this.batches = response.data.items;
        this.totalRecords = response.data.totalCount;
        this.loading = false;
      }
    );
  }
  
  onPageChange(event) {
    this.currentPage = event.page + 1;
    this.loadBatches();
  }
  
  onSortChange(event) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.loadBatches();
  }
  
  onFilterChange() {
    this.currentPage = 1;
    this.loadBatches();
  }
  
  createNewBatch() {
    // Navigate to batch creation page
  }
  
  viewBatchDetails(batchId: string) {
    // Navigate to batch details page
  }
}
```

#### 2.3.2 Create New Batch
```typescript
// Create Batch Component Pseudocode
class CreateBatchComponent {
  batchForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private batchService: BatchService,
    private router: Router
  ) {
    this.batchForm = this.formBuilder.group({
      name: ['', Validators.maxLength(100)],
      description: ['', Validators.maxLength(500)]
    });
  }
  
  onSubmit() {
    if (this.batchForm.invalid) {
      return;
    }
    
    this.batchService.createBatch(this.batchForm.value).subscribe(
      response => {
        if (response.success) {
          // Navigate to document upload page with the new batch ID
          this.router.navigate(['/batches', response.data, 'upload']);
        }
      }
    );
  }
  
  cancel() {
    this.router.navigate(['/batches']);
  }
}
```

#### 2.3.3 Batch Details
```typescript
// Batch Details Component Pseudocode
class BatchDetailsComponent implements OnInit {
  batchId: string;
  batch: BatchDto;
  documents: DocumentDto[] = [];
  loading: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private batchService: BatchService,
    private documentService: DocumentService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.batchId = this.route.snapshot.paramMap.get('id');
    this.loadBatchDetails();
    this.loadBatchDocuments();
  }
  
  loadBatchDetails() {
    this.batchService.getBatchById(this.batchId).subscribe(
      response => {
        if (response.success) {
          this.batch = response.data;
        }
      }
    );
  }
  
  loadBatchDocuments() {
    this.loading = true;
    this.documentService.getDocumentsByBatchId(this.batchId).subscribe(
      response => {
        if (response.success) {
          this.documents = response.data;
        }
        this.loading = false;
      }
    );
  }
  
  uploadMoreDocuments() {
    this.router.navigate(['/batches', this.batchId, 'upload']);
  }
  
  generateBatchReport() {
    this.batchService.generateBatchReport(this.batchId).subscribe(
      response => {
        if (response.success) {
          // Handle report generation
        }
      }
    );
  }
  
  viewDocumentDetails(documentId: string) {
    this.router.navigate(['/documents', documentId]);
  }
}

### 2.4 Document Upload

#### 2.4.1 Document Upload Component
```typescript
// Document Upload Component Pseudocode
class DocumentUploadComponent implements OnInit {
  batchId: string;
  batch: BatchDto;
  uploadedFiles: File[] = [];
  uploadProgress: number = 0;
  uploading: boolean = false;
  
  // Accepted file types
  acceptedFileTypes: string[] = ['.pdf', '.docx', '.txt'];
  maxFileSize: number = 10 * 1024 * 1024; // 10MB
  maxFiles: number = 50;
  
  constructor(
    private route: ActivatedRoute,
    private batchService: BatchService,
    private documentService: DocumentService,
    private router: Router,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.batchId = this.route.snapshot.paramMap.get('id');
    this.loadBatchDetails();
  }
  
  loadBatchDetails() {
    this.batchService.getBatchById(this.batchId).subscribe(
      response => {
        if (response.success) {
          this.batch = response.data;
        }
      }
    );
  }
  
  onFileSelect(event) {
    for (let file of event.files) {
      if (this.validateFile(file)) {
        this.uploadedFiles.push(file);
      }
    }
  }
  
  onFileDrop(event) {
    for (let file of event.files) {
      if (this.validateFile(file)) {
        this.uploadedFiles.push(file);
      }
    }
  }
  
  validateFile(file: File): boolean {
    const fileName = file.name.toLowerCase();
    const validExtension = this.acceptedFileTypes.some(ext => 
      fileName.endsWith(ext)
    );
    
    const validSize = file.size <= this.maxFileSize;
    
    if (!validExtension) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: `Only ${this.acceptedFileTypes.join(', ')} files are supported`
      });
    }
    
    if (!validSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: `Maximum file size is ${this.maxFileSize / (1024 * 1024)}MB`
      });
    }
    
    return validExtension && validSize;
  }
  
  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }
  
  uploadFiles() {
    if (this.uploadedFiles.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Files',
        detail: 'Please select files to upload'
      });
      return;
    }
    
    if (this.uploadedFiles.length > this.maxFiles) {
      this.messageService.add({
        severity: 'error',
        summary: 'Too Many Files',
        detail: `Maximum ${this.maxFiles} files can be uploaded at once`
      });
      return;
    }
    
    this.uploading = true;
    
    const formData = new FormData();
    for (let file of this.uploadedFiles) {
      formData.append('files', file, file.name);
    }
    
    this.documentService.uploadDocuments(this.batchId, formData).subscribe(
      response => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Upload Complete',
            detail: `${this.uploadedFiles.length} files uploaded successfully`
          });
          
          // Navigate to batch details or provide options
          this.uploading = false;
          this.uploadedFiles = [];
        }
      },
      error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: error.message
        });
        this.uploading = false;
      },
      () => {
        this.uploading = false;
      }
    );
  }
  
  cancel() {
    this.router.navigate(['/batches', this.batchId]);
  }
}
```

### 2.5 Document Classification View

#### 2.5.1 Document Details Component
```typescript
// Document Details Component Pseudocode
class DocumentDetailsComponent implements OnInit {
  documentId: string;
  document: DocumentDto;
  classification: ClassificationDto;
  loading: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private classificationService: ClassificationService,
    private router: Router,
    private dialog: DialogService
  ) {}
  
  ngOnInit() {
    this.documentId = this.route.snapshot.paramMap.get('id');
    this.loadDocumentDetails();
    this.loadClassification();
  }
  
  loadDocumentDetails() {
    this.documentService.getDocumentById(this.documentId).subscribe(
      response => {
        if (response.success) {
          this.document = response.data;
        }
      }
    );
  }
  
  loadClassification() {
    this.loading = true;
    this.classificationService.getClassificationByDocumentId(this.documentId).subscribe(
      response => {
        if (response.success) {
          this.classification = response.data;
        }
        this.loading = false;
      }
    );
  }
  
  overrideClassification() {
    const ref = this.dialog.open(ClassificationOverrideComponent, {
      data: {
        documentId: this.documentId,
        classification: this.classification
      },
      header: 'Override Classification',
      width: '500px'
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadClassification();
      }
    });
  }
  
  generateReport() {
    this.documentService.generateDocumentReport(this.documentId).subscribe(
      response => {
        if (response.success) {
          // Handle report generation
        }
      }
    );
  }
  
  downloadDocument() {
    this.documentService.downloadDocument(this.documentId);
  }
  
  goBack() {
    this.router.navigate(['/batches', this.document.batchId]);
  }
}
```

#### 2.5.2 Classification Override Component
```typescript
// Classification Override Component Pseudocode
class ClassificationOverrideComponent {
  overrideForm: FormGroup;
  documentId: string;
  classification: ClassificationDto;
  
  // Category options
  categories: string[] = [
    'DataPrivacy',
    'FinancialReporting',
    'WorkplaceConduct',
    'HealthCompliance',
    'Other'
  ];
  
  // Risk level options
  riskLevels: string[] = [
    'Low',
    'Medium',
    'High'
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private classificationService: ClassificationService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.documentId = config.data.documentId;
    this.classification = config.data.classification;
    
    this.overrideForm = this.formBuilder.group({
      category: [this.classification.category, Validators.required],
      riskLevel: [this.classification.riskLevel, Validators.required],
      summary: [this.classification.summary, [Validators.required, Validators.maxLength(1000)]]
    });
  }
  
  onSubmit() {
    if (this.overrideForm.invalid) {
      return;
    }
    
    const overrideData: ClassificationOverrideDto = {
      category: this.overrideForm.value.category,
      riskLevel: this.overrideForm.value.riskLevel,
      summary: this.overrideForm.value.summary
    };
    
    this.classificationService.overrideClassification(
      this.classification.classificationId,
      overrideData
    ).subscribe(
      response => {
        if (response.success) {
          this.ref.close(true);
        }
      }
    );
  }
  
  cancel() {
    this.ref.close(false);
  }
}

### 2.6 Report Generation and Viewing

#### 2.6.1 Report Generation Service
```typescript
// Report Service Pseudocode
class ReportService {
  constructor(private http: HttpClient) {}
  
  generateDocumentReport(documentId: string): Observable<ApiResponse<ReportDto>> {
    return this.http.post<ApiResponse<ReportDto>>(`/api/report/document/${documentId}`, {});
  }
  
  generateBatchReport(batchId: string): Observable<ApiResponse<ReportDto>> {
    return this.http.post<ApiResponse<ReportDto>>(`/api/report/batch/${batchId}`, {});
  }
  
  getReportById(reportId: string): Observable<ApiResponse<ReportDto>> {
    return this.http.get<ApiResponse<ReportDto>>(`/api/report/${reportId}`);
  }
  
  downloadReport(reportId: string) {
    window.open(`/api/report/${reportId}/download`, '_blank');
  }
  
  shareReportByEmail(reportId: string, email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`/api/report/${reportId}/share`, { email });
  }
}
```

#### 2.6.2 Report Viewer Component
```typescript
// Report Viewer Component Pseudocode
class ReportViewerComponent implements OnInit {
  reportId: string;
  report: ReportDto;
  loading: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private router: Router,
    private dialog: DialogService
  ) {}
  
  ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('id');
    this.loadReport();
  }
  
  loadReport() {
    this.loading = true;
    this.reportService.getReportById(this.reportId).subscribe(
      response => {
        if (response.success) {
          this.report = response.data;
        }
        this.loading = false;
      }
    );
  }
  
  downloadReport() {
    this.reportService.downloadReport(this.reportId);
  }
  
  shareReport() {
    const ref = this.dialog.open(ShareReportComponent, {
      data: {
        reportId: this.reportId
      },
      header: 'Share Report',
      width: '400px'
    });
  }
  
  goBack() {
    // Navigate back based on report type
    if (this.report.batchId) {
      this.router.navigate(['/batches', this.report.batchId]);
    } else if (this.report.documentId) {
      this.router.navigate(['/documents', this.report.documentId]);
    } else {
      this.router.navigate(['/reports']);
    }
  }
}
```

### 2.7 Search and Filtering

#### 2.7.1 Document Search Component
```typescript
// Document Search Component Pseudocode
class DocumentSearchComponent implements OnInit {
  documents: DocumentDto[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  
  // Search and filtering
  searchTerm: string = '';
  dateRange: Date[] = [];
  selectedFileTypes: string[] = [];
  selectedCategories: string[] = [];
  selectedRiskLevels: string[] = [];
  selectedStatus: string = '';
  
  // Pagination and sorting
  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = 'uploadDate';
  sortOrder: number = -1; // Descending
  
  // Options for filters
  fileTypes: string[] = ['PDF', 'DOCX', 'TXT'];
  categories: string[] = ['DataPrivacy', 'FinancialReporting', 'WorkplaceConduct', 'HealthCompliance', 'Other'];
  riskLevels: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['Pending', 'Processing', 'Classified', 'Error'];
  
  constructor(private documentService: DocumentService) {}
  
  ngOnInit() {
    this.searchDocuments();
  }
  
  searchDocuments() {
    this.loading = true;
    
    const filters = {
      searchTerm: this.searchTerm,
      startDate: this.dateRange[0],
      endDate: this.dateRange[1],
      fileTypes: this.selectedFileTypes,
      categories: this.selectedCategories,
      riskLevels: this.selectedRiskLevels,
      status: this.selectedStatus
    };
    
    this.documentService.searchDocuments(
      filters,
      this.currentPage,
      this.pageSize,
      this.sortField,
      this.sortOrder
    ).subscribe(
      response => {
        if (response.success) {
          this.documents = response.data.items;
          this.totalRecords = response.data.totalCount;
        }
        this.loading = false;
      }
    );
  }
  
  onSearch() {
    this.currentPage = 1;
    this.searchDocuments();
  }
  
  onPageChange(event) {
    this.currentPage = event.page + 1;
    this.searchDocuments();
  }
  
  onSortChange(event) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.searchDocuments();
  }
  
  clearFilters() {
    this.searchTerm = '';
    this.dateRange = [];
    this.selectedFileTypes = [];
    this.selectedCategories = [];
    this.selectedRiskLevels = [];
    this.selectedStatus = '';
    this.onSearch();
  }
  
  viewDocumentDetails(documentId: string) {
    // Navigate to document details
  }
}
```

## 3. Data Models and Interfaces

### 3.1 Core Data Models

#### 3.1.1 User Model
```typescript
interface User {
  id: string;
  username: string;
  token: string;
}
```

#### 3.1.2 Batch Model
```typescript
interface BatchDto {
  batchId: string;
  uploadDate: Date;
  userId: string;
  status: string; // 'Pending', 'Processing', 'Completed', 'Error'
  totalDocuments: number;
  processedDocuments: number;
  completionDate?: Date;
}

interface BatchSummary {
  batchId: string;
  uploadDate: Date;
  status: string;
  totalDocuments: number;
  processedDocuments: number;
}
```

#### 3.1.3 Document Model
```typescript
interface DocumentDto {
  documentId: string;
  fileName: string;
  fileType: string; // 'PDF', 'DOCX', 'TXT'
  fileSize: number;
  uploadDate: Date;
  content?: string;
  status: string; // 'Pending', 'Processing', 'Classified', 'Error'
  batchId: string;
  metadata?: DocumentMetadataDto;
}

interface DocumentMetadataDto {
  pageCount: number;
  author: string;
  creationDate: Date;
  modificationDate: Date;
  keywords: string[];
  additionalProperties?: { [key: string]: any };
}
```

#### 3.1.4 Classification Model
```typescript
interface ClassificationDto {
  classificationId: string;
  documentId: string;
  category: string;
  riskLevel: string; // 'Low', 'Medium', 'High'
  summary: string;
  classificationDate: Date;
  classifiedBy: string;
  confidenceScore: number;
  isOverridden: boolean;
}

interface ClassificationOverrideDto {
  category: string;
  riskLevel: string;
  summary: string;
}

#### 3.1.5 Report Model
```typescript
interface ReportDto {
  reportId: string;
  batchId?: string;
  documentId?: string;
  generationDate: Date;
  reportType: string; // 'SingleDocument', 'BatchSummary'
  filePath: string;
}
```

### 3.2 API Response Models

#### 3.2.1 API Response
```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: string[];
}
```

#### 3.2.2 Paginated Response
```typescript
interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

#### 3.2.3 Auth Response
```typescript
interface AuthResponse {
  data: {
    userId: string;
    token: string;
    expiresAt: Date;
  };
  success: boolean;
  message: string;
}
```

### 3.3 Statistics Models

#### 3.3.1 Document Statistics
```typescript
interface DocumentStatistics {
  totalDocuments: number;
  documentsByCategory: {
    category: string;
    count: number;
  }[];
  documentsByRiskLevel: {
    riskLevel: string;
    count: number;
  }[];
}
```

#### 3.3.2 Processing Status
```typescript
interface ProcessingStatus {
  pendingDocuments: number;
  processingDocuments: number;
  classifiedDocuments: number;
  errorDocuments: number;
}
```

## 4. API Integration Points

### 4.1 Authentication API
- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`
- **Refresh Token**: `POST /api/auth/refresh`

### 4.2 Batch API
- **Get All Batches**: `GET /api/batch`
- **Get Batch by ID**: `GET /api/batch/{batchId}`
- **Create Batch**: `POST /api/document/batch`
- **Get Batch Status**: `GET /api/batch/{batchId}/status`

### 4.3 Document API
- **Upload Documents**: `POST /api/document/batch/{batchId}/upload`
- **Get Document by ID**: `GET /api/document/{id}`
- **Get Documents in Batch**: `GET /api/document/batch/{batchId}`
- **Search Documents**: `GET /api/document/search`
- **Download Document**: `GET /api/document/{id}/download`

### 4.4 Classification API
- **Get Classification**: `GET /api/classification/{documentId}`
- **Override Classification**: `PUT /api/classification/{classificationId}/override`
- **Get Batch Classifications**: `GET /api/classification/batch/{batchId}`

### 4.5 Report API
- **Generate Document Report**: `POST /api/report/document/{documentId}`
- **Generate Batch Report**: `POST /api/report/batch/{batchId}`
- **Get Report**: `GET /api/report/{reportId}`
- **Download Report**: `GET /api/report/{reportId}/download`
- **Share Report**: `POST /api/report/{reportId}/share`

### 4.6 Statistics API
- **Get Document Statistics**: `GET /api/statistics/documents`
- **Get Processing Status**: `GET /api/statistics/processing`

## 5. Component Structure

### 5.1 Core Components
- **AppComponent**: Root component
- **HeaderComponent**: Top navigation bar
- **SidebarComponent**: Side navigation menu
- **FooterComponent**: Page footer
- **LoginComponent**: User login form
- **DashboardComponent**: Main dashboard

### 5.2 Batch Components
- **BatchListComponent**: List of all batches
- **BatchDetailsComponent**: Details of a specific batch
- **CreateBatchComponent**: Form to create a new batch

### 5.3 Document Components
- **DocumentUploadComponent**: File upload interface
- **DocumentListComponent**: List of documents
- **DocumentDetailsComponent**: Details of a specific document
- **DocumentSearchComponent**: Search interface for documents

### 5.4 Classification Components
- **ClassificationViewComponent**: View classification details
- **ClassificationOverrideComponent**: Form to override classification

### 5.5 Report Components
- **ReportViewerComponent**: View generated reports
- **ShareReportComponent**: Form to share reports via email

### 5.6 Shared Components
- **LoadingSpinnerComponent**: Loading indicator
- **ErrorMessageComponent**: Error display
- **ConfirmDialogComponent**: Confirmation dialog
- **FileUploadComponent**: Reusable file upload component
- **PaginatorComponent**: Reusable paginator

## 6. User Flows

### 6.1 Authentication Flow
```
1. User navigates to the application
2. System redirects to login page if not authenticated
3. User enters credentials and submits
4. System validates credentials
   a. If valid, redirects to dashboard
   b. If invalid, displays error message
5. User can log out from any page
```

### 6.2 Batch Creation and Document Upload Flow
```
1. User clicks "Create New Batch" from dashboard or batch list
2. System displays batch creation form
3. User enters optional batch name and description
4. System creates batch and redirects to document upload page
5. User selects files or drags and drops files to upload
6. User clicks "Upload" button
7. System uploads files and processes them
8. System displays upload status and results
9. User can navigate to batch details or upload more documents
```

### 6.3 Document Classification Review Flow
```
1. User navigates to batch details page
2. User selects a document from the list
3. System displays document details and classification
4. User reviews classification results
5. If user disagrees with classification:
   a. User clicks "Override" button
   b. System displays override form
   c. User selects new category, risk level, and updates summary
   d. User submits override
   e. System updates classification and marks as overridden
6. User can generate a report or download the document
```

### 6.4 Report Generation Flow
```
1. User navigates to document details or batch details
2. User clicks "Generate Report" button
3. System initiates report generation
4. System redirects to report viewer when ready
5. User can view, download, or share the report
```

### 6.5 Document Search Flow
```
1. User navigates to document search page
2. User enters search criteria (text, date range, file type, etc.)
3. User clicks "Search" button
4. System displays matching documents
5. User can sort, filter, or paginate results
6. User can select a document to view details
```

## 7. PrimeNG Component Usage

### 7.1 Layout Components
- **p-card**: For dashboard cards and content containers
- **p-panel**: For collapsible sections
- **p-tabView**: For tabbed interfaces
- **p-divider**: For section separation
- **p-splitter**: For resizable split views

### 7.2 Data Components
- **p-table**: For displaying batch and document lists with sorting, filtering, and pagination
- **p-dataView**: For grid/list views of documents
- **p-tree**: For hierarchical data display
- **p-chart**: For statistics visualization

### 7.3 Form Components
- **p-calendar**: For date selection
- **p-dropdown**: For selection inputs
- **p-multiSelect**: For multi-selection filters
- **p-inputText**: For text inputs
- **p-inputTextarea**: For text area inputs
- **p-checkbox**: For boolean inputs
- **p-radioButton**: For single selection options
- **p-rating**: For risk level visualization

### 7.4 Button Components
- **p-button**: For action buttons
- **p-splitButton**: For primary action with dropdown options
- **p-toggleButton**: For toggle actions

### 7.5 Overlay Components
- **p-dialog**: For modal dialogs
- **p-confirmDialog**: For confirmation prompts
- **p-toast**: For notifications
- **p-tooltip**: For additional information

### 7.6 File Components
- **p-fileUpload**: For document upload with drag and drop support

### 7.7 Menu Components
- **p-menubar**: For main navigation
- **p-menu**: For context menus
- **p-breadcrumb**: For navigation breadcrumbs

## 8. Responsive Design Considerations

### 8.1 Breakpoints
- **Extra Small**: < 576px (Mobile phones)
- **Small**: 576px - 768px (Large phones, small tablets)
- **Medium**: 768px - 992px (Tablets)
- **Large**: 992px - 1200px (Desktops)
- **Extra Large**: > 1200px (Large desktops)

### 8.2 Layout Adaptations
- Use fluid containers and responsive grids
- Stack elements vertically on smaller screens
- Hide secondary information on smaller screens
- Provide collapsible menus for navigation on mobile
- Ensure touch-friendly UI elements for mobile devices

### 8.3 Responsive Tables
- Horizontal scrolling for tables on small screens
- Priority columns that remain visible
- Collapsible rows for detailed information

### 8.4 Responsive Forms
- Single column forms on mobile
- Full-width inputs on small screens
- Simplified validation messages

## 9. Extensibility Considerations

### 9.1 Adding New Document Types
- Update file type validation in DocumentUploadComponent
- Update file type filters in DocumentSearchComponent
- Ensure UI can handle new document type icons and previews

### 9.2 Adding New Classification Categories
- Update category options in ClassificationOverrideComponent
- Update category filters in DocumentSearchComponent
- Update category visualization in dashboard statistics

### 9.3 Custom Themes
- Implement theme switching capability
- Support for light and dark modes
- Allow for organization-specific branding

## 10. Testing Strategy

### 10.1 Unit Tests
- Test individual components in isolation
- Test services and data transformations
- Test form validation logic

### 10.2 Integration Tests
- Test component interactions
- Test API service integration
- Test authentication flow

### 10.3 End-to-End Tests
- Test complete user flows
- Test responsive behavior
- Test browser compatibility

## 11. Deployment Considerations

### 11.1 Build Configuration
- Production build with AOT compilation
- Minification and bundling
- Environment-specific configuration

### 11.2 API Configuration
- Environment-specific API endpoints
- Proper CORS configuration
- API versioning support

### 11.3 Authentication Configuration
- JWT token handling
- Token refresh mechanism
- Secure storage of credentials

## 12. Conclusion

This specification provides a comprehensive guide for implementing an Angular frontend with PrimeNG that integrates with the existing .NET Core API for compliance document classification. The frontend will provide a modern, responsive interface for users to manage, classify, and review compliance documents, with a focus on usability, performance, and extensibility.
