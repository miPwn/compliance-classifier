/**
 * Real User Monitoring (RUM) Configuration
 * 
 * This file contains the configuration for Real User Monitoring
 * using New Relic Browser.
 */

// New Relic Configuration
const NEW_RELIC_ACCOUNT_ID = 'YOUR_NR_ACCOUNT_ID'; // Replace with actual account ID
const NEW_RELIC_APPLICATION_ID = 'YOUR_NR_APP_ID'; // Replace with actual application ID
const NEW_RELIC_LICENSE_KEY = 'YOUR_NR_LICENSE_KEY'; // Replace with actual license key

// Initialize New Relic Browser
function initializeNewRelic() {
    window.NREUM || (NREUM = {});
    NREUM.init = {
        distributed_tracing: {
            enabled: true,
            exclude_newrelic_header: false,
            cors_use_newrelic_header: false,
            cors_use_tracecontext_headers: true,
            allowed_origins: ['*']
        },
        privacy: {
            cookies_enabled: true
        },
        ajax: {
            deny_list: ["bam.nr-data.net"]
        },
        session_trace: {
            enabled: true
        },
        session_replay: {
            enabled: true,
            mask_all_inputs: true,
            mask_text: true
        },
        page_view_timing: {
            enabled: true
        },
        spa: {
            enabled: true,
            harvestTimeSeconds: 10
        }
    };
    
    // Load New Relic script
    const script = document.createElement('script');
    script.src = `https://js-agent.newrelic.com/nr-spa-${NEW_RELIC_ACCOUNT_ID}.min.js`;
    script.async = true;
    document.head.appendChild(script);
}

// Custom attribute configuration
const CUSTOM_ATTRIBUTES = {
    // User attributes
    user: [
        'userId',
        'userRole',
        'department'
    ],
    
    // Application attributes
    application: [
        'version',
        'environment',
        'buildId'
    ],
    
    // Page attributes
    page: [
        'pageType',
        'pageCategory',
        'pageId'
    ]
};

// Set custom attributes
function setCustomAttributes(attributeType, attributes) {
    if (!window.newrelic) {
        console.error('New Relic not initialized');
        return;
    }
    
    // Validate attribute type
    if (!CUSTOM_ATTRIBUTES[attributeType]) {
        console.error(`Unknown attribute type: ${attributeType}`);
        return;
    }
    
    // Filter attributes to only include allowed ones
    const allowedAttributes = {};
    for (const key in attributes) {
        if (CUSTOM_ATTRIBUTES[attributeType].includes(key)) {
            allowedAttributes[key] = attributes[key];
        }
    }
    
    // Set attributes
    window.newrelic.setCustomAttributes(allowedAttributes);
}

// Track page view with additional data
function trackPageView(pageName, pageUrl, attributes = {}) {
    if (!window.newrelic) {
        console.error('New Relic not initialized');
        return;
    }
    
    window.newrelic.setPageViewName(pageName);
    window.newrelic.setCustomAttributes({
        pageUrl,
        ...attributes
    });
}

// Track AJAX request timing
function trackAjaxRequest(url, method, status, duration, attributes = {}) {
    if (!window.newrelic) {
        console.error('New Relic not initialized');
        return;
    }
    
    window.newrelic.addPageAction('ajaxRequest', {
        url,
        method,
        status,
        duration,
        ...attributes
    });
}

// Track custom interaction
function trackInteraction(actionName, attributes = {}) {
    if (!window.newrelic) {
        console.error('New Relic not initialized');
        return;
    }
    
    window.newrelic.addPageAction(actionName, attributes);
}

// Track error
function trackError(error, attributes = {}) {
    if (!window.newrelic) {
        console.error('New Relic not initialized');
        return;
    }
    
    window.newrelic.noticeError(error, attributes);
}

// Set user information
function setUserInfo(userId, userRole, department) {
    setCustomAttributes('user', {
        userId,
        userRole,
        department
    });
}

// Set application information
function setApplicationInfo(version, environment, buildId) {
    setCustomAttributes('application', {
        version,
        environment,
        buildId
    });
}

// Export the functions
window.rumMonitoring = {
    initialize: initializeNewRelic,
    setCustomAttributes,
    trackPageView,
    trackAjaxRequest,
    trackInteraction,
    trackError,
    setUserInfo,
    setApplicationInfo
};