/**
 * Session Recording Configuration
 * 
 * This file contains the configuration for Hotjar session recording.
 * It should be included in the index.html file.
 */

// Hotjar Tracking Code
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid: "HOTJAR_ID", hjsv: 6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

// Configuration settings
window.hjSiteSettings = {
    // Privacy settings
    privacy: {
        maskAllInputs: true,
        maskTextInputs: true,
        suppressCookieBanner: false,
        recordKeystrokes: false,
        anonymizeIp: true
    },
    
    // Recording settings
    recording: {
        captureResolution: true,
        recordCrossDomain: true,
        recordCanvas: false,
        recordFonts: true,
        recordCssRules: true,
        recordConsole: false,
        recordPerformance: true,
        recordErrors: true,
        recordAjaxRequests: true
    },
    
    // Sampling settings
    sampling: {
        sampleRate: 10, // Record 10% of sessions
        targetPages: [
            '/dashboard',
            '/documents',
            '/batches',
            '/classification',
            '/reports'
        ]
    },
    
    // Data retention
    dataRetention: {
        retentionPeriod: 30 // days
    }
};

// Identify user (should be called after user logs in)
function identifyUser(userId, userRole, department) {
    if (window.hj) {
        window.hj('identify', userId, {
            role: userRole,
            department: department
        });
    }
}

// Tag recordings with specific events
function tagRecording(tagName, tagValue) {
    if (window.hj) {
        window.hj('event', tagName, {value: tagValue});
    }
}

// Suppress recording on sensitive pages
function suppressRecording() {
    if (window.hj) {
        window.hj('recording', 'suppress');
    }
}

// Resume recording
function resumeRecording() {
    if (window.hj) {
        window.hj('recording', 'resume');
    }
}