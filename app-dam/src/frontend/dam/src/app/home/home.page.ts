import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { DispositivoService } from '../services/dispositivo.service'; //Importo desde la carpta servicios
import { Dispositivo } from '../models/dispositivo.model'; //Importo desde la carpta models
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; //Importo la liberia de router


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {
  dispositivos: Dispositivo[] = []; // Lista de dispositivos

  constructor(private router: Router, private dispositivoService: DispositivoService) {} //importo router
  
  verDetalles(dispositivoId: number) {
    this.router.navigate(['/dispositivo', dispositivoId]);
  }

  ngOnInit() {
    // obtener los dispositivos 
    this.dispositivoService.getDispositivos().subscribe(
      (data) => {
        this.dispositivos = data; 
        console.log(this.dispositivos); 
      },
      (error) => { // Manejo de error en caso de.
        console.error('Error al obtener dispositivos:', error); 
      }
    );
  }
  
}