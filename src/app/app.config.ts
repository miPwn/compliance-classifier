import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { CoreModule } from './core/core.module';
import { MessageService, ConfirmationService } from 'primeng/api';

// Interceptors
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { securityHeadersInterceptor } from './core/interceptors/security-headers.interceptor';
import { csrfInterceptor } from './core/interceptors/csrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([
        jwtInterceptor,
        errorInterceptor,
        securityHeadersInterceptor,
        csrfInterceptor
      ])
    ),
    provideAnimations(),
    importProvidersFrom(CoreModule),
    MessageService,
    ConfirmationService
  ]
};