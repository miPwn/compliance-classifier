/**
 * Core Web Vitals Monitoring Configuration
 * 
 * This file contains the configuration for monitoring Core Web Vitals
 * using the web-vitals library.
 */

// Import web-vitals library
// Note: This assumes the web-vitals library is included in the project
// npm install web-vitals --save

// Configuration
const WEB_VITALS_CONFIG = {
    // Reporting endpoints
    reportEndpoint: '/api/metrics/web-vitals',
    
    // Reporting thresholds (in milliseconds, except for CLS which is unitless)
    thresholds: {
        LCP: {
            good: 2500,    // 2.5s
            poor: 4000     // 4s
        },
        FID: {
            good: 100,     // 100ms
            poor: 300      // 300ms
        },
        CLS: {
            good: 0.1,     // 0.1
            poor: 0.25     // 0.25
        },
        FCP: {
            good: 1800,    // 1.8s
            poor: 3000     // 3s
        },
        TTFB: {
            good: 800,     // 800ms
            poor: 1800     // 1.8s
        }
    },
    
    // Sampling rate (0-1)
    samplingRate: 1.0,
    
    // Debug mode
    debug: false
};

// Initialize Web Vitals monitoring
function initWebVitals() {
    if (typeof webVitals === 'undefined') {
        console.error('web-vitals library not loaded');
        return;
    }
    
    // Only measure in production
    if (window.location.hostname === 'localhost' && !WEB_VITALS_CONFIG.debug) {
        console.log('Web Vitals monitoring disabled in development');
        return;
    }
    
    // Apply sampling
    if (Math.random() > WEB_VITALS_CONFIG.samplingRate) {
        return;
    }
    
    // Get user and session information
    const userId = window.currentUser?.id || 'anonymous';
    const sessionId = window.sessionId || generateSessionId();
    
    // Generate a session ID if not available
    function generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // Create the metric handler
    const reportWebVitals = ({ name, delta, id, navigationType }) => {
        // Determine rating based on thresholds
        let rating = 'good';
        if (WEB_VITALS_CONFIG.thresholds[name]) {
            const thresholds = WEB_VITALS_CONFIG.thresholds[name];
            if (delta >= thresholds.poor) {
                rating = 'poor';
            } else if (delta >= thresholds.good) {
                rating = 'needs-improvement';
            }
        }
        
        // Prepare the metric data
        const metricData = {
            name,
            id,
            delta,
            value: delta,
            rating,
            navigationType: navigationType || 'navigate',
            timestamp: new Date().getTime(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId,
            sessionId,
            // Add additional context
            deviceType: getDeviceType(),
            connectionType: getConnectionType(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        // Log to console in debug mode
        if (WEB_VITALS_CONFIG.debug) {
            console.log('[Web Vitals]', name, Math.round(delta), rating);
            console.log(metricData);
        }
        
        // Send to analytics
        if (window.gtag) {
            window.gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: name,
                value: Math.round(delta),
                non_interaction: true,
                metric_id: id,
                metric_value: delta,
                metric_rating: rating
            });
        }
        
        // Send to New Relic if available
        if (window.newrelic) {
            window.newrelic.addPageAction('web-vitals', metricData);
        }
        
        // Send to custom endpoint
        if (WEB_VITALS_CONFIG.reportEndpoint) {
            try {
                const blob = new Blob([JSON.stringify(metricData)], { type: 'application/json' });
                // Use sendBeacon for better reliability during page unload
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(WEB_VITALS_CONFIG.reportEndpoint, blob);
                } else {
                    fetch(WEB_VITALS_CONFIG.reportEndpoint, {
                        method: 'POST',
                        body: blob,
                        keepalive: true
                    });
                }
            } catch (e) {
                console.error('[Web Vitals] Error sending metric:', e);
            }
        }
    };
    
    // Helper function to determine device type
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }
    
    // Helper function to get connection type
    function getConnectionType() {
        if (navigator.connection) {
            return navigator.connection.effectiveType || 'unknown';
        }
        return 'unknown';
    }
    
    // Register metrics
    webVitals.getCLS(reportWebVitals);
    webVitals.getFID(reportWebVitals);
    webVitals.getLCP(reportWebVitals);
    webVitals.getFCP(reportWebVitals);
    webVitals.getTTFB(reportWebVitals);
    
    // Store session ID
    window.sessionId = sessionId;
    
    // Return the reporter function for custom metrics
    return reportWebVitals;
}

// Export the functions
window.webVitalsMonitoring = {
    initialize: initWebVitals,
    config: WEB_VITALS_CONFIG
};