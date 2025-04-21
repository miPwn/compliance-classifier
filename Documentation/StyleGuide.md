# Style Guide - Compliance Document Classifier

This style guide defines the visual standards for the Compliance Document Classifier frontend application. It ensures consistency across the application and provides guidelines for implementing the UI components.

## Color Palette

The application uses a professional color palette that conveys trust, security, and clarity—essential qualities for a compliance-focused application.

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Primary Blue | `#007bff` | `0, 123, 255` | Primary actions, links, active states |
| Secondary Gray | `#6c757d` | `108, 117, 125` | Secondary actions, inactive states |
| Success Green | `#28a745` | `40, 167, 69` | Success messages, completed states |
| Warning Yellow | `#ffc107` | `255, 193, 7` | Warning messages, pending states |
| Danger Red | `#dc3545` | `220, 53, 69` | Error messages, high-risk indicators |
| Info Teal | `#17a2b8` | `23, 162, 184` | Information messages, processing states |

### Neutral Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| White | `#ffffff` | `255, 255, 255` | Background, cards |
| Light Gray | `#f8f9fa` | `248, 249, 250` | Secondary background, hover states |
| Medium Gray | `#e9ecef` | `233, 236, 239` | Borders, dividers |
| Dark Gray | `#343a40` | `52, 58, 64` | Text, icons |

### Status Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Pending | `#ffc107` | `255, 193, 7` | Pending status |
| Processing | `#17a2b8` | `23, 162, 184` | Processing status |
| Completed | `#28a745` | `40, 167, 69` | Completed status |
| Error | `#dc3545` | `220, 53, 69` | Error status |

### Risk Level Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Low Risk | `#28a745` | `40, 167, 69` | Low risk indicators |
| Medium Risk | `#ffc107` | `255, 193, 7` | Medium risk indicators |
| High Risk | `#dc3545` | `220, 53, 69` | High risk indicators |

### Implementation

The color palette is implemented using SCSS variables:

```scss
// Primary colors
$primary: #007bff;
$secondary: #6c757d;
$success: #28a745;
$warning: #ffc107;
$danger: #dc3545;
$info: #17a2b8;

// Neutral colors
$white: #ffffff;
$light: #f8f9fa;
$medium: #e9ecef;
$dark: #343a40;

// Status colors
$status-pending: $warning;
$status-processing: $info;
$status-completed: $success;
$status-error: $danger;

// Risk level colors
$risk-low: $success;
$risk-medium: $warning;
$risk-high: $danger;
```

## Typography

The application uses a clean, readable typography system that prioritizes legibility and hierarchy.

### Font Family

- **Primary Font**: `'Roboto', sans-serif`
- **Fallback Fonts**: `'Segoe UI', 'Helvetica Neue', Arial, sans-serif`

### Font Sizes

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| h1 | 2rem (32px) | 700 | 1.2 | Page titles |
| h2 | 1.75rem (28px) | 700 | 1.2 | Section headings |
| h3 | 1.5rem (24px) | 600 | 1.3 | Card headings |
| h4 | 1.25rem (20px) | 600 | 1.3 | Subsection headings |
| h5 | 1.125rem (18px) | 600 | 1.4 | Minor headings |
| h6 | 1rem (16px) | 600 | 1.4 | Small headings |
| Body | 1rem (16px) | 400 | 1.5 | Regular text |
| Small | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| Caption | 0.75rem (12px) | 400 | 1.5 | Captions, labels |

### Implementation

Typography is implemented using SCSS variables and mixins:

```scss
// Font families
$font-family-base: 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

// Font sizes
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-sm: 0.875rem;
$font-size-xs: 0.75rem;

// Font weights
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Heading sizes
$h1-font-size: 2rem;
$h2-font-size: 1.75rem;
$h3-font-size: 1.5rem;
$h4-font-size: 1.25rem;
$h5-font-size: 1.125rem;
$h6-font-size: 1rem;

// Line heights
$line-height-tight: 1.2;
$line-height-base: 1.5;
```

## Component Spacing

Consistent spacing ensures a harmonious layout and improves readability.

### Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| xs | 0.25rem (4px) | Minimal spacing, tight elements |
| sm | 0.5rem (8px) | Close elements, form controls |
| md | 1rem (16px) | Standard spacing, related elements |
| lg | 1.5rem (24px) | Section spacing |
| xl | 2rem (32px) | Major section spacing |
| xxl | 3rem (48px) | Page section spacing |

### Layout Spacing

- **Container Padding**: 1.5rem (24px)
- **Card Padding**: 1.5rem (24px)
- **Form Group Margin**: 1rem (16px)
- **Button Padding**: 0.5rem 1rem (8px 16px)
- **Table Cell Padding**: 0.75rem (12px)

### Implementation

Spacing is implemented using SCSS variables:

```scss
// Spacing scale
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-xxl: 3rem;

// Component-specific spacing
$container-padding: $spacing-lg;
$card-padding: $spacing-lg;
$form-group-margin: $spacing-md;
$button-padding: $spacing-sm $spacing-md;
$table-cell-padding: 0.75rem;
```

## Button & Field Styles

### Buttons

The application uses PrimeNG buttons with consistent styling:

#### Button Types

| Type | Class | Usage |
|------|-------|-------|
| Primary | `p-button-primary` | Primary actions (Create, Save) |
| Secondary | `p-button-secondary` | Secondary actions (Cancel, Back) |
| Success | `p-button-success` | Positive actions (Approve, Complete) |
| Warning | `p-button-warning` | Cautionary actions (Pending) |
| Danger | `p-button-danger` | Destructive actions (Delete, Remove) |
| Info | `p-button-info` | Informational actions (View, Details) |
| Text | `p-button-text` | Subtle actions, links |
| Outlined | `p-button-outlined` | Alternative to solid buttons |

#### Button Sizes

| Size | Class | Usage |
|------|-------|-------|
| Small | `p-button-sm` | Compact areas, secondary actions |
| Default | (no class) | Standard buttons |
| Large | `p-button-lg` | Primary page actions, emphasis |

#### Button States

- **Normal**: Default state
- **Hover**: Slightly darker shade
- **Active**: Darker shade, slight inset shadow
- **Disabled**: Reduced opacity, no hover effects

### Form Fields

The application uses PrimeNG form components with consistent styling:

#### Input Types

| Type | Component | Usage |
|------|-----------|-------|
| Text | `p-inputtext` | Single-line text input |
| Textarea | `p-textarea` | Multi-line text input |
| Dropdown | `p-dropdown` | Selection from a list |
| Multi-select | `p-multiSelect` | Multiple selections from a list |
| Calendar | `p-calendar` | Date selection |
| Checkbox | `p-checkbox` | Boolean selection |
| Radio | `p-radioButton` | Single selection from options |
| File Upload | `p-fileUpload` | File selection and upload |

#### Field States

- **Normal**: Default state
- **Focus**: Border color changes to primary color
- **Invalid**: Border color changes to danger color
- **Disabled**: Reduced opacity, no interaction

### Implementation Example

```html
<!-- Primary Button -->
<button pButton pRipple label="Create Batch" icon="pi pi-plus" class="p-button-primary"></button>

<!-- Secondary Button -->
<button pButton pRipple label="Cancel" icon="pi pi-times" class="p-button-secondary"></button>

<!-- Text Input -->
<input pInputText type="text" [(ngModel)]="value" />

<!-- Dropdown -->
<p-dropdown [options]="categories" [(ngModel)]="selectedCategory" optionLabel="name"></p-dropdown>
```

## PrimeNG Component Usage Guidelines

### Layout Components

#### Card (p-card)

- Use for content grouping and separation
- Include a clear header
- Maintain consistent padding (1.5rem)
- Example:

```html
<p-card header="Recent Batches" styleClass="batches-card">
  <!-- Card content -->
  <div class="card-footer">
    <button pButton pRipple label="View All" class="p-button-text"></button>
  </div>
</p-card>
```

#### Panel (p-panel)

- Use for collapsible sections
- Include a clear header
- Example:

```html
<p-panel header="Advanced Filters" [toggleable]="true">
  <!-- Panel content -->
</p-panel>
```

#### Divider (p-divider)

- Use to separate content sections
- Example:

```html
<p-divider></p-divider>
```

### Data Components

#### Table (p-table)

- Use for displaying tabular data
- Include pagination for large datasets
- Implement sorting and filtering where appropriate
- Example:

```html
<p-table [value]="documents" [paginator]="true" [rows]="10">
  <ng-template pTemplate="header">
    <tr>
      <th>Document Name</th>
      <th>Upload Date</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-document>
    <tr>
      <td>{{ document.fileName }}</td>
      <td>{{ document.uploadDate | date:'short' }}</td>
      <td>{{ document.status }}</td>
      <td>
        <button pButton pRipple icon="pi pi-eye" class="p-button-rounded p-button-text"></button>
      </td>
    </tr>
  </ng-template>
</p-table>
```

#### Chart (p-chart)

- Use for data visualization
- Include clear labels and legends
- Use consistent colors from the color palette
- Example:

```html
<p-chart type="pie" [data]="categoryChartData" [options]="{ responsive: true }"></p-chart>
```

### Form Components

#### Dropdown (p-dropdown)

- Use for single selection from a list
- Include a clear label
- Example:

```html
<label for="category">Category</label>
<p-dropdown id="category" [options]="categories" [(ngModel)]="selectedCategory" optionLabel="name"></p-dropdown>
```

#### MultiSelect (p-multiSelect)

- Use for multiple selections from a list
- Include a clear label
- Example:

```html
<label for="fileTypes">File Types</label>
<p-multiSelect id="fileTypes" [options]="fileTypes" [(ngModel)]="selectedFileTypes" optionLabel="name"></p-multiSelect>
```

#### Calendar (p-calendar)

- Use for date selection
- Include a clear label
- Example:

```html
<label for="dateRange">Date Range</label>
<p-calendar id="dateRange" [(ngModel)]="dateRange" selectionMode="range" [showButtonBar]="true"></p-calendar>
```

#### FileUpload (p-fileUpload)

- Use for file selection and upload
- Include clear instructions
- Show progress during upload
- Example:

```html
<p-fileUpload name="files" [url]="uploadUrl" (onUpload)="onUploadComplete($event)" [multiple]="true" accept=".pdf,.docx,.txt" [maxFileSize]="10000000">
  <ng-template pTemplate="content">
    <p>Drag and drop files here or click to select files.</p>
    <p>Supported formats: PDF, DOCX, TXT</p>
    <p>Maximum file size: 10MB</p>
  </ng-template>
</p-fileUpload>
```

### Overlay Components

#### Dialog (p-dialog)

- Use for modal interactions
- Include a clear header
- Provide clear actions (confirm, cancel)
- Example:

```html
<p-dialog header="Override Classification" [(visible)]="displayDialog" [modal]="true" [style]="{width: '500px'}">
  <!-- Dialog content -->
  <div class="dialog-footer">
    <button pButton pRipple label="Cancel" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
    <button pButton pRipple label="Save" icon="pi pi-check" class="p-button-primary" (click)="saveOverride()"></button>
  </div>
</p-dialog>
```

#### Toast (p-toast)

- Use for notifications and feedback
- Keep messages concise
- Use appropriate severity levels
- Example:

```typescript
this.messageService.add({
  severity: 'success',
  summary: 'Upload Complete',
  detail: 'Documents have been uploaded successfully'
});
```

### Menu Components

#### Menubar (p-menubar)

- Use for main navigation
- Keep structure simple and intuitive
- Example:

```html
<p-menubar [model]="menuItems">
  <ng-template pTemplate="end">
    <div class="user-menu">
      <span>John Doe</span>
      <button pButton pRipple icon="pi pi-user" class="p-button-rounded p-button-text"></button>
    </div>
  </ng-template>
</p-menubar>
```

#### Breadcrumb (p-breadcrumb)

- Use for navigation hierarchy
- Keep labels concise
- Example:

```html
<p-breadcrumb [model]="breadcrumbItems" [home]="home"></p-breadcrumb>
```

## Responsive Design Guidelines

### Breakpoints

- **Extra Small**: < 576px (Mobile phones)
- **Small**: 576px - 768px (Large phones, small tablets)
- **Medium**: 768px - 992px (Tablets)
- **Large**: 992px - 1200px (Desktops)
- **Extra Large**: > 1200px (Large desktops)

### Responsive Behavior

- Tables should scroll horizontally on small screens
- Forms should stack vertically on small screens
- Cards should adjust to full width on small screens
- Sidebar should collapse on small screens
- Font sizes should adjust slightly for readability on small screens

### Implementation Example

```scss
// Responsive mixins
@mixin xs {
  @media (max-width: 575.98px) { @content; }
}

@mixin sm {
  @media (min-width: 576px) and (max-width: 767.98px) { @content; }
}

@mixin md {
  @media (min-width: 768px) and (max-width: 991.98px) { @content; }
}

@mixin lg {
  @media (min-width: 992px) and (max-width: 1199.98px) { @content; }
}

@mixin xl {
  @media (min-width: 1200px) { @content; }
}

// Usage example
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;
  
  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include lg {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Accessibility Guidelines

- Use semantic HTML elements
- Ensure sufficient color contrast (WCAG AA compliance)
- Provide text alternatives for non-text content
- Ensure keyboard navigability
- Use ARIA attributes where appropriate
- Test with screen readers

## Conclusion

This style guide provides a comprehensive set of visual standards for the Compliance Document Classifier frontend application. By following these guidelines, developers can ensure a consistent, professional, and user-friendly interface that aligns with the application's purpose and goals.