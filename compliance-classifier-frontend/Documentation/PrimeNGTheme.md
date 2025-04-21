# PrimeNG Theme Documentation

This document describes the theme tokens and colors used in the refactored Angular dashboard with PrimeNG and PrimeFlex.

## Theme Overview

The dashboard uses PrimeNG's theming system, which is based on CSS variables. The theme provides a consistent look and feel across all components while allowing for customization and branding.

## Color Palette

The dashboard uses the following color palette:

### Primary Colors

| Token | Color Code | Usage |
|-------|------------|-------|
| `--primary-color` | `#42A5F5` | Primary buttons, active states, links |
| `--primary-color-text` | `#ffffff` | Text on primary color backgrounds |
| `--primary-dark` | `#0277BD` | Hover states for primary elements |
| `--primary-light` | `#BBDEFB` | Backgrounds for primary-related elements |

### Secondary Colors

| Token | Color Code | Usage |
|-------|------------|-------|
| `--secondary-color` | `#6c757d` | Secondary buttons, less prominent elements |
| `--secondary-color-text` | `#ffffff` | Text on secondary color backgrounds |
| `--secondary-dark` | `#5a6268` | Hover states for secondary elements |
| `--secondary-light` | `#e2e3e5` | Backgrounds for secondary-related elements |

### Semantic Colors

| Token | Color Code | Usage |
|-------|------------|-------|
| `--green-500` | `#66BB6A` | Success states, classified documents |
| `--yellow-500` | `#FFA726` | Warning states, pending documents |
| `--blue-500` | `#42A5F5` | Info states, processing documents |
| `--red-500` | `#EC407A` | Error states, failed documents |
| `--purple-500` | `#AB47BC` | Special states, highlighted elements |

### Neutral Colors

| Token | Color Code | Usage |
|-------|------------|-------|
| `--surface-a` | `#ffffff` | Primary background color |
| `--surface-b` | `#f8f9fa` | Secondary background color |
| `--surface-c` | `#e9ecef` | Tertiary background color |
| `--surface-d` | `#dee2e6` | Border colors |
| `--surface-e` | `#ffffff` | Card and panel backgrounds |
| `--surface-f` | `#ffffff` | Input backgrounds |
| `--text-color` | `#212529` | Primary text color |
| `--text-color-secondary` | `#6c757d` | Secondary text color |

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family` | `'Roboto', 'Helvetica Neue', sans-serif` | Primary font family |
| `--font-size` | `1rem` | Base font size |
| `--font-weight-normal` | `400` | Normal font weight |
| `--font-weight-bold` | `700` | Bold font weight |
| `--line-height` | `1.5` | Base line height |

## Component-Specific Tokens

### Cards

| Token | Value | Usage |
|-------|-------|-------|
| `--card-border-radius` | `0.5rem` | Border radius for cards |
| `--card-shadow` | `0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)` | Shadow for cards |
| `--card-padding` | `1.25rem` | Padding inside cards |

### Buttons

| Token | Value | Usage |
|-------|-------|-------|
| `--button-border-radius` | `0.25rem` | Border radius for standard buttons |
| `--button-rounded-border-radius` | `2rem` | Border radius for rounded buttons |
| `--button-padding` | `0.5rem 1rem` | Padding inside buttons |
| `--button-icon-only-width` | `2.357rem` | Width for icon-only buttons |

### Inputs

| Token | Value | Usage |
|-------|-------|-------|
| `--input-border-radius` | `0.25rem` | Border radius for inputs |
| `--input-padding` | `0.5rem 0.75rem` | Padding inside inputs |
| `--input-border` | `1px solid var(--surface-d)` | Border for inputs |
| `--input-hover-border-color` | `var(--primary-color)` | Border color on hover |
| `--input-focus-border-color` | `var(--primary-color)` | Border color on focus |

## Component Theme Usage

### Pipeline Timeline Component

- Uses `--blue-500` for processing documents
- Uses `--green-500` for classified documents
- Uses `--red-500` for error documents
- Uses `--yellow-500` for pending documents
- Custom marker styling with component-specific colors
- Timeline alignment alternates between left and right

### Recent Batches Component

- Card-based layout with `--card-shadow`
- Badge for document count uses `--blue-500` (info severity)
- Action buttons use icon-only styling with tooltips
- Delete action uses `--red-500` (danger severity)

### Category Summary Component

- Pie chart uses a predefined color palette:
  - `#42A5F5`, `#66BB6A`, `#FFA726`, `#26C6DA`, `#7E57C2`
  - `#EC407A`, `#AB47BC`, `#5C6BC0`, `#29B6F6`, `#26A69A`
- Bar chart uses `--blue-500` for bars
- Category cards have colored headers matching pie chart segments
- Risk level badges use semantic colors:
  - High: `--red-500`
  - Medium: `--yellow-500`
  - Low: `--green-500`

### File Upload Component

- Drag and drop area uses `--surface-b` background
- File type badges use semantic colors:
  - PDF: `--red-500` (danger severity)
  - DOCX/DOC: `--blue-500` (info severity)
  - TXT: `--green-500` (success severity)
  - Other: `--yellow-500` (warning severity)
- Progress bars use `--primary-color`

### Create Batch Modal Component

- Modal uses `--surface-e` background
- Form validation uses `--red-500` for error messages
- Required field indicator uses `--red-500`
- Primary action button uses `--primary-color`
- Cancel button uses `--secondary-color`

## Responsive Theming

The theme includes responsive adjustments for different screen sizes:

- Font sizes scale down on smaller screens
- Padding and margins reduce on mobile devices
- Card layouts adjust from multi-column to single-column
- Button sizes increase on touch devices for better tap targets

## Theme Customization

The theme can be customized by modifying the CSS variables in the theme file. This allows for easy branding changes without modifying component styles directly.

To customize the theme:

1. Locate the theme file at `src/assets/themes/theme.scss`
2. Modify the CSS variables to match your branding
3. Rebuild the application to apply the changes

Example customization:

```scss
:root {
  --primary-color: #3F51B5; // Change primary color to indigo
  --primary-dark: #303F9F;
  --primary-light: #C5CAE9;
  --font-family: 'Open Sans', sans-serif; // Change font family
}