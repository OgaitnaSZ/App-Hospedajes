import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';

// Registrar el idioma español
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideHttpClient(), 
              provideAnimationsAsync(),
              { provide: LOCALE_ID, useValue: 'es' }]
};
