/// <reference types="cypress" />

describe('Navigation Tests', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should redirect to dashboard from root', () => {
    // Check that we're redirected to the dashboard
    cy.url().should('include', '/dashboard');
  });

  it('should have a working header with navigation links', () => {
    // Check that the header exists
    cy.get('app-header').should('exist');
    
    // Check that the logo exists and links to the dashboard
    cy.get('.logo').should('exist').click();
    cy.url().should('include', '/dashboard');
    
    // Check that the batches link works
    cy.get('.nav-link').contains('Batches').click();
    cy.url().should('include', '/batches');
  });

  it('should show login button when not authenticated', () => {
    // Check that the login button exists
    cy.get('.login-button').should('exist');
    
    // Click the login button and check that we're redirected to the login page
    cy.get('.login-button').click();
    cy.url().should('include', '/auth/login');
  });
});

describe('Batch List Tests', () => {
  beforeEach(() => {
    // Visit the batches page before each test
    cy.visit('/batches');
  });

  it('should display the batch list page', () => {
    // Check that the page title exists
    cy.get('h2').contains('Batches').should('exist');
    
    // Check that the create batch button exists
    cy.get('button').contains('Create New Batch').should('exist');
  });

  it('should navigate to create batch page when create button is clicked', () => {
    // Click the create batch button
    cy.get('button').contains('Create New Batch').click();
    
    // Check that we're redirected to the create batch page
    cy.url().should('include', '/batches/create');
  });
});

describe('Dashboard Tests', () => {
  beforeEach(() => {
    // Visit the dashboard page before each test
    cy.visit('/dashboard');
  });

  it('should display the dashboard page', () => {
    // Check that the recent batches section exists
    cy.get('h3').contains('Recent Batches').should('exist');
    
    // Check that the classification categories section exists
    cy.get('h3').contains('Classification Categories').should('exist');
  });

  it('should have a create batch button that navigates to create batch page', () => {
    // Click the create batch button
    cy.get('button').contains('Create New Batch').click();
    
    // Check that we're redirected to the create batch page
    cy.url().should('include', '/batches/create');
  });
});