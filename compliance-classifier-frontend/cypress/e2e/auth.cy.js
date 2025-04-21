/// <reference types="cypress" />

describe('Authentication Tests', () => {
  beforeEach(() => {
    // Clear local storage to ensure we're logged out
    cy.clearLocalStorage();
    
    // Visit the login page before each test
    cy.visit('/auth/login');
  });

  it('should display the login form', () => {
    // Check that the login form exists
    cy.get('form').should('exist');
    
    // Check that the username and password fields exist
    cy.get('input[type="text"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    
    // Check that the login button exists
    cy.get('button[type="submit"]').contains('Login').should('exist');
  });

  it('should show error message with invalid credentials', () => {
    // Enter invalid credentials
    cy.get('input[type="text"]').type('invaliduser');
    cy.get('input[type="password"]').type('invalidpassword');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Check that an error message is displayed
    cy.get('.p-message-error').should('be.visible');
  });

  it('should redirect to dashboard after successful login', () => {
    // This test would normally use valid credentials
    // For testing purposes, we'll mock the authentication
    
    // Intercept the login API call and return a mock response
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-jwt-token',
        expiresIn: 3600
      }
    }).as('loginRequest');
    
    // Enter credentials
    cy.get('input[type="text"]').type('testuser');
    cy.get('input[type="password"]').type('password123');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the login request to complete
    cy.wait('@loginRequest');
    
    // Check that we're redirected to the dashboard
    cy.url().should('include', '/dashboard');
    
    // Check that the user menu is displayed (indicating we're logged in)
    cy.get('.user-menu').should('exist');
  });

  it('should log out successfully', () => {
    // First login
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-jwt-token',
        expiresIn: 3600
      }
    }).as('loginRequest');
    
    cy.get('input[type="text"]').type('testuser');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    
    // Now navigate to dashboard
    cy.visit('/dashboard');
    
    // Click on the user menu
    cy.get('.user-menu button').click();
    
    // Click the logout option
    cy.get('.logout-button').click();
    
    // Check that we're logged out (login button is visible)
    cy.get('.login-button').should('exist');
  });
});