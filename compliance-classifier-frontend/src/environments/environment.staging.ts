export const environment = {
  production: true,
  apiUrl: 'https://staging-api.compliance-classifier.com/api',
  
  // Performance settings
  enableVirtualScrolling: true,
  preloadingStrategy: 'PreloadAllModules', // 'NoPreloading', 'PreloadAllModules', or 'SelectivePreloading'
  
  // Caching settings
  caching: {
    defaultTTL: 10 * 60 * 1000, // 10 minutes in milliseconds for staging
    persistentStorage: true, // Use IndexedDB for persistent caching
    maxCacheSize: 75 * 1024 * 1024, // 75MB max cache size for staging
  },
  
  // Feature flags
  features: {
    offlineSupport: true,
    serviceWorker: true,
    optimisticUpdates: true,
    accessibilityFeatures: true,
    keyboardShortcuts: true,
    debugMode: true // Enabled in staging for testing
  },
  
  // Monitoring and analytics
  monitoring: {
    enablePerformanceMonitoring: true,
    errorReporting: true,
    userAnalytics: true // Enabled in staging for testing
  }
};