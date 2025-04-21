export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  
  // Performance settings
  enableVirtualScrolling: true,
  preloadingStrategy: 'PreloadAllModules', // 'NoPreloading', 'PreloadAllModules', or 'SelectivePreloading'
  
  // Caching settings
  caching: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes in milliseconds
    persistentStorage: true, // Use IndexedDB for persistent caching
    maxCacheSize: 50 * 1024 * 1024, // 50MB max cache size
  },
  
  // Feature flags
  features: {
    offlineSupport: true,
    serviceWorker: false,
    optimisticUpdates: true,
    accessibilityFeatures: true,
    keyboardShortcuts: true,
    debugMode: true
  },
  
  // Monitoring and analytics
  monitoring: {
    enablePerformanceMonitoring: true,
    errorReporting: true,
    userAnalytics: false
  }
};