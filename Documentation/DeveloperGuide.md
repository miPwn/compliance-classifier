# Developer Guide - Compliance Document Classifier Frontend

This guide provides technical details for developers working on the Angular PrimeNG frontend for the Compliance Document Classifier system. It covers project setup, development workflow, build and deployment processes, API integration, testing strategies, and security considerations.

## Project Setup

### Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: Version 16.x or later
- **npm**: Version 8.x or later
- **Angular CLI**: Version 15.x or later
- **Git**: For version control

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-organization/compliance-classifier.git
   cd compliance-classifier/compliance-classifier-frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create environment files for different deployment environments:

   ```bash
   # src/environments/environment.ts (Development)
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api',
     authUrl: 'http://localhost:5000/api/auth'
   };

   # src/environments/environment.prod.ts (Production)
   export const environment = {
     production: true,
     apiUrl: 'https://api.compliance-classifier.yourcompany.com/api',
     authUrl: 'https://api.compliance-classifier.yourcompany.com/api/auth'
   };
   ```

4. **Start the Development Server**

   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200`.

5. **Start the Backend API**

   In a separate terminal, start the .NET Core API:

   ```bash
   cd ../ComplianceClassifier.API
   dotnet run --urls="http://localhost:5000"
   ```

## Project Structure

The frontend project follows a modular structure organized by features:

```
compliance-classifier-frontend/
├── src/
│   ├── app/
│   │   ├── core/                 # Core functionality (auth, guards, interceptors)
│   │   ├── features/             # Feature modules
│   │   │   ├── dashboard/        # Dashboard feature
│   │   │   ├── batch/            # Batch management feature
│   │   │   ├── document/         # Document management feature
│   │   │   └── report/           # Report generation feature
│   │   ├── layout/               # Layout components (header, sidebar, footer)
│   │   ├── shared/               # Shared components, directives, pipes
│   │   ├── app.component.ts      # Root component
│   │   ├── app.routes.ts         # Root routing
│   │   └── app.module.ts         # Root module
│   ├── assets/                   # Static assets (images, icons)
│   ├── environments/             # Environment configurations
│   └── styles/                   # Global styles
├── angular.json                  # Angular CLI configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

### Feature Module Structure

Each feature module follows a consistent structure:

```
feature/
├── components/                   # Feature components
│   ├── component-name/           # Specific component
│   │   ├── component-name.component.ts
│   │   ├── component-name.component.html
│   │   └── component-name.component.scss
├── services/                     # Feature-specific services
├── models/                       # Feature-specific models
├── feature.module.ts             # Feature module definition
└── feature-routing.module.ts     # Feature routing
```

## Development Workflow

### Branching Strategy

We follow a Git Flow branching strategy:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/feature-name**: Feature development
- **bugfix/bug-name**: Bug fixes
- **release/version**: Release preparation
- **hotfix/fix-name**: Production hotfixes

### Development Process

1. **Create a Feature Branch**

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/feature-name
   ```

2. **Implement the Feature**

   - Follow the Angular style guide
   - Use PrimeNG components as outlined in the Style Guide
   - Ensure responsive design
   - Write unit tests

3. **Run Tests**

   ```bash
   ng test
   ```

4. **Submit a Pull Request**

   - Create a pull request to the `develop` branch
   - Include a description of the changes
   - Reference any related issues
   - Ensure CI checks pass

5. **Code Review**

   - Address review comments
   - Make necessary changes
   - Request re-review if needed

6. **Merge to Develop**

   Once approved, the PR will be merged to the `develop` branch.

### Coding Standards

- Follow the [Angular Style Guide](https://angular.io/guide/styleguide)
- Use TypeScript features (strong typing, interfaces)
- Follow the project's Style Guide for UI components
- Write self-documenting code with clear naming
- Add comments for complex logic

## Build and Deployment Process

### Build Process

1. **Development Build**

   ```bash
   ng build
   ```

2. **Production Build**

   ```bash
   ng build --configuration production
   ```

   This creates optimized files in the `dist/` directory.

### Continuous Integration

We use GitHub Actions for CI/CD:

1. **Pull Request Checks**
   - Linting
   - Unit tests
   - Build verification

2. **Deployment Pipeline**
   - Build the application
   - Run tests
   - Deploy to the appropriate environment

### Deployment Environments

- **Development**: Automatic deployment from the `develop` branch
- **Staging**: Deployment from `release/*` branches
- **Production**: Deployment from the `main` branch

### Deployment Configuration

For each environment, update the appropriate environment file:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.compliance-classifier.yourcompany.com/api',
  authUrl: 'https://api.compliance-classifier.yourcompany.com/api/auth'
};
```

## API Integration

### API Service Structure

The frontend communicates with the backend API through Angular services:

```typescript
// src/app/features/batch/services/batch.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, BatchDto, PaginatedResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private apiUrl = `${environment.apiUrl}/batch`;

  constructor(private http: HttpClient) {}

  getBatches(
    page: number,
    pageSize: number,
    sortField: string,
    sortOrder: number,
    status?: string
  ): Observable<ApiResponse<PaginatedResponse<BatchDto>>> {
    let url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<ApiResponse<PaginatedResponse<BatchDto>>>(url);
  }

  getBatchById(batchId: string): Observable<ApiResponse<BatchDto>> {
    return this.http.get<ApiResponse<BatchDto>>(`${this.apiUrl}/${batchId}`);
  }

  createBatch(batch: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${environment.apiUrl}/document/batch`, batch);
  }

  // Other methods...
}
```

### HTTP Interceptors

The application uses HTTP interceptors for common request/response handling:

1. **JWT Interceptor**: Adds authentication tokens to requests

   ```typescript
   // src/app/core/interceptors/jwt.interceptor.ts
   @Injectable()
   export class JwtInterceptor implements HttpInterceptor {
     constructor(private authService: AuthenticationService) {}
     
     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       const currentUser = this.authService.currentUserValue;
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

2. **Error Interceptor**: Handles HTTP errors globally

   ```typescript
   // src/app/core/interceptors/error.interceptor.ts
   @Injectable()
   export class ErrorInterceptor implements HttpInterceptor {
     constructor(private authService: AuthenticationService) {}
     
     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.handle(request).pipe(
         catchError(err => {
           if (err.status === 401) {
             // Auto logout if 401 response returned from API
             this.authService.logout();
             location.reload();
           }
           
           const error = err.error?.message || err.statusText;
           return throwError(() => error);
         })
       );
     }
   }
   ```

### API Response Handling

The application uses consistent response models:

```typescript
// src/app/shared/models/api-response.model.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: string[];
}

// src/app/shared/models/paginated-response.model.ts
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### API Endpoints

The frontend integrates with the following API endpoints:

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Authentication | `/api/auth/login` | POST | User login |
| Authentication | `/api/auth/logout` | POST | User logout |
| Batch | `/api/batch` | GET | Get all batches |
| Batch | `/api/batch/{batchId}` | GET | Get batch by ID |
| Batch | `/api/document/batch` | POST | Create batch |
| Document | `/api/document/batch/{batchId}/upload` | POST | Upload documents |
| Document | `/api/document/{id}` | GET | Get document by ID |
| Document | `/api/document/batch/{batchId}` | GET | Get documents in batch |
| Document | `/api/document/search` | GET | Search documents |
| Classification | `/api/classification/{documentId}` | GET | Get classification |
| Classification | `/api/classification/{classificationId}/override` | PUT | Override classification |
| Report | `/api/report/document/{documentId}` | POST | Generate document report |
| Report | `/api/report/batch/{batchId}` | POST | Generate batch report |
| Statistics | `/api/statistics/documents` | GET | Get document statistics |
| Statistics | `/api/statistics/processing` | GET | Get processing status |

## Testing Strategy

### Unit Testing

Unit tests focus on testing individual components and services in isolation:

```typescript
// src/app/features/batch/services/batch.service.spec.ts
describe('BatchService', () => {
  let service: BatchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BatchService]
    });
    
    service = TestBed.inject(BatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve batches', () => {
    const mockResponse: ApiResponse<PaginatedResponse<BatchDto>> = {
      success: true,
      message: 'Batches retrieved successfully',
      data: {
        items: [
          { batchId: '1', uploadDate: new Date(), status: 'Completed', totalDocuments: 10, processedDocuments: 10 }
        ],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      }
    };

    service.getBatches(1, 10, 'uploadDate', -1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/batch?page=1&pageSize=10&sortField=uploadDate&sortOrder=-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
```

### Component Testing

Component tests verify the component's behavior and rendering:

```typescript
// src/app/features/dashboard/components/dashboard.component.spec.ts
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create batch page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.createNewBatch();
    expect(navigateSpy).toHaveBeenCalledWith(['/batches/create']);
  });
});
```

### Integration Testing

Integration tests verify the interaction between components and services:

```typescript
// src/app/features/batch/components/batch-list/batch-list.component.spec.ts
describe('BatchListComponent', () => {
  let component: BatchListComponent;
  let fixture: ComponentFixture<BatchListComponent>;
  let batchService: BatchService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchListComponent],
      imports: [RouterTestingModule, SharedModule, HttpClientTestingModule],
      providers: [BatchService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchListComponent);
    component = fixture.componentInstance;
    batchService = TestBed.inject(BatchService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should load batches on init', () => {
    const getBatchesSpy = spyOn(batchService, 'getBatches').and.returnValue(of({
      success: true,
      message: 'Batches retrieved successfully',
      data: {
        items: [
          { batchId: '1', uploadDate: new Date(), status: 'Completed', totalDocuments: 10, processedDocuments: 10 }
        ],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      }
    }));

    component.ngOnInit();
    
    expect(getBatchesSpy).toHaveBeenCalled();
    expect(component.batches.length).toBe(1);
  });
});
```

### End-to-End Testing

End-to-end tests verify complete user flows using Cypress:

```javascript
// cypress/e2e/batch-creation.cy.ts
describe('Batch Creation', () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept('POST', '/api/auth/login', { success: true, data: { token: 'fake-token' } });
    cy.visit('/login');
    cy.get('input[name=username]').type('testuser');
    cy.get('input[name=password]').type('password');
    cy.get('button[type=submit]').click();
  });

  it('should create a new batch', () => {
    // Mock batch creation response
    cy.intercept('POST', '/api/document/batch', {
      success: true,
      message: 'Batch created successfully',
      data: 'new-batch-id'
    });

    // Navigate to create batch page
    cy.visit('/batches/create');
    
    // Fill the form
    cy.get('input[name=name]').type('Test Batch');
    cy.get('textarea[name=description]').type('This is a test batch');
    
    // Submit the form
    cy.get('button[type=submit]').click();
    
    // Verify navigation to upload page
    cy.url().should('include', '/batches/new-batch-id/upload');
  });
});
```

### Running Tests

- **Unit and Integration Tests**:
  ```bash
  ng test
  ```

- **End-to-End Tests**:
  ```bash
  ng e2e
  ```

## Security Considerations

### Authentication and Authorization

1. **JWT Authentication**:
   - Tokens are stored in browser localStorage
   - Tokens are included in HTTP requests via the JWT Interceptor
   - Token expiration is handled with auto-logout

2. **Route Guards**:
   - AuthGuard protects routes that require authentication
   - RoleGuard can be implemented for role-based access control

### CSRF Protection

1. **Anti-Forgery Tokens**:
   - The API uses anti-forgery tokens for protection against CSRF attacks
   - The frontend includes these tokens in requests

### XSS Prevention

1. **Content Security Policy**:
   - Implement a strict Content Security Policy
   - Avoid using `innerHTML` or `bypassSecurityTrustHtml`

2. **Input Sanitization**:
   - Use Angular's built-in sanitization for user inputs
   - Validate inputs on both client and server sides

### Secure Communication

1. **HTTPS**:
   - All API communication must use HTTPS
   - Enforce HTTPS in production environments

2. **Sensitive Data**:
   - Never log sensitive information
   - Mask sensitive data in the UI

### Secure Coding Practices

1. **Dependency Management**:
   - Regularly update dependencies
   - Use `npm audit` to check for vulnerabilities

2. **Error Handling**:
   - Implement global error handling
   - Don't expose sensitive information in error messages

3. **File Upload Security**:
   - Validate file types and sizes
   - Scan uploaded files for malware (server-side)

### Security Headers

Implement security headers in the API responses:

- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

## Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Verify the API is running
   - Check environment configuration
   - Verify CORS settings

2. **Authentication Issues**:
   - Clear browser storage
   - Verify token expiration
   - Check network requests for authentication headers

3. **Build Issues**:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors

### Debugging

1. **Angular DevTools**:
   - Use Angular DevTools browser extension for component debugging

2. **Network Monitoring**:
   - Use browser DevTools Network tab to monitor API requests

3. **Console Logging**:
   - Use structured logging with different levels (info, warn, error)
   - Remove debug logs before production deployment

## Conclusion

This developer guide provides a comprehensive overview of the Angular PrimeNG frontend for the Compliance Document Classifier system. By following these guidelines, developers can effectively contribute to the project while maintaining code quality, security, and consistency.

For additional information, refer to:
- [UI Architecture Documentation](UI-Architecture.md)
- [UX Flows Documentation](UX-Flows.md)
- [Style Guide](StyleGuide.md)
- [API Contract](APIContract.md)