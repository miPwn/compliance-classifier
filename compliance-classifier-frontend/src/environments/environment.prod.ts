export const environment = {
  production: true,
  apiUrl: 'https://api.compliance-classifier.com/api',
  
  // Performance settings
  enableVirtualScrolling: true,
  preloadingStrategy: 'PreloadAllModules', // 'NoPreloading', 'PreloadAllModules', or 'SelectivePreloading'
  
  // Caching settings
  caching: {
    defaultTTL: 15 * 60 * 1000, // 15 minutes in milliseconds for production
    persistentStorage: true, // Use IndexedDB for persistent caching
    maxCacheSize: 100 * 1024 * 1024, // 100MB max cache size for production
  },
  
  // Feature flags
  features: {
    offlineSupport: true,
    serviceWorker: true,
    optimisticUpdates: true,
    accessibilityFeatures: true,
    keyboardShortcuts: true,
    debugMode: false // Disabled in production
  },
  
  // Monitoring and analytics
  monitoring: {
    enablePerformanceMonitoring: true,
    errorReporting: true,
    userAnalytics: true // Enabled in production
  }
};