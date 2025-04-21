# Angular Dashboard Refactoring Specification

## 1. Overview and Goals

This specification outlines the refactoring of the Compliance Classifier Angular dashboard using PrimeNG and PrimeFlex. The refactoring aims to improve the user interface, enhance user experience, and optimize the dashboard's functionality while maintaining its core features.

### Primary Goals:
- Implement a modern, responsive UI using PrimeNG components and PrimeFlex grid system
- Improve the header/navbar with better organization and accessibility
- Create a more intuitive dashboard layout with clear sections
- Enhance the upload experience with drag-and-drop functionality
- Implement real-time pipeline visualization
- Provide better classification category visualization
- Ensure responsive design across all device sizes

## 2. Component Architecture

```
app/
├── layout/
│   ├── header/
│   │   ├── header.component.ts
│   │   ├── header.component.html
│   │   └── header.component.scss
│   └── footer/
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html
│   │   │   └── dashboard.component.scss
│   │   ├── components/
│   │   │   ├── pipeline-timeline/
│   │   │   ├── recent-batches/
│   │   │   └── category-summary/
│   ├── batch/
│   │   ├── components/
│   │   │   ├── create-batch/
│   │   │   ├── batch-details/
│   │   │   └── document-upload/
│   └── shared/
│       ├── components/
│       │   ├── file-upload/
│       │   ├── status-badge/
│       │   └── chart-card/
│       └── directives/
└── core/
    ├── services/
    ├── models/
    └── interceptors/
```

## 3. UI/UX Design Specifications

### Color Palette
- Primary: var(--primary-color) - PrimeNG theme default
- Secondary: var(--surface-200)
- Success: var(--green-500)
- Warning: var(--yellow-500)
- Error: var(--red-500)
- Info: var(--blue-500)
- Background: var(--surface-0)
- Card Background: var(--surface-card)

### Typography
- Font Family: PrimeNG default (system font stack)
- Headings: 
  - H1: 1.75rem, 600 weight
  - H2: 1.5rem, 600 weight
  - H3: 1.25rem, 600 weight
  - H4: 1.1rem, 500 weight
- Body: 1rem, 400 weight
- Small: 0.875rem

### Component Styling
- Border Radius: 8px (cards, buttons), 4px (inputs, badges)
- Shadows: subtle elevation (0 2px 4px rgba(0,0,0,0.1))
- Hover Effects: scale transform (1.02) and shadow increase
- Transitions: 0.2s for all hover/active states