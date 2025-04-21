/**
 * Synthetic Monitoring Configuration
 * 
 * This file contains the configuration for synthetic monitoring
 * using Checkly or similar services.
 */

// Synthetic monitoring configuration
const SYNTHETIC_MONITORING_CONFIG = {
    // Base URL for the application
    baseUrl: 'https://compliance-classifier.example.com',
    
    // API key for the monitoring service
    apiKey: 'YOUR_CHECKLY_API_KEY',
    
    // Check frequency in minutes
    frequency: 5,
    
    // Alert thresholds
    thresholds: {
        responseTime: 3000,  // 3 seconds
        availability: 99.9   // 99.9% uptime
    },
    
    // Locations to run checks from
    locations: [
        'eu-west-1',
        'us-east-1',
        'ap-southeast-1'
    ],
    
    // Browser settings
    browser: {
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
        mobile: false,
        timeout: 30000  // 30 seconds
    }
};

// Define critical user flows to monitor
const CRITICAL_FLOWS = [
    {
        name: 'Login Flow',
        id: 'login-flow',
        description: 'Verifies that users can log in to the application',
        steps: [
            {
                name: 'Navigate to login page',
                script: `
                    await page.goto('{{baseUrl}}/login');
                    await page.waitForSelector('#login-form');
                `
            },
            {
                name: 'Enter credentials',
                script: `
                    await page.type('#username', '{{TEST_USERNAME}}');
                    await page.type('#password', '{{TEST_PASSWORD}}');
                `
            },
            {
                name: 'Submit login form',
                script: `
                    await Promise.all([
                        page.click('#login-button'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                `
            },
            {
                name: 'Verify successful login',
                script: `
                    await page.waitForSelector('#user-profile-menu');
                    const loggedInUser = await page.$eval('#user-profile-menu', el => el.textContent);
                    assert.ok(loggedInUser.includes('{{TEST_USERNAME}}'), 'User should be logged in');
                `
            }
        ]
    },
    {
        name: 'Document Upload Flow',
        id: 'document-upload-flow',
        description: 'Verifies that users can upload documents',
        steps: [
            {
                name: 'Login',
                script: `
                    // Reuse login flow
                    await runFlow('login-flow');
                `
            },
            {
                name: 'Navigate to document upload',
                script: `
                    await page.goto('{{baseUrl}}/documents/upload');
                    await page.waitForSelector('#upload-form');
                `
            },
            {
                name: 'Select document',
                script: `
                    const fileInput = await page.$('input[type=file]');
                    await fileInput.uploadFile('{{TEST_DOCUMENT_PATH}}');
                    await page.waitForSelector('.file-preview');
                `
            },
            {
                name: 'Submit upload form',
                script: `
                    await Promise.all([
                        page.click('#upload-button'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                `
            },
            {
                name: 'Verify successful upload',
                script: `
                    await page.waitForSelector('.success-message');
                    const successMessage = await page.$eval('.success-message', el => el.textContent);
                    assert.ok(successMessage.includes('successfully uploaded'), 'Document should be uploaded successfully');
                `
            }
        ]
    },
    {
        name: 'Classification Review Flow',
        id: 'classification-review-flow',
        description: 'Verifies that users can review document classifications',
        steps: [
            {
                name: 'Login',
                script: `
                    // Reuse login flow
                    await runFlow('login-flow');
                `
            },
            {
                name: 'Navigate to classifications',
                script: `
                    await page.goto('{{baseUrl}}/classifications');
                    await page.waitForSelector('.classification-list');
                `
            },
            {
                name: 'Open first document',
                script: `
                    await Promise.all([
                        page.click('.classification-item:first-child'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                `
            },
            {
                name: 'Review classification',
                script: `
                    await page.waitForSelector('#classification-form');
                    await page.click('#approve-classification');
                `
            },
            {
                name: 'Submit review',
                script: `
                    await Promise.all([
                        page.click('#submit-review'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                `
            },
            {
                name: 'Verify successful review',
                script: `
                    await page.waitForSelector('.success-message');
                    const successMessage = await page.$eval('.success-message', el => el.textContent);
                    assert.ok(successMessage.includes('successfully reviewed'), 'Classification should be reviewed successfully');
                `
            }
        ]
    },
    {
        name: 'Batch Processing Flow',
        id: 'batch-processing-flow',
        description: 'Verifies that users can create and process batches',
        steps: [
            {
                name: 'Login',
                script: `
                    // Reuse login flow
                    await runFlow('login-flow');
                `
            },
            {
                name: 'Navigate to batches',
                script: `
                    await page.goto('{{baseUrl}}/batches');
                    await page.waitForSelector('#batch-list');
                `
            },
            {
                name: 'Create new batch',
                script: `
                    await page.click('#create-batch');
                    await page.waitForSelector('#batch-form');
                    await page.type('#batch-name', 'Test Batch {{timestamp}}');
                    await page.click('#create-batch-submit');
                    await page.waitForSelector('#batch-detail');
                `
            },
            {
                name: 'Add documents to batch',
                script: `
                    await page.click('#add-documents');
                    await page.waitForSelector('#document-selector');
                    await page.click('.document-item:first-child .select-document');
                    await page.click('.document-item:nth-child(2) .select-document');
                    await page.click('#add-selected-documents');
                    await page.waitForSelector('#batch-documents');
                    const documentCount = await page.$$eval('#batch-documents .document-item', items => items.length);
                    assert.ok(documentCount >= 2, 'At least 2 documents should be added to the batch');
                `
            },
            {
                name: 'Process batch',
                script: `
                    await Promise.all([
                        page.click('#process-batch'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                `
            },
            {
                name: 'Verify batch processing',
                script: `
                    await page.waitForSelector('#batch-status');
                    const batchStatus = await page.$eval('#batch-status', el => el.textContent);
                    assert.ok(['Processing', 'Completed'].some(status => batchStatus.includes(status)), 'Batch should be processing or completed');
                `
            }
        ]
    },
    {
        name: 'Report Generation Flow',
        id: 'report-generation-flow',
        description: 'Verifies that users can generate reports',
        steps: [
            {
                name: 'Login',
                script: `
                    // Reuse login flow
                    await runFlow('login-flow');
                `
            },
            {
                name: 'Navigate to reports',
                script: `
                    await page.goto('{{baseUrl}}/reports');
                    await page.waitForSelector('#report-list');
                `
            },
            {
                name: 'Create new report',
                script: `
                    await page.click('#create-report');
                    await page.waitForSelector('#report-form');
                    await page.select('#report-type', 'classification-summary');
                    await page.type('#report-name', 'Test Report {{timestamp}}');
                    await page.click('#date-range-picker');
                    await page.click('.calendar-last-30-days');
                    await page.click('#create-report-submit');
                `
            },
            {
                name: 'Wait for report generation',
                script: `
                    await page.waitForSelector('#report-status', { timeout: 60000 });
                    let reportStatus;
                    for (let i = 0; i < 10; i++) {
                        reportStatus = await page.$eval('#report-status', el => el.textContent);
                        if (reportStatus.includes('Completed')) {
                            break;
                        }
                        await page.waitForTimeout(2000);
                        await page.reload();
                        await page.waitForSelector('#report-status');
                    }
                    assert.ok(reportStatus.includes('Completed'), 'Report should be completed');
                `
            },
            {
                name: 'View report',
                script: `
                    await Promise.all([
                        page.click('#view-report'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                    await page.waitForSelector('#report-content');
                    const reportContent = await page.$eval('#report-content', el => el.textContent);
                    assert.ok(reportContent.length > 0, 'Report should have content');
                `
            }
        ]
    }
];

// Define API endpoints to monitor
const API_ENDPOINTS = [
    {
        name: 'Authentication API',
        url: '{{baseUrl}}/api/auth/login',
        method: 'POST',
        body: {
            username: '{{TEST_USERNAME}}',
            password: '{{TEST_PASSWORD}}'
        },
        assertions: [
            'response.status === 200',
            'response.body.token !== undefined',
            'response.time < 1000'
        ]
    },
    {
        name: 'Documents API',
        url: '{{baseUrl}}/api/documents',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer {{AUTH_TOKEN}}'
        },
        assertions: [
            'response.status === 200',
            'Array.isArray(response.body)',
            'response.time < 1000'
        ]
    },
    {
        name: 'Classifications API',
        url: '{{baseUrl}}/api/classifications',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer {{AUTH_TOKEN}}'
        },
        assertions: [
            'response.status === 200',
            'Array.isArray(response.body)',
            'response.time < 1000'
        ]
    },
    {
        name: 'Batches API',
        url: '{{baseUrl}}/api/batches',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer {{AUTH_TOKEN}}'
        },
        assertions: [
            'response.status === 200',
            'Array.isArray(response.body)',
            'response.time < 1000'
        ]
    },
    {
        name: 'Reports API',
        url: '{{baseUrl}}/api/reports',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer {{AUTH_TOKEN}}'
        },
        assertions: [
            'response.status === 200',
            'Array.isArray(response.body)',
            'response.time < 1000'
        ]
    }
];

// Export the configuration
module.exports = {
    config: SYNTHETIC_MONITORING_CONFIG,
    criticalFlows: CRITICAL_FLOWS,
    apiEndpoints: API_ENDPOINTS
};