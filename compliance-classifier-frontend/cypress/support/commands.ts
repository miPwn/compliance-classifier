// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import Cypress types
/// <reference types="cypress" />
/// <reference types="cypress-file-upload" />

// Add custom command types
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(username: string, password: string): Chainable<void>;
    createBatch(name: string, description?: string): Chainable<string>;
    uploadDocument(batchId: string, filePath: string): Chainable<string>;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('[data-cy=username-input]').type(username);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('include', '/dashboard');
});

// -- Create a new batch --
Cypress.Commands.add('createBatch', (name: string, description?: string) => {
  cy.visit('/batches/create');
  cy.get('[data-cy=batch-name-input]').type(name);
  
  if (description) {
    cy.get('[data-cy=batch-description-input]').type(description);
  }
  
  cy.get('[data-cy=create-batch-button]').click();
  cy.url().should('match', /\/batches\/[a-zA-Z0-9-]+$/);
  
  // Extract and return the batch ID from the URL
  return cy.url().then(url => {
    const batchId = url.split('/').pop();
    return batchId || '';
  });
});

// -- Upload a document to a batch --
Cypress.Commands.add('uploadDocument', (batchId: string, filePath: string) => {
  cy.visit(`/batches/${batchId}`);
  cy.get('[data-cy=upload-document-button]').click();
  cy.get('[data-cy=document-file-input]').attachFile(filePath);
  cy.get('[data-cy=upload-submit-button]').click();
  
  // Wait for the document to appear in the list
  cy.get('[data-cy=document-list]').should('contain', filePath.split('/').pop());
  
  // Extract and return the document ID
  return cy.get('[data-cy=document-item]')
    .first()
    .invoke('attr', 'data-document-id')
    .then(documentId => documentId || '');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })