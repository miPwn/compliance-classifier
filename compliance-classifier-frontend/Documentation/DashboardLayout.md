# Dashboard Layout Documentation

This document describes the layout and UI role of each section in the refactored Angular dashboard using PrimeNG and PrimeFlex.

## Overview

The dashboard is designed with a responsive grid layout using PrimeFlex, allowing it to adapt to different screen sizes from mobile to desktop. The layout is organized into distinct functional sections that provide users with a comprehensive view of the compliance classification system.

## Layout Structure

The dashboard is structured using a responsive grid system with the following main sections:

```
+---------------------------------------+
|              Header                   |
+---------------+-----------------------+
| Pipeline      | Recent                |
| Timeline      | Batches               |
| (Left)        | (Right)               |
+---------------+-----------------------+
|         File Upload                   |
| (Conditionally displayed when needed) |
+---------------------------------------+
|         Category Summary              |
|         (Bottom Section)              |
+---------------------------------------+
```

## Sections and UI Roles

### Header

**Location:** Top of the dashboard
**Component:** Part of the main dashboard component
**UI Role:** 
- Provides application branding and navigation
- Contains user account information and settings
- Offers global actions and navigation links

### Pipeline Timeline (Left Section)

**Location:** Left side of the top row
**Component:** `app-pipeline-timeline`
**UI Role:**
- Displays real-time processing pipeline events
- Shows document processing status (pending, processing, classified, error)
- Provides auto-refresh toggle for live updates
- Allows manual refresh of pipeline data
- Visualizes the flow of documents through the classification system
- Responsive sizing: 6/12 columns on large screens, 7/12 columns on extra-large screens, full width on smaller screens

### Recent Batches (Right Section)

**Location:** Right side of the top row
**Component:** `app-recent-batches`
**UI Role:**
- Lists recently created document batches
- Displays batch metadata (name, creation date, document count)
- Provides actions for each batch (view details, upload documents, delete)
- Includes a "Create New Batch" button
- Shows pagination when there are more than 5 batches
- Responsive sizing: 6/12 columns on large screens, 5/12 columns on extra-large screens, full width on smaller screens

### File Upload (Conditional Section)

**Location:** Middle section, below the top row
**Component:** `app-file-upload`
**UI Role:**
- Conditionally displayed when a batch is selected for upload
- Provides drag-and-drop file upload functionality
- Shows upload progress for each file
- Displays a list of uploaded files with type badges
- Allows clearing uploaded files
- Spans full width of the dashboard
- Only appears when needed, optimizing screen space

### Category Summary (Bottom Section)

**Location:** Bottom of the dashboard
**Component:** `app-category-summary`
**UI Role:**
- Visualizes classification category distribution with charts
- Shows pie chart for category distribution percentages
- Displays horizontal bar chart for document count by category
- Lists detailed category cards with metadata
- Includes risk level indicators for each category
- Spans full width of the dashboard
- Provides comprehensive analytics on document classification

### Create Batch Modal

**Location:** Modal dialog (appears over the dashboard)
**Component:** `app-create-batch-modal`
**UI Role:**
- Provides form for creating new document batches
- Validates input fields (required name, max length constraints)
- Shows loading state during submission
- Displays success/error messages
- Centered modal with responsive width (500px)

## Layout Interactions

The dashboard components interact with each other to create a cohesive user experience:

1. **Pipeline Timeline ↔ Dashboard**: Auto-refresh toggle and manual refresh events are handled by the dashboard component, which refreshes all data.

2. **Recent Batches ↔ Dashboard**: 
   - When "Create New Batch" is clicked, the dashboard shows the Create Batch Modal
   - When "View Details" is clicked, the dashboard navigates to the batch details page
   - When "Upload Documents" is clicked, the dashboard displays the File Upload component
   - When "Delete Batch" is clicked, the dashboard confirms and processes the deletion

3. **Create Batch Modal ↔ Dashboard**: When a batch is created, the dashboard refreshes the Recent Batches list and automatically selects the new batch for upload.

4. **File Upload ↔ Dashboard**: When files are uploaded, the dashboard refreshes the Pipeline Timeline to show the new document processing events.

## Responsive Behavior

The dashboard layout is fully responsive, adapting to different screen sizes:

- **Desktop (xl)**: Two-column layout for top section with 7:5 ratio
- **Large Tablets/Small Desktops (lg)**: Two-column layout for top section with 6:6 ratio
- **Tablets (md)**: Single-column layout with sections stacked vertically
- **Mobile (sm and below)**: Full-width single-column layout with optimized component sizing

Each component also has internal responsive behavior, detailed in the Responsiveness.md document.