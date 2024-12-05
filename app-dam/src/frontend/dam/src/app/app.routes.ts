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
  {
    path: '',
    redirectTo: 'home', //precargo los componentes.
    pathMatch: 'full',
  },  
];
