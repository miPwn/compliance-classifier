/**
 * A/B Testing Configuration
 * 
 * This file contains the configuration for A/B testing using LaunchDarkly.
 * It defines feature flags, test variants, and metrics collection.
 */

// LaunchDarkly Configuration
const LAUNCHDARKLY_CLIENT_ID = 'YOUR_LAUNCHDARKLY_CLIENT_ID'; // Replace with actual client ID

// Initialize LaunchDarkly
function initializeLaunchDarkly(user) {
    if (!window.LDClient) {
        console.error('LaunchDarkly client not loaded');
        return null;
    }
    
    // Default user object if none provided
    const defaultUser = {
        key: 'anonymous',
        anonymous: true
    };
    
    // Merge with provided user or use default
    const ldUser = user || defaultUser;
    
    // Initialize the client
    const ldClient = window.LDClient.initialize(LAUNCHDARKLY_CLIENT_ID, ldUser);
    
    // Store client in window for global access
    window.ldClient = ldClient;
    
    return ldClient;
}

// Update user after authentication
function updateUser(userId, userAttributes = {}) {
    if (!window.ldClient) {
        console.error('LaunchDarkly client not initialized');
        return;
    }
    
    const user = {
        key: userId,
        anonymous: false,
        ...userAttributes
    };
    
    window.ldClient.identify(user);
}

// Get variation for a feature flag
function getVariation(flagKey, defaultValue) {
    if (!window.ldClient) {
        console.error('LaunchDarkly client not initialized');
        return defaultValue;
    }
    
    return window.ldClient.variation(flagKey, defaultValue);
}

// Track custom event for A/B test metrics
function trackEvent(eventName, eventData = {}) {
    if (!window.ldClient) {
        console.error('LaunchDarkly client not initialized');
        return;
    }
    
    window.ldClient.track(eventName, eventData);
}

// A/B Test Definitions
const AB_TESTS = {
    // New document upload interface test
    DOCUMENT_UPLOAD_UI: {
        flagKey: 'document-upload-ui',
        variants: {
            control: 'original',
            treatment: 'new-ui'
        },
        metrics: [
            'upload_success_rate',
            'time_to_upload',
            'user_satisfaction'
        ]
    },
    
    // Classification review workflow test
    CLASSIFICATION_REVIEW: {
        flagKey: 'classification-review-workflow',
        variants: {
            control: 'standard',
            treatmentA: 'simplified',
            treatmentB: 'detailed'
        },
        metrics: [
            'review_completion_rate',
            'time_to_review',
            'correction_rate',
            'user_satisfaction'
        ]
    },
    
    // Dashboard layout test
    DASHBOARD_LAYOUT: {
        flagKey: 'dashboard-layout',
        variants: {
            control: 'classic',
            treatment: 'card-based'
        },
        metrics: [
            'feature_usage',
            'time_on_page',
            'navigation_patterns',
            'user_satisfaction'
        ]
    },
    
    // Batch processing wizard test
    BATCH_WIZARD: {
        flagKey: 'batch-processing-wizard',
        variants: {
            control: 'multi-page',
            treatment: 'single-page'
        },
        metrics: [
            'completion_rate',
            'time_to_complete',
            'error_rate',
            'user_satisfaction'
        ]
    }
};

// Track metric for an A/B test
function trackTestMetric(testKey, metricName, value = 1, additionalData = {}) {
    if (!AB_TESTS[testKey]) {
        console.error(`Unknown A/B test: ${testKey}`);
        return;
    }
    
    const test = AB_TESTS[testKey];
    const eventName = `${test.flagKey}:${metricName}`;
    
    trackEvent(eventName, {
        value,
        testKey,
        metricName,
        ...additionalData
    });
}

// Check if user is in a specific test variant
function isInVariant(testKey, variantName) {
    if (!AB_TESTS[testKey]) {
        console.error(`Unknown A/B test: ${testKey}`);
        return false;
    }
    
    const test = AB_TESTS[testKey];
    const variant = getVariation(test.flagKey, null);
    
    return variant === test.variants[variantName];
}

// Get current variant for a test
function getCurrentVariant(testKey) {
    if (!AB_TESTS[testKey]) {
        console.error(`Unknown A/B test: ${testKey}`);
        return null;
    }
    
    const test = AB_TESTS[testKey];
    return getVariation(test.flagKey, null);
}

// Export the functions
window.abTesting = {
    initialize: initializeLaunchDarkly,
    updateUser,
    getVariation,
    trackEvent,
    trackTestMetric,
    isInVariant,
    getCurrentVariant,
    TESTS: AB_TESTS
};