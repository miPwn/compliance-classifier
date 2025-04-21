/**
 * User Journey Analytics Configuration
 * 
 * This file contains the configuration for tracking user journeys
 * using Google Analytics 4 and custom events.
 */

// Google Analytics 4 Configuration
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 measurement ID

// Initialize Google Analytics
function initializeGA4() {
    // Load the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
        send_page_view: true,
        cookie_domain: 'auto',
        cookie_flags: 'SameSite=None;Secure',
        cookie_expires: 63072000, // 2 years in seconds
        user_id: undefined, // Will be set after user authentication
        custom_map: {
            dimension1: 'user_role',
            dimension2: 'department',
            dimension3: 'journey_id',
            dimension4: 'journey_name',
            dimension5: 'journey_step',
            metric1: 'step_duration'
        }
    });
    
    window.gtag = gtag;
}

// Define key user journeys
const USER_JOURNEYS = {
    DOCUMENT_CLASSIFICATION: {
        id: 'doc_classification',
        name: 'Document Classification',
        steps: [
            'upload_document',
            'initial_classification',
            'review_classification',
            'approve_classification',
            'complete_classification'
        ]
    },
    BATCH_PROCESSING: {
        id: 'batch_processing',
        name: 'Batch Processing',
        steps: [
            'create_batch',
            'add_documents',
            'process_batch',
            'review_batch_results',
            'approve_batch',
            'complete_batch'
        ]
    },
    REPORT_GENERATION: {
        id: 'report_generation',
        name: 'Report Generation',
        steps: [
            'select_report_type',
            'configure_report',
            'generate_report',
            'view_report',
            'export_report'
        ]
    }
};

// Track journey step
function trackJourneyStep(journeyId, stepName, additionalParams = {}) {
    if (!window.gtag) return;
    
    // Find the journey
    let journeyName = '';
    for (const key in USER_JOURNEYS) {
        if (USER_JOURNEYS[key].id === journeyId) {
            journeyName = USER_JOURNEYS[key].name;
            break;
        }
    }
    
    // Track the step
    window.gtag('event', 'journey_step', {
        journey_id: journeyId,
        journey_name: journeyName,
        journey_step: stepName,
        ...additionalParams
    });
}

// Track journey completion
function trackJourneyCompletion(journeyId, durationSeconds, additionalParams = {}) {
    if (!window.gtag) return;
    
    // Find the journey
    let journeyName = '';
    for (const key in USER_JOURNEYS) {
        if (USER_JOURNEYS[key].id === journeyId) {
            journeyName = USER_JOURNEYS[key].name;
            break;
        }
    }
    
    // Track completion
    window.gtag('event', 'journey_complete', {
        journey_id: journeyId,
        journey_name: journeyName,
        duration: durationSeconds,
        ...additionalParams
    });
}

// Set user properties after authentication
function setUserProperties(userId, userRole, department) {
    if (!window.gtag) return;
    
    // Set user ID
    window.gtag('config', GA4_MEASUREMENT_ID, {
        user_id: userId
    });
    
    // Set user properties
    window.gtag('set', 'user_properties', {
        user_role: userRole,
        department: department
    });
}

// Track page view with additional context
function trackPageView(pagePath, pageTitle, additionalParams = {}) {
    if (!window.gtag) return;
    
    window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
        ...additionalParams
    });
}

// Track user interaction events
function trackInteraction(eventName, eventParams = {}) {
    if (!window.gtag) return;
    
    window.gtag('event', eventName, eventParams);
}

// Export the functions
window.userJourneyAnalytics = {
    initialize: initializeGA4,
    trackJourneyStep,
    trackJourneyCompletion,
    setUserProperties,
    trackPageView,
    trackInteraction,
    JOURNEYS: USER_JOURNEYS
};