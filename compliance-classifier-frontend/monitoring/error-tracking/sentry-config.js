/**
 * Error Tracking Configuration
 * 
 * This file contains the configuration for error tracking
 * using Sentry.
 */

// Sentry Configuration
const SENTRY_CONFIG = {
    dsn: 'https://YOUR_SENTRY_DSN@o000000.ingest.sentry.io/0000000',
    environment: 'production', // Will be replaced with actual environment
    release: 'compliance-classifier@1.0.0', // Will be replaced with actual version
    tracesSampleRate: 0.2, // Sample 20% of transactions
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions for replays
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    maxBreadcrumbs: 100,
    attachStacktrace: true,
    debug: false,
    integrations: [
        'BrowserTracing',
        'Replay',
        'Angular'
    ],
    ignoreErrors: [
        // Ignore network errors
        'Network request failed',
        'Failed to fetch',
        'NetworkError',
        'ChunkLoadError',
        // Ignore third-party script errors
        /^Script error\.?$/,
        /^Javascript error: Script error\.? on line 0$/,
        // Ignore errors from browser extensions
        /^Extension context invalidated$/,
        /^ResizeObserver loop limit exceeded$/
    ],
    denyUrls: [
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Firefox extensions
        /^moz-extension:\/\//i,
        // Safari extensions
        /^safari-extension:\/\//i
    ]
};

// Initialize Sentry
function initializeSentry(environment, release, user = null) {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return;
    }
    
    // Update config with environment and release
    const config = {
        ...SENTRY_CONFIG,
        environment: environment || SENTRY_CONFIG.environment,
        release: release || SENTRY_CONFIG.release
    };
    
    // Initialize Sentry with config
    Sentry.init(config);
    
    // Set user information if available
    if (user) {
        setUserContext(user);
    }
    
    // Set up Angular error handler
    if (typeof Sentry.Angular !== 'undefined') {
        // This would be used in the Angular module
        console.log('Sentry Angular integration available');
    }
    
    // Return the Sentry instance
    return Sentry;
}

// Set user context
function setUserContext(user) {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return;
    }
    
    Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.username,
        ip_address: '{{auto}}',
        // Additional user information
        role: user.role,
        department: user.department
    });
}

// Set tags for better error categorization
function setTags(tags) {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return;
    }
    
    for (const key in tags) {
        Sentry.setTag(key, tags[key]);
    }
}

// Add breadcrumb for better error context
function addBreadcrumb(category, message, data = {}, level = 'info') {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return;
    }
    
    Sentry.addBreadcrumb({
        category,
        message,
        data,
        level
    });
}

// Capture exception with additional context
function captureException(error, context = {}) {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return;
    }
    
    Sentry.withScope(scope => {
        // Add extra context
        for (const key in context) {
            scope.setExtra(key, context[key]);
        }
        
        // Capture the exception
        Sentry.captureException(error);
    });
}

// Capture message
function captureMessage(message, level = 'info', context = {}) {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return;
    }
    
    Sentry.withScope(scope => {
        // Add extra context
        for (const key in context) {
            scope.setExtra(key, context[key]);
        }
        
        // Set the level
        scope.setLevel(level);
        
        // Capture the message
        Sentry.captureMessage(message);
    });
}

// Start transaction for performance monitoring
function startTransaction(name, op) {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return null;
    }
    
    return Sentry.startTransaction({
        name,
        op
    });
}

// Configure scope with additional context
function configureScope(callback) {
    if (typeof Sentry === 'undefined') {
        console.error('Sentry not loaded');
        return;
    }
    
    Sentry.configureScope(callback);
}

// Create Angular error handler
function createAngularErrorHandler() {
    if (typeof Sentry === 'undefined' || typeof Sentry.Angular === 'undefined') {
        console.error('Sentry Angular integration not available');
        return null;
    }
    
    return Sentry.Angular.createErrorHandler({
        showDialog: true,
        logErrors: true
    });
}

// Create Angular trace service
function createAngularTraceService() {
    if (typeof Sentry === 'undefined' || typeof Sentry.Angular === 'undefined') {
        console.error('Sentry Angular integration not available');
        return null;
    }
    
    return Sentry.Angular.createTraceService();
}

// Create Angular routing instrumentation
function createRoutingInstrumentation() {
    if (typeof Sentry === 'undefined' || typeof Sentry.Angular === 'undefined') {
        console.error('Sentry Angular integration not available');
        return null;
    }
    
    return Sentry.Angular.routingInstrumentation;
}

// Error grouping configuration
const ERROR_GROUPING = {
    // Group by error type and message
    default: {
        enabled: true
    },
    
    // Group by component
    component: {
        enabled: true,
        tagName: 'component'
    },
    
    // Group by feature
    feature: {
        enabled: true,
        tagName: 'feature'
    },
    
    // Group by error type
    errorType: {
        enabled: true,
        tagName: 'error.type'
    }
};

// Error prioritization configuration
const ERROR_PRIORITIZATION = {
    // High priority errors
    high: [
        'AuthenticationError',
        'SecurityError',
        'DataCorruptionError'
    ],
    
    // Medium priority errors
    medium: [
        'ValidationError',
        'NetworkError',
        'TimeoutError'
    ],
    
    // Low priority errors
    low: [
        'UIError',
        'WarningError',
        'DeprecationError'
    ]
};

// Export the functions and configurations
window.errorTracking = {
    initialize: initializeSentry,
    setUserContext,
    setTags,
    addBreadcrumb,
    captureException,
    captureMessage,
    startTransaction,
    configureScope,
    createAngularErrorHandler,
    createAngularTraceService,
    createRoutingInstrumentation,
    config: SENTRY_CONFIG,
    grouping: ERROR_GROUPING,
    prioritization: ERROR_PRIORITIZATION
};