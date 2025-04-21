/**
 * Continuous Improvement Framework Configuration
 * 
 * This file contains the configuration for the continuous improvement
 * framework, including KPIs, reporting, and prioritization.
 */

// KPI Configuration
const KPI_CONFIG = {
    // User Satisfaction KPIs
    userSatisfaction: {
        // Net Promoter Score (NPS)
        nps: {
            id: 'nps',
            name: 'Net Promoter Score',
            description: 'Measures user loyalty and satisfaction',
            target: 50, // Target NPS score
            warning: 30, // Warning threshold
            critical: 0, // Critical threshold
            unit: '',
            higherIsBetter: true,
            source: 'nps-survey',
            calculation: 'percentage of promoters (9-10) minus percentage of detractors (0-6)',
            frequency: 'quarterly',
            owner: 'Product Management'
        },
        
        // Customer Satisfaction Score (CSAT)
        csat: {
            id: 'csat',
            name: 'Customer Satisfaction Score',
            description: 'Measures user satisfaction with specific features',
            target: 4.5, // Target CSAT score (out of 5)
            warning: 3.5, // Warning threshold
            critical: 2.5, // Critical threshold
            unit: 'score',
            higherIsBetter: true,
            source: 'feedback-surveys',
            calculation: 'average of satisfaction ratings (1-5)',
            frequency: 'monthly',
            owner: 'Product Management'
        },
        
        // User Effort Score (UES)
        ues: {
            id: 'ues',
            name: 'User Effort Score',
            description: 'Measures the ease of using the application',
            target: 2, // Target UES score (out of 7, lower is better)
            warning: 4, // Warning threshold
            critical: 5, // Critical threshold
            unit: 'score',
            higherIsBetter: false,
            source: 'feedback-surveys',
            calculation: 'average of effort ratings (1-7)',
            frequency: 'monthly',
            owner: 'UX Team'
        }
    },
    
    // Performance KPIs
    performance: {
        // Page Load Time
        pageLoadTime: {
            id: 'page-load-time',
            name: 'Page Load Time',
            description: 'Time to fully load and render a page',
            target: 2, // Target load time in seconds
            warning: 3, // Warning threshold
            critical: 5, // Critical threshold
            unit: 'seconds',
            higherIsBetter: false,
            source: 'rum-metrics',
            calculation: 'average page load time across all users',
            frequency: 'daily',
            owner: 'Frontend Development'
        },
        
        // Time to Interactive
        timeToInteractive: {
            id: 'time-to-interactive',
            name: 'Time to Interactive',
            description: 'Time until the page is fully interactive',
            target: 3, // Target time in seconds
            warning: 5, // Warning threshold
            critical: 8, // Critical threshold
            unit: 'seconds',
            higherIsBetter: false,
            source: 'web-vitals',
            calculation: 'average time to interactive across all users',
            frequency: 'daily',
            owner: 'Frontend Development'
        },
        
        // API Response Time
        apiResponseTime: {
            id: 'api-response-time',
            name: 'API Response Time',
            description: 'Time for API endpoints to respond',
            target: 0.3, // Target time in seconds
            warning: 1, // Warning threshold
            critical: 2, // Critical threshold
            unit: 'seconds',
            higherIsBetter: false,
            source: 'rum-metrics',
            calculation: 'average API response time across all endpoints',
            frequency: 'daily',
            owner: 'Backend Development'
        },
        
        // First Contentful Paint
        firstContentfulPaint: {
            id: 'first-contentful-paint',
            name: 'First Contentful Paint',
            description: 'Time until the first content is painted',
            target: 1.5, // Target time in seconds
            warning: 2.5, // Warning threshold
            critical: 4, // Critical threshold
            unit: 'seconds',
            higherIsBetter: false,
            source: 'web-vitals',
            calculation: 'average FCP across all users',
            frequency: 'daily',
            owner: 'Frontend Development'
        },
        
        // Largest Contentful Paint
        largestContentfulPaint: {
            id: 'largest-contentful-paint',
            name: 'Largest Contentful Paint',
            description: 'Time until the largest content element is painted',
            target: 2.5, // Target time in seconds
            warning: 4, // Warning threshold
            critical: 6, // Critical threshold
            unit: 'seconds',
            higherIsBetter: false,
            source: 'web-vitals',
            calculation: 'average LCP across all users',
            frequency: 'daily',
            owner: 'Frontend Development'
        }
    },
    
    // Reliability KPIs
    reliability: {
        // Error Rate
        errorRate: {
            id: 'error-rate',
            name: 'Error Rate',
            description: 'Percentage of requests that result in errors',
            target: 0.1, // Target error rate (0.1%)
            warning: 1, // Warning threshold (1%)
            critical: 5, // Critical threshold (5%)
            unit: '%',
            higherIsBetter: false,
            source: 'error-tracking',
            calculation: 'percentage of requests that result in errors',
            frequency: 'daily',
            owner: 'QA Team'
        },
        
        // Crash Rate
        crashRate: {
            id: 'crash-rate',
            name: 'Crash Rate',
            description: 'Percentage of sessions that experience a crash',
            target: 0.05, // Target crash rate (0.05%)
            warning: 0.5, // Warning threshold (0.5%)
            critical: 2, // Critical threshold (2%)
            unit: '%',
            higherIsBetter: false,
            source: 'error-tracking',
            calculation: 'percentage of sessions that experience a crash',
            frequency: 'daily',
            owner: 'QA Team'
        },
        
        // Uptime
        uptime: {
            id: 'uptime',
            name: 'Uptime',
            description: 'Percentage of time the application is available',
            target: 99.9, // Target uptime (99.9%)
            warning: 99.5, // Warning threshold (99.5%)
            critical: 99, // Critical threshold (99%)
            unit: '%',
            higherIsBetter: true,
            source: 'synthetic-monitoring',
            calculation: 'percentage of successful synthetic monitoring checks',
            frequency: 'daily',
            owner: 'DevOps'
        }
    },
    
    // Engagement KPIs
    engagement: {
        // Active Users
        activeUsers: {
            id: 'active-users',
            name: 'Active Users',
            description: 'Number of users who use the application regularly',
            target: 1000, // Target number of active users
            warning: 800, // Warning threshold
            critical: 500, // Critical threshold
            unit: 'users',
            higherIsBetter: true,
            source: 'analytics',
            calculation: 'count of users who have used the application in the last 30 days',
            frequency: 'monthly',
            owner: 'Product Management'
        },
        
        // Session Duration
        sessionDuration: {
            id: 'session-duration',
            name: 'Session Duration',
            description: 'Average time users spend in the application per session',
            target: 15, // Target duration in minutes
            warning: 10, // Warning threshold
            critical: 5, // Critical threshold
            unit: 'minutes',
            higherIsBetter: true,
            source: 'analytics',
            calculation: 'average session duration across all users',
            frequency: 'weekly',
            owner: 'Product Management'
        },
        
        // Feature Usage
        featureUsage: {
            id: 'feature-usage',
            name: 'Feature Usage',
            description: 'Percentage of users who use key features',
            target: 80, // Target usage percentage
            warning: 60, // Warning threshold
            critical: 40, // Critical threshold
            unit: '%',
            higherIsBetter: true,
            source: 'analytics',
            calculation: 'percentage of users who use key features',
            frequency: 'monthly',
            owner: 'Product Management'
        }
    },
    
    // Efficiency KPIs
    efficiency: {
        // Task Completion Rate
        taskCompletionRate: {
            id: 'task-completion-rate',
            name: 'Task Completion Rate',
            description: 'Percentage of started tasks that are completed',
            target: 90, // Target completion rate
            warning: 70, // Warning threshold
            critical: 50, // Critical threshold
            unit: '%',
            higherIsBetter: true,
            source: 'analytics',
            calculation: 'percentage of started tasks that are completed',
            frequency: 'weekly',
            owner: 'UX Team'
        },
        
        // Time to Complete Key Tasks
        timeToCompleteKeyTasks: {
            id: 'time-to-complete-key-tasks',
            name: 'Time to Complete Key Tasks',
            description: 'Average time to complete key tasks',
            target: 120, // Target time in seconds
            warning: 180, // Warning threshold
            critical: 300, // Critical threshold
            unit: 'seconds',
            higherIsBetter: false,
            source: 'analytics',
            calculation: 'average time to complete key tasks',
            frequency: 'weekly',
            owner: 'UX Team'
        },
        
        // Error Correction Rate
        errorCorrectionRate: {
            id: 'error-correction-rate',
            name: 'Error Correction Rate',
            description: 'Percentage of user errors that are successfully corrected',
            target: 95, // Target correction rate
            warning: 85, // Warning threshold
            critical: 70, // Critical threshold
            unit: '%',
            higherIsBetter: true,
            source: 'analytics',
            calculation: 'percentage of user errors that are successfully corrected',
            frequency: 'monthly',
            owner: 'UX Team'
        }
    }
};

// Reporting Configuration
const REPORTING_CONFIG = {
    // Daily reports
    daily: {
        name: 'Daily Performance Report',
        description: 'Daily report of key performance metrics',
        metrics: [
            'page-load-time',
            'api-response-time',
            'error-rate',
            'uptime'
        ],
        recipients: [
            'dev-team@example.com',
            'qa-team@example.com'
        ],
        format: 'email',
        time: '08:00',
        timezone: 'UTC'
    },
    
    // Weekly reports
    weekly: {
        name: 'Weekly Performance and Engagement Report',
        description: 'Weekly report of performance and engagement metrics',
        metrics: [
            'page-load-time',
            'api-response-time',
            'error-rate',
            'uptime',
            'session-duration',
            'task-completion-rate',
            'time-to-complete-key-tasks'
        ],
        recipients: [
            'dev-team@example.com',
            'qa-team@example.com',
            'product-team@example.com'
        ],
        format: 'email',
        day: 'Monday',
        time: '09:00',
        timezone: 'UTC'
    },
    
    // Monthly reports
    monthly: {
        name: 'Monthly KPI Report',
        description: 'Monthly report of all KPIs',
        metrics: 'all',
        recipients: [
            'dev-team@example.com',
            'qa-team@example.com',
            'product-team@example.com',
            'management@example.com'
        ],
        format: 'email',
        day: 1, // First day of the month
        time: '10:00',
        timezone: 'UTC'
    },
    
    // Quarterly reports
    quarterly: {
        name: 'Quarterly Business Review',
        description: 'Quarterly review of all KPIs and business metrics',
        metrics: 'all',
        recipients: [
            'dev-team@example.com',
            'qa-team@example.com',
            'product-team@example.com',
            'management@example.com',
            'executives@example.com'
        ],
        format: 'presentation',
        months: [1, 4, 7, 10], // January, April, July, October
        day: 15, // 15th day of the month
        time: '14:00',
        timezone: 'UTC'
    }
};

// Review Process Configuration
const REVIEW_PROCESS_CONFIG = {
    // Daily review
    daily: {
        name: 'Daily Stand-up',
        description: 'Daily review of key metrics and issues',
        participants: [
            'Development Team',
            'QA Team'
        ],
        agenda: [
            'Review performance metrics',
            'Review error rates',
            'Discuss critical issues',
            'Plan for the day'
        ],
        duration: 15, // minutes
        time: '09:30',
        timezone: 'UTC'
    },
    
    // Weekly review
    weekly: {
        name: 'Weekly Performance Review',
        description: 'Weekly review of performance and issues',
        participants: [
            'Development Team',
            'QA Team',
            'Product Management'
        ],
        agenda: [
            'Review weekly performance metrics',
            'Review user feedback',
            'Discuss open issues',
            'Plan for the week'
        ],
        duration: 60, // minutes
        day: 'Monday',
        time: '14:00',
        timezone: 'UTC'
    },
    
    // Monthly review
    monthly: {
        name: 'Monthly KPI Review',
        description: 'Monthly review of all KPIs',
        participants: [
            'Development Team',
            'QA Team',
            'Product Management',
            'Management'
        ],
        agenda: [
            'Review monthly KPIs',
            'Review user feedback trends',
            'Discuss improvement initiatives',
            'Plan for the month'
        ],
        duration: 90, // minutes
        day: 5, // 5th day of the month
        time: '14:00',
        timezone: 'UTC'
    },
    
    // Quarterly review
    quarterly: {
        name: 'Quarterly Business Review',
        description: 'Quarterly review of all KPIs and business metrics',
        participants: [
            'Development Team',
            'QA Team',
            'Product Management',
            'Management',
            'Executives'
        ],
        agenda: [
            'Review quarterly KPIs',
            'Review user feedback trends',
            'Discuss strategic initiatives',
            'Plan for the quarter'
        ],
        duration: 180, // minutes
        months: [1, 4, 7, 10], // January, April, July, October
        day: 20, // 20th day of the month
        time: '14:00',
        timezone: 'UTC'
    }
};

// Improvement Prioritization Configuration
const PRIORITIZATION_CONFIG = {
    // Prioritization criteria
    criteria: {
        // User impact
        userImpact: {
            name: 'User Impact',
            description: 'Number of users affected by the issue or improvement',
            weight: 0.4, // 40% weight
            scale: [
                { value: 1, description: 'Very few users (<1%)' },
                { value: 2, description: 'Some users (1-10%)' },
                { value: 3, description: 'Many users (10-25%)' },
                { value: 4, description: 'Most users (25-75%)' },
                { value: 5, description: 'All users (>75%)' }
            ]
        },
        
        // Business value
        businessValue: {
            name: 'Business Value',
            description: 'Value to the business in terms of revenue, cost savings, or strategic alignment',
            weight: 0.3, // 30% weight
            scale: [
                { value: 1, description: 'Minimal value' },
                { value: 2, description: 'Low value' },
                { value: 3, description: 'Moderate value' },
                { value: 4, description: 'High value' },
                { value: 5, description: 'Critical value' }
            ]
        },
        
        // Implementation effort
        implementationEffort: {
            name: 'Implementation Effort',
            description: 'Effort required to implement the improvement',
            weight: 0.2, // 20% weight
            scale: [
                { value: 5, description: 'Very low effort (hours)' },
                { value: 4, description: 'Low effort (days)' },
                { value: 3, description: 'Moderate effort (weeks)' },
                { value: 2, description: 'High effort (months)' },
                { value: 1, description: 'Very high effort (quarters)' }
            ],
            inverse: true // Higher score for lower effort
        },
        
        // User feedback volume
        userFeedbackVolume: {
            name: 'User Feedback Volume',
            description: 'Volume of user feedback related to the issue or improvement',
            weight: 0.1, // 10% weight
            scale: [
                { value: 1, description: 'No feedback' },
                { value: 2, description: 'Few mentions' },
                { value: 3, description: 'Multiple mentions' },
                { value: 4, description: 'Frequent mentions' },
                { value: 5, description: 'Overwhelming feedback' }
            ]
        }
    },
    
    // Priority levels
    priorityLevels: [
        { name: 'Critical', minScore: 4.5, maxScore: 5.0, color: '#FF0000' },
        { name: 'High', minScore: 3.5, maxScore: 4.49, color: '#FF9900' },
        { name: 'Medium', minScore: 2.5, maxScore: 3.49, color: '#FFCC00' },
        { name: 'Low', minScore: 1.5, maxScore: 2.49, color: '#00CC00' },
        { name: 'Trivial', minScore: 0, maxScore: 1.49, color: '#CCCCCC' }
    ],
    
    // Calculate priority score
    calculatePriorityScore: function(scores) {
        let totalScore = 0;
        let totalWeight = 0;
        
        for (const criterionId in scores) {
            if (this.criteria[criterionId]) {
                const criterion = this.criteria[criterionId];
                const score = scores[criterionId];
                
                totalScore += score * criterion.weight;
                totalWeight += criterion.weight;
            }
        }
        
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    },
    
    // Get priority level
    getPriorityLevel: function(score) {
        for (const level of this.priorityLevels) {
            if (score >= level.minScore && score <= level.maxScore) {
                return level;
            }
        }
        
        return this.priorityLevels[this.priorityLevels.length - 1]; // Default to lowest priority
    }
};

// Feedback Integration Process Configuration
const FEEDBACK_INTEGRATION_CONFIG = {
    // Process steps
    steps: [
        {
            id: 'collect',
            name: 'Collect and Categorize Feedback',
            description: 'Collect feedback from various sources and categorize it',
            owner: 'Product Management',
            inputs: [
                'User feedback',
                'NPS surveys',
                'Feature requests',
                'Bug reports',
                'Support tickets'
            ],
            outputs: [
                'Categorized feedback',
                'Feedback summary'
            ],
            frequency: 'Weekly'
        },
        {
            id: 'analyze',
            name: 'Analyze Feedback for Patterns',
            description: 'Analyze feedback to identify patterns and insights',
            owner: 'Product Management',
            inputs: [
                'Categorized feedback',
                'Feedback summary'
            ],
            outputs: [
                'Feedback analysis',
                'Identified patterns',
                'Improvement opportunities'
            ],
            frequency: 'Weekly'
        },
        {
            id: 'prioritize',
            name: 'Prioritize Feedback',
            description: 'Prioritize feedback using the prioritization framework',
            owner: 'Product Management',
            inputs: [
                'Feedback analysis',
                'Identified patterns',
                'Improvement opportunities'
            ],
            outputs: [
                'Prioritized improvements',
                'Prioritization rationale'
            ],
            frequency: 'Weekly'
        },
        {
            id: 'create',
            name: 'Create Actionable Tasks',
            description: 'Create actionable tasks in the issue tracking system',
            owner: 'Product Management',
            inputs: [
                'Prioritized improvements',
                'Prioritization rationale'
            ],
            outputs: [
                'User stories',
                'Bug reports',
                'Feature requests'
            ],
            frequency: 'Weekly'
        },
        {
            id: 'incorporate',
            name: 'Incorporate into Sprint Planning',
            description: 'Incorporate tasks into sprint planning',
            owner: 'Development Team',
            inputs: [
                'User stories',
                'Bug reports',
                'Feature requests'
            ],
            outputs: [
                'Sprint backlog',
                'Sprint plan'
            ],
            frequency: 'Bi-weekly'
        },
        {
            id: 'implement',
            name: 'Implement Changes',
            description: 'Implement the changes',
            owner: 'Development Team',
            inputs: [
                'Sprint backlog',
                'Sprint plan'
            ],
            outputs: [
                'Implemented changes',
                'Release notes'
            ],
            frequency: 'Bi-weekly'
        },
        {
            id: 'measure',
            name: 'Measure Impact',
            description: 'Measure the impact of the changes',
            owner: 'QA Team',
            inputs: [
                'Implemented changes',
                'Release notes'
            ],
            outputs: [
                'Impact analysis',
                'KPI changes'
            ],
            frequency: 'Monthly'
        },
        {
            id: 'close',
            name: 'Close Feedback Loop',
            description: 'Close the feedback loop with users',
            owner: 'Product Management',
            inputs: [
                'Implemented changes',
                'Release notes',
                'Impact analysis'
            ],
            outputs: [
                'User communications',
                'Release announcements',
                'Feedback responses'
            ],
            frequency: 'Monthly'
        }
    ],
    
    // Feedback sources
    sources: [
        {
            id: 'in-app-feedback',
            name: 'In-App Feedback',
            description: 'Feedback collected through in-app mechanisms',
            priority: 'High'
        },
        {
            id: 'nps-surveys',
            name: 'NPS Surveys',
            description: 'Feedback collected through NPS surveys',
            priority: 'High'
        },
        {
            id: 'feature-requests',
            name: 'Feature Requests',
            description: 'Feature requests submitted by users',
            priority: 'Medium'
        },
        {
            id: 'bug-reports',
            name: 'Bug Reports',
            description: 'Bug reports submitted by users',
            priority: 'High'
        },
        {
            id: 'support-tickets',
            name: 'Support Tickets',
            description: 'Support tickets submitted by users',
            priority: 'Medium'
        },
        {
            id: 'user-interviews',
            name: 'User Interviews',
            description: 'Feedback collected through user interviews',
            priority: 'High'
        },
        {
            id: 'usability-testing',
            name: 'Usability Testing',
            description: 'Feedback collected through usability testing',
            priority: 'High'
        },
        {
            id: 'social-media',
            name: 'Social Media',
            description: 'Feedback collected from social media',
            priority: 'Low'
        }
    ],
    
    // Feedback categories
    categories: [
        {
            id: 'usability',
            name: 'Usability',
            description: 'Feedback related to usability issues'
        },
        {
            id: 'performance',
            name: 'Performance',
            description: 'Feedback related to performance issues'
        },
        {
            id: 'functionality',
            name: 'Functionality',
            description: 'Feedback related to functionality issues'
        },
        {
            id: 'feature-request',
            name: 'Feature Request',
            description: 'Requests for new features'
        },
        {
            id: 'bug',
            name: 'Bug',
            description: 'Reports of bugs or errors'
        },
        {
            id: 'content',
            name: 'Content',
            description: 'Feedback related to content issues'
        },
        {
            id: 'other',
            name: 'Other',
            description: 'Other feedback that doesn\'t fit into the above categories'
        }
    ]
};

// Export the configurations
module.exports = {
    kpis: KPI_CONFIG,
    reporting: REPORTING_CONFIG,
    reviewProcess: REVIEW_PROCESS_CONFIG,
    prioritization: PRIORITIZATION_CONFIG,
    feedbackIntegration: FEEDBACK_INTEGRATION_CONFIG
};