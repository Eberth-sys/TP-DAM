import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http'; // Importar el proveedor de HttpClient
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; //importo la liberia de routas.

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(), // Agrego HttpClient como proveedor
  ],
});
