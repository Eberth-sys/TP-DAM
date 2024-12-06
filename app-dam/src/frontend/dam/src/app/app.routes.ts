import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  //ruta de detalles de los dispotivos.
  {
    path: 'dispositivo/:id', // Ruta dinámica
    loadComponent: () =>
      import('./detalles/detalles.component').then((m) => m.DetallesComponent),
  },
// ruta para el historial
  {
    path: 'dispositivo/:id/historial',
    loadComponent: () =>
      import('./historial/historial.component').then((m) => m.HistorialComponent),
  },
  
  {
    path: '',
    redirectTo: 'home', //precargo los componentes.
    pathMatch: 'full',
  },  
];
