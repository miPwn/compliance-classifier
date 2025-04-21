# UI Components Documentation

This document lists and describes the custom and PrimeNG components used in the refactored Angular dashboard.

## Overview

The dashboard uses a combination of custom Angular components and PrimeNG components to create a cohesive and responsive user interface. PrimeNG provides a rich set of UI components that follow modern design principles, while custom components encapsulate specific business logic and presentation needs.

## Custom Components

### Dashboard Component

**File Path:** `src/app/features/dashboard/components/dashboard.component.ts`
**Description:** Main container component that orchestrates the dashboard layout and manages data flow between child components.
**Responsibilities:**
- Loads and manages data from services
- Handles auto-refresh functionality
- Coordinates interactions between child components
- Manages routing to other parts of the application
- Handles error states and loading indicators

### Pipeline Timeline Component

**File Path:** `src/app/features/dashboard/components/pipeline-timeline/pipeline-timeline.component.ts`
**Description:** Displays a timeline of document processing events in the classification pipeline.
**Responsibilities:**
- Visualizes document processing status
- Provides auto-refresh toggle
- Allows manual refresh of data
- Shows loading state during data fetching
- Displays empty state when no events exist

### Recent Batches Component

**File Path:** `src/app/features/dashboard/components/recent-batches/recent-batches.component.ts`
**Description:** Displays a list of recently created document batches with actions.
**Responsibilities:**
- Lists batch cards with metadata
- Provides batch actions (view, upload, delete)
- Shows create batch button
- Handles pagination for large batch lists
- Displays empty state when no batches exist
- Shows error state when batch loading fails

### Category Summary Component

**File Path:** `src/app/features/dashboard/components/category-summary/category-summary.component.ts`
**Description:** Visualizes classification category distribution with charts and cards.
**Responsibilities:**
- Creates and configures pie chart for category distribution
- Creates and configures bar chart for document counts
- Displays category cards with details
- Shows risk level indicators
- Handles chart data updates
- Displays empty state when no categories exist

### File Upload Component

**File Path:** `src/app/features/dashboard/components/file-upload/file-upload.component.ts`
**Description:** Provides file upload functionality for document batches.
**Responsibilities:**
- Handles file selection and validation
- Manages file upload process
- Tracks upload progress
- Displays uploaded files list
- Shows file type badges
- Formats file sizes
- Provides clear files functionality

### Create Batch Modal Component

**File Path:** `src/app/features/dashboard/components/create-batch-modal/create-batch-modal.component.ts`
**Description:** Modal dialog for creating new document batches.
**Responsibilities:**
- Manages modal visibility
- Provides form with validation
- Handles form submission
- Shows loading state during submission
- Emits events for batch creation
- Resets form after submission

## PrimeNG Components

### Layout Components

| Component | Usage | Configuration |
|-----------|-------|---------------|
| `p-card` | Container for content sections | Used in all dashboard sections with custom styling |
| `p-dialog` | Modal dialog | Used for Create Batch Modal with 500px width |
| `p-toast` | Notification messages | Used for success/error notifications |

### Data Display Components

| Component | Usage | Configuration |
|-----------|-------|---------------|
| `p-timeline` | Document processing events | Configured with alternate alignment |
| `p-dataView` | Batch list with pagination | Configured with list layout and 5 items per page |
| `p-chart` | Category distribution charts | Configured with pie and bar chart types |
| `p-badge` | Status indicators | Used for document counts and file types |
| `p-progressBar` | Loading and upload progress | Used in both determinate and indeterminate modes |

### Form Components

| Component | Usage | Configuration |
|-----------|-------|---------------|
| `p-fileUpload` | Document upload | Configured with custom upload handling |
| `p-inputText` | Text input fields | Used in Create Batch form |
| `p-inputTextarea` | Multiline text input | Used for batch description |
| `p-inputSwitch` | Toggle switch | Used for auto-refresh toggle |

### Button Components

| Component | Usage | Configuration |
|-----------|-------|---------------|
| `p-button` | Action buttons | Used throughout the dashboard |
| `pRipple` | Button ripple effect | Applied to all buttons |
| `p-tooltip` | Button tooltips | Used for icon-only buttons |

## Component Integration

The components are integrated using Angular's input/output binding mechanism:

### Dashboard → Child Components (Inputs)

- **Pipeline Timeline:**
  - `[pipelineEvents]`: Array of pipeline events
  - `[isLoading]`: Loading state boolean
  - `[autoRefresh]`: Auto-refresh state boolean

- **Recent Batches:**
  - `[batches]`: Array of batch objects
  - `[isLoading]`: Loading state boolean
  - `[error]`: Error message string

- **Category Summary:**
  - `[categories]`: Array of category objects with counts
  - `[isLoading]`: Loading state boolean

- **File Upload:**
  - `[batchId]`: Selected batch ID for upload
  - `[maxFileSize]`: Maximum allowed file size
  - `[multiple]`: Boolean to allow multiple file selection
  - `[accept]`: String of accepted file types

- **Create Batch Modal:**
  - No inputs, controlled via ViewChild reference

### Child Components → Dashboard (Outputs)

- **Pipeline Timeline:**
  - `(refreshToggle)`: Emits when auto-refresh is toggled
  - `(manualRefresh)`: Emits when manual refresh is triggered

- **Recent Batches:**
  - `(viewDetails)`: Emits batch ID when view details is clicked
  - `(uploadDocuments)`: Emits batch ID when upload documents is clicked
  - `(deleteBatch)`: Emits batch ID when delete batch is clicked
  - `(createBatch)`: Emits when create batch button is clicked

- **File Upload:**
  - `(uploadComplete)`: Emits when file upload is complete
  - `(uploadError)`: Emits when file upload fails

- **Create Batch Modal:**
  - `(batchCreated)`: Emits new batch object when created
  - `(modalClosed)`: Emits when modal is closed

## Component Styling

Components use a combination of:

1. **PrimeNG Theme Variables:** For consistent styling across components
2. **PrimeFlex Grid System:** For responsive layouts
3. **Component-specific SCSS:** For custom styling needs
4. **Global Styles:** For application-wide styling rules

Each component has its own SCSS file that follows the naming convention `component-name.component.scss`.

## Component Testing

Each component has a corresponding spec file that follows the naming convention `component-name.component.spec.ts`. These tests verify:

1. Component creation
2. Input/output binding
3. UI rendering
4. User interactions
5. Responsive behavior

Additionally, integration tests verify the interactions between components in the dashboard.

## Component Documentation

Each component includes:

1. **Class documentation:** JSDoc comments for the component class
2. **Method documentation:** JSDoc comments for public methods
3. **Input/Output documentation:** JSDoc comments for @Input and @Output properties
4. **Template comments:** HTML comments for complex template sections

## Component Best Practices

The components follow these best practices:

1. **Single Responsibility:** Each component has a clear, focused responsibility
2. **Encapsulation:** Components encapsulate their logic and presentation
3. **Reusability:** Components are designed to be reusable
4. **Testability:** Components are designed to be easily testable
5. **Accessibility:** Components follow accessibility best practices
6. **Performance:** Components are optimized for performance
7. **Responsive Design:** Components adapt to different screen sizes