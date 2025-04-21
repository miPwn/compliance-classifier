import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, NoPreloading } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { SecurityInterceptor } from './core/interceptors/security.interceptor';
import { environment } from '../environments/environment';
import { SelectivePreloadingStrategy } from './core/strategies/selective-preloading.strategy';

// Determine which preloading strategy to use based on environment configuration
const getPreloadingStrategy = () => {
  switch (environment.preloadingStrategy) {
    case 'PreloadAllModules':
      return PreloadAllModules;
    case 'SelectivePreloading':
      return SelectivePreloadingStrategy;
    case 'NoPreloading':
    default:
      return NoPreloading;
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(
      routes,
      withPreloading(getPreloadingStrategy())
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch() // Use the Fetch API for better performance
    ),
    provideAnimations(),
    providePrimeNG({
      ripple: true,
      inputStyle: 'filled'
    }),
    // Conditionally provide ServiceWorker based on environment configuration
    ...(environment.features.serviceWorker ? [
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
      })
    ] : []),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    },
    // Register the SelectivePreloadingStrategy provider
    SelectivePreloadingStrategy
  ]
};
