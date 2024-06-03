import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        { provide: LOCALE_ID, useValue: 'fr-FR' }, provideHttpClient()
    ]
};
