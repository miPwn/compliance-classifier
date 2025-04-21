# Compliance Classifier Frontend

This is the frontend application for the Compliance Document Classification System. It's built with Angular and PrimeNG.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Development Server

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Running Tests

### Unit Tests

Run the unit tests with Karma:

```bash
npm test
```

To run tests with code coverage:

```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory.

### End-to-End Tests

Run the end-to-end tests with Cypress in interactive mode:

```bash
npm run e2e
```

Or run them in headless mode:

```bash
npm run e2e:headless
```

## Test Structure

### Unit Tests

Unit tests are located alongside the components and services they test, with a `.spec.ts` suffix.

- Service tests: `src/app/core/services/*.spec.ts`
- Component tests: `src/app/features/*/components/*/*.spec.ts`

### E2E Tests

E2E tests are located in the `cypress/e2e/` directory:

- `navigation.cy.js`: Tests for navigation through the application
- `auth.cy.js`: Tests for the authentication flow
- `batch-document.cy.js`: Tests for batch and document operations

## Test Coverage

The test suite covers:

1. Core services:
   - AuthService
   - BatchService
   - DocumentService
   - ClassificationService

2. Components:
   - Dashboard component
   - Batch list component
   - Batch details component
   - Document upload component
   - Header and sidebar components

3. Integration tests for key user flows:
   - User authentication flow
   - Batch creation flow
   - Document upload flow
   - Classification viewing flow

4. E2E tests for:
   - Navigation through the application
   - Creating a new batch
   - Uploading documents to a batch
   - Viewing classification results

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further Help

For more information on Angular CLI, use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli).
