# UI Architecture - Compliance Document Classifier

## Component Hierarchy and Purpose

The Compliance Document Classifier frontend follows a hierarchical component structure that promotes reusability, maintainability, and separation of concerns.

### Root Component

```
AppComponent
├── HeaderComponent
├── SidebarComponent
├── Router Outlet (Dynamic Content)
└── FooterComponent
```

- **AppComponent**: The root component that serves as the application shell. It includes the header, sidebar, main content area (router outlet), and footer.

### Feature Components

The application is organized into feature modules, each containing components related to specific functionality:

```
Features
├── Dashboard
│   └── DashboardComponent
├── Batch
│   ├── BatchListComponent
│   ├── BatchDetailsComponent
│   └── CreateBatchComponent
├── Document
│   ├── DocumentUploadComponent
│   ├── DocumentListComponent
│   ├── DocumentDetailsComponent
│   └── DocumentSearchComponent
├── Classification
│   ├── ClassificationViewComponent
│   └── ClassificationOverrideComponent
└── Report
    ├── ReportViewerComponent
    └── ShareReportComponent
```

#### Dashboard Components

- **DashboardComponent**: Provides an overview of the system's status, including recent batches, document statistics, and processing status. It serves as the landing page after login.

#### Batch Components

- **BatchListComponent**: Displays a paginated, sortable, and filterable list of all batches.
- **BatchDetailsComponent**: Shows detailed information about a specific batch, including its documents and status.
- **CreateBatchComponent**: Provides a form for creating a new batch.

#### Document Components

- **DocumentUploadComponent**: Handles file selection and uploading to a specific batch.
- **DocumentListComponent**: Displays documents within a batch or search results.
- **DocumentDetailsComponent**: Shows detailed information about a specific document, including its classification.
- **DocumentSearchComponent**: Provides advanced search functionality for documents.

#### Classification Components

- **ClassificationViewComponent**: Displays classification details for a document.
- **ClassificationOverrideComponent**: Allows users to override automatic classifications.

#### Report Components

- **ReportViewerComponent**: Displays generated reports.
- **ShareReportComponent**: Provides functionality to share reports via email.

### Shared Components

```
Shared
├── LoadingSpinnerComponent
├── ErrorMessageComponent
├── ConfirmDialogComponent
├── FileUploadComponent
└── PaginatorComponent
```

- **LoadingSpinnerComponent**: Displays a loading indicator during asynchronous operations.
- **ErrorMessageComponent**: Displays error messages in a consistent format.
- **ConfirmDialogComponent**: Provides a reusable confirmation dialog.
- **FileUploadComponent**: Reusable component for file uploads with drag-and-drop support.
- **PaginatorComponent**: Reusable pagination component.

### Layout Components

```
Layout
├── HeaderComponent
├── SidebarComponent
└── FooterComponent
```

- **HeaderComponent**: Contains the application header with navigation, user profile, and global actions.
- **SidebarComponent**: Provides navigation to different sections of the application.
- **FooterComponent**: Contains copyright information and additional links.

## Routing Strategy

The application uses Angular's lazy-loaded routing to improve initial load time and performance. Each feature module has its own routing configuration, which is loaded only when needed.

### Root Routes

```typescript
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'batches',
    loadChildren: () => import('./features/batch/batch.module').then(m => m.BatchModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./features/document/document.module').then(m => m.DocumentModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/report/report.module').then(m => m.ReportModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
```

### Feature Routes

Each feature module defines its own routes. For example, the Batch module routes:

```typescript
const routes: Routes = [
  {
    path: '',
    component: BatchListComponent
  },
  {
    path: 'create',
    component: CreateBatchComponent
  },
  {
    path: ':id',
    component: BatchDetailsComponent
  },
  {
    path: ':id/upload',
    component: DocumentUploadComponent
  }
];
```

### Route Guards

The application uses Angular route guards to protect routes that require authentication:

- **AuthGuard**: Ensures that users are authenticated before accessing protected routes.
- **PendingChangesGuard**: Prevents users from navigating away from forms with unsaved changes.

## State Management Approach

The application uses a combination of Angular services and RxJS for state management:

### Service-Based State Management

- **Services**: Each feature has corresponding services that manage data fetching, caching, and manipulation.
- **BehaviorSubject**: Services use RxJS BehaviorSubject to maintain and share state across components.
- **Observable Pattern**: Components subscribe to observables exposed by services to react to state changes.

### Authentication State

The AuthenticationService manages user authentication state:

```typescript
class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  // Methods for login, logout, etc.
}
```

### HTTP Interceptors

- **JwtInterceptor**: Adds authentication tokens to outgoing requests.
- **ErrorInterceptor**: Handles HTTP errors globally, including authentication failures.

## Module Organization

The application is organized into modules that encapsulate related functionality:

### Core Module

The CoreModule contains singleton services and components that are loaded once when the application starts:

- Authentication services
- HTTP interceptors
- Global error handling
- Application initialization logic

### Shared Module

The SharedModule contains reusable components, directives, and pipes that are used across multiple feature modules:

```typescript
@NgModule({
  declarations: [
    // Shared components, directives, and pipes
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG modules
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG modules
    // Shared components, directives, and pipes
  ]
})
export class SharedModule { }
```

### Feature Modules

Each feature has its own module that encapsulates related components, services, and routes:

- **DashboardModule**: Dashboard components and services
- **BatchModule**: Batch management components and services
- **DocumentModule**: Document management components and services
- **ReportModule**: Report generation and viewing components and services

### Layout Module

The LayoutModule contains components related to the application's layout:

```typescript
@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
```

## Dependency Injection

The application uses Angular's hierarchical dependency injection system:

- **Root-level providers**: Services that should be singletons throughout the application.
- **Feature-level providers**: Services that are specific to a feature module.
- **Component-level providers**: Services that are specific to a component and its children.

## Conclusion

The UI architecture of the Compliance Document Classifier frontend is designed to be modular, maintainable, and scalable. By following Angular best practices and leveraging PrimeNG components, the application provides a robust and user-friendly interface for managing compliance documents.