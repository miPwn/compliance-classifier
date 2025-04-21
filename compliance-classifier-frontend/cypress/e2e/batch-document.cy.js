/// <reference types="cypress" />

describe('Batch and Document Operations', () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        id: '123',
        username: 'testuser',
        role: 'admin'
      }
    });
    
    // Set auth token directly in localStorage to simulate being logged in
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-jwt-token');
    });
  });

  describe('Batch Creation Flow', () => {
    it('should create a new batch', () => {
      // Intercept the batch creation API call
      cy.intercept('POST', '**/api/batches', {
        statusCode: 201,
        body: {
          id: 'new-batch-id',
          name: 'Test Batch',
          description: 'Test Description',
          createdAt: new Date().toISOString(),
          documentCount: 0
        }
      }).as('createBatchRequest');
      
      // Navigate to create batch page
      cy.visit('/batches/create');
      
      // Fill in the form
      cy.get('[data-cy=batch-name-input]').type('Test Batch');
      cy.get('[data-cy=batch-description-input]').type('Test Description');
      
      // Submit the form
      cy.get('[data-cy=create-batch-button]').click();
      
      // Wait for the request to complete
      cy.wait('@createBatchRequest');
      
      // Check that we're redirected to the batch details page
      cy.url().should('include', '/batches/new-batch-id');
      
      // Check that the batch details are displayed
      cy.get('h2').contains('Test Batch').should('exist');
    });
  });

  describe('Document Upload Flow', () => {
    beforeEach(() => {
      // Mock the batch details API call
      cy.intercept('GET', '**/api/batches/test-batch-id', {
        statusCode: 200,
        body: {
          id: 'test-batch-id',
          name: 'Test Batch',
          description: 'Test Description',
          createdAt: new Date().toISOString(),
          documentCount: 0,
          documents: []
        }
      });
      
      // Navigate to the batch details page
      cy.visit('/batches/test-batch-id');
    });

    it('should upload a document to a batch', () => {
      // Intercept the document upload API call
      cy.intercept('POST', '**/api/batches/test-batch-id/documents', {
        statusCode: 201,
        body: {
          id: 'new-document-id',
          batchId: 'test-batch-id',
          filename: 'test-document.pdf',
          status: 'uploaded',
          uploadedAt: new Date().toISOString(),
          fileSize: 1024,
          contentType: 'application/pdf'
        }
      }).as('uploadDocumentRequest');
      
      // Click the upload document button
      cy.get('[data-cy=upload-document-button]').click();
      
      // Upload a file
      // Note: In a real test, we would use cy.fixture() to load a test file
      cy.get('[data-cy=document-file-input]').attachFile({
        fileContent: 'test file content',
        fileName: 'test-document.pdf',
        mimeType: 'application/pdf'
      });
      
      // Submit the upload
      cy.get('[data-cy=upload-submit-button]').click();
      
      // Wait for the request to complete
      cy.wait('@uploadDocumentRequest');
      
      // Check that the document appears in the list
      cy.get('[data-cy=document-list]').should('contain', 'test-document.pdf');
    });
  });

  describe('Classification Viewing Flow', () => {
    beforeEach(() => {
      // Mock the document details API call
      cy.intercept('GET', '**/api/documents/test-document-id', {
        statusCode: 200,
        body: {
          id: 'test-document-id',
          batchId: 'test-batch-id',
          filename: 'test-document.pdf',
          status: 'processed',
          uploadedAt: new Date().toISOString(),
          fileSize: 1024,
          contentType: 'application/pdf',
          classifications: [
            { category: 'Financial', confidence: 0.95 },
            { category: 'Contract', confidence: 0.75 }
          ]
        }
      });
      
      // Navigate to the document details page
      cy.visit('/documents/test-document-id');
    });

    it('should display document classifications', () => {
      // Check that the document details are displayed
      cy.get('h2').contains('test-document.pdf').should('exist');
      
      // Check that the classifications are displayed
      cy.get('[data-cy=classification-list]').should('exist');
      cy.get('[data-cy=classification-item]').should('have.length', 2);
      cy.get('[data-cy=classification-item]').first().should('contain', 'Financial');
      cy.get('[data-cy=classification-item]').first().should('contain', '95%');
    });
  });
});