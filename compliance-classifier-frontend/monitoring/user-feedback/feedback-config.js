/**
 * User Feedback Collection Configuration
 * 
 * This file contains the configuration for collecting user feedback
 * through various mechanisms.
 */

// Feedback Collection Configuration
const FEEDBACK_CONFIG = {
    // API endpoint for submitting feedback
    apiEndpoint: '/api/feedback',
    
    // Feedback types
    types: [
        {
            id: 'general',
            label: 'General Feedback',
            description: 'Share your thoughts about the application',
            icon: 'pi pi-comments'
        },
        {
            id: 'bug',
            label: 'Bug Report',
            description: 'Report an issue or error',
            icon: 'pi pi-exclamation-triangle'
        },
        {
            id: 'feature',
            label: 'Feature Request',
            description: 'Suggest a new feature or improvement',
            icon: 'pi pi-plus-circle'
        },
        {
            id: 'usability',
            label: 'Usability Issue',
            description: 'Report a usability problem',
            icon: 'pi pi-user'
        }
    ],
    
    // Feedback triggers
    triggers: {
        // Trigger feedback dialog after completing key actions
        actions: [
            {
                action: 'document-classification-complete',
                delay: 2000, // ms
                probability: 0.3 // 30% chance
            },
            {
                action: 'batch-processing-complete',
                delay: 2000, // ms
                probability: 0.5 // 50% chance
            },
            {
                action: 'report-generation-complete',
                delay: 2000, // ms
                probability: 0.3 // 30% chance
            }
        ],
        
        // Trigger feedback dialog after spending time on specific pages
        pages: [
            {
                path: '/dashboard',
                minTimeOnPage: 120000, // 2 minutes
                probability: 0.2 // 20% chance
            },
            {
                path: '/documents',
                minTimeOnPage: 180000, // 3 minutes
                probability: 0.2 // 20% chance
            },
            {
                path: '/classifications',
                minTimeOnPage: 180000, // 3 minutes
                probability: 0.2 // 20% chance
            }
        ],
        
        // Trigger feedback dialog after a certain number of visits
        visits: {
            count: 5,
            probability: 0.5 // 50% chance
        },
        
        // Trigger feedback dialog when user is about to leave the application
        exitIntent: {
            enabled: true,
            probability: 0.3, // 30% chance
            excludePaths: ['/login', '/logout', '/register']
        }
    },
    
    // NPS (Net Promoter Score) survey configuration
    nps: {
        // API endpoint for submitting NPS
        apiEndpoint: '/api/feedback/nps',
        
        // Trigger NPS survey after a certain number of days
        daysAfterFirstVisit: 14,
        
        // Trigger NPS survey after a certain number of sessions
        sessionsBeforeTrigger: 5,
        
        // Minimum time between NPS surveys (in days)
        minDaysBetweenSurveys: 90,
        
        // Follow-up questions based on score
        followUpQuestions: {
            // Detractors (0-6)
            detractor: 'What could we improve to better meet your needs?',
            
            // Passives (7-8)
            passive: 'What would it take for you to give us a higher score?',
            
            // Promoters (9-10)
            promoter: 'What do you like most about our application?'
        }
    },
    
    // Feature request configuration
    featureRequests: {
        // API endpoint for submitting feature requests
        apiEndpoint: '/api/feedback/feature-requests',
        
        // Allow upvoting existing feature requests
        allowUpvoting: true,
        
        // Allow commenting on feature requests
        allowComments: true,
        
        // Categories for feature requests
        categories: [
            {
                id: 'ui',
                label: 'User Interface',
                description: 'Improvements to the user interface'
            },
            {
                id: 'workflow',
                label: 'Workflow',
                description: 'Improvements to the workflow'
            },
            {
                id: 'reporting',
                label: 'Reporting',
                description: 'Improvements to reporting capabilities'
            },
            {
                id: 'integration',
                label: 'Integration',
                description: 'Integration with other systems'
            },
            {
                id: 'other',
                label: 'Other',
                description: 'Other feature requests'
            }
        ]
    },
    
    // Bug report configuration
    bugReports: {
        // API endpoint for submitting bug reports
        apiEndpoint: '/api/feedback/bug-reports',
        
        // Automatically collect system information
        collectSystemInfo: true,
        
        // Allow attaching screenshots
        allowScreenshots: true,
        
        // Allow attaching console logs
        allowConsoleLogs: true,
        
        // Severity levels
        severityLevels: [
            {
                id: 'critical',
                label: 'Critical',
                description: 'Application is unusable'
            },
            {
                id: 'high',
                label: 'High',
                description: 'Major functionality is impacted'
            },
            {
                id: 'medium',
                label: 'Medium',
                description: 'Some functionality is impacted'
            },
            {
                id: 'low',
                label: 'Low',
                description: 'Minor issue with minimal impact'
            }
        ]
    },
    
    // In-app survey configuration
    surveys: {
        // API endpoint for submitting survey responses
        apiEndpoint: '/api/feedback/surveys',
        
        // Survey types
        types: [
            {
                id: 'satisfaction',
                label: 'Satisfaction Survey',
                description: 'Rate your satisfaction with the application'
            },
            {
                id: 'usability',
                label: 'Usability Survey',
                description: 'Rate the usability of the application'
            },
            {
                id: 'feature',
                label: 'Feature Survey',
                description: 'Rate a specific feature'
            }
        ]
    }
};

// Initialize feedback collection
function initializeFeedback() {
    // Track page visits
    trackPageVisit();
    
    // Set up exit intent detection
    if (FEEDBACK_CONFIG.triggers.exitIntent.enabled) {
        setupExitIntentDetection();
    }
    
    // Check if NPS survey should be shown
    checkNpsSurvey();
    
    // Set up action triggers
    setupActionTriggers();
    
    console.log('Feedback collection initialized');
}

// Track page visit
function trackPageVisit() {
    const currentPath = window.location.pathname;
    
    // Check if we should trigger feedback based on page
    FEEDBACK_CONFIG.triggers.pages.forEach(page => {
        if (page.path === currentPath) {
            // Start timer for minimum time on page
            setTimeout(() => {
                if (Math.random() < page.probability) {
                    showFeedbackDialog('general');
                }
            }, page.minTimeOnPage);
        }
    });
    
    // Increment visit count in local storage
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', visitCount.toString());
    
    // Check if we should trigger feedback based on visit count
    if (visitCount === FEEDBACK_CONFIG.triggers.visits.count) {
        if (Math.random() < FEEDBACK_CONFIG.triggers.visits.probability) {
            showFeedbackDialog('general');
        }
    }
}

// Set up exit intent detection
function setupExitIntentDetection() {
    document.addEventListener('mouseleave', event => {
        // Only trigger if mouse leaves at the top of the page
        if (event.clientY < 0) {
            const currentPath = window.location.pathname;
            
            // Check if current path is excluded
            if (FEEDBACK_CONFIG.triggers.exitIntent.excludePaths.includes(currentPath)) {
                return;
            }
            
            // Check probability
            if (Math.random() < FEEDBACK_CONFIG.triggers.exitIntent.probability) {
                showFeedbackDialog('general');
            }
        }
    });
}

// Check if NPS survey should be shown
function checkNpsSurvey() {
    // Check if user has completed enough sessions
    const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0') + 1;
    localStorage.setItem('sessionCount', sessionCount.toString());
    
    if (sessionCount < FEEDBACK_CONFIG.nps.sessionsBeforeTrigger) {
        return;
    }
    
    // Check if enough days have passed since first visit
    const firstVisitDate = localStorage.getItem('firstVisitDate');
    if (!firstVisitDate) {
        localStorage.setItem('firstVisitDate', new Date().toISOString());
        return;
    }
    
    const daysSinceFirstVisit = Math.floor((new Date() - new Date(firstVisitDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceFirstVisit < FEEDBACK_CONFIG.nps.daysAfterFirstVisit) {
        return;
    }
    
    // Check if enough days have passed since last NPS survey
    const lastNpsSurveyDate = localStorage.getItem('lastNpsSurveyDate');
    if (lastNpsSurveyDate) {
        const daysSinceLastSurvey = Math.floor((new Date() - new Date(lastNpsSurveyDate)) / (1000 * 60 * 60 * 24));
        if (daysSinceLastSurvey < FEEDBACK_CONFIG.nps.minDaysBetweenSurveys) {
            return;
        }
    }
    
    // Show NPS survey
    showNpsSurvey();
}

// Set up action triggers
function setupActionTriggers() {
    // This function would be called by the application when specific actions are completed
    window.triggerFeedbackOnAction = function(actionId) {
        const trigger = FEEDBACK_CONFIG.triggers.actions.find(t => t.action === actionId);
        if (trigger) {
            setTimeout(() => {
                if (Math.random() < trigger.probability) {
                    showFeedbackDialog('general');
                }
            }, trigger.delay);
        }
    };
}

// Show feedback dialog
function showFeedbackDialog(type) {
    // This function would be implemented by the application
    // It would show a dialog for collecting feedback
    console.log(`Showing feedback dialog for type: ${type}`);
    
    // Example implementation:
    if (window.PrimeDialog) {
        window.PrimeDialog.open('feedbackDialog', {
            data: {
                type: type
            }
        });
    }
}

// Show NPS survey
function showNpsSurvey() {
    // This function would be implemented by the application
    // It would show the NPS survey
    console.log('Showing NPS survey');
    
    // Example implementation:
    if (window.PrimeDialog) {
        window.PrimeDialog.open('npsSurvey');
    }
    
    // Update last NPS survey date
    localStorage.setItem('lastNpsSurveyDate', new Date().toISOString());
}

// Submit general feedback
function submitFeedback(data) {
    return fetch(FEEDBACK_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json());
}

// Submit NPS survey
function submitNpsSurvey(data) {
    return fetch(FEEDBACK_CONFIG.nps.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json());
}

// Submit feature request
function submitFeatureRequest(data) {
    return fetch(FEEDBACK_CONFIG.featureRequests.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json());
}

// Submit bug report
function submitBugReport(data) {
    // Collect system information if enabled
    if (FEEDBACK_CONFIG.bugReports.collectSystemInfo) {
        data.systemInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer
        };
    }
    
    return fetch(FEEDBACK_CONFIG.bugReports.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json());
}

// Submit survey response
function submitSurvey(data) {
    return fetch(FEEDBACK_CONFIG.surveys.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json());
}

// Export the functions and configuration
window.feedbackCollection = {
    initialize: initializeFeedback,
    showFeedbackDialog,
    showNpsSurvey,
    submitFeedback,
    submitNpsSurvey,
    submitFeatureRequest,
    submitBugReport,
    submitSurvey,
    triggerFeedbackOnAction: window.triggerFeedbackOnAction,
    config: FEEDBACK_CONFIG
};