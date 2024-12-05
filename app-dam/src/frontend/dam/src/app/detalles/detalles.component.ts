import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DispositivoService } from '../services/dispositivo.service';
import { Dispositivo } from '../models/dispositivo.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalles',
  templateUrl: 'detalles.component.html',
  styleUrls: ['detalles.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DetallesComponent implements OnInit {
  dispositivoId!: number; // ID del dispositivo recibido desde la URL
  dispositivo?: Dispositivo; // Detalle del dispositivo
  ultimaMedicion?: any // propieda de la func de ultima medici´on.

  constructor( private router: Router, private route: ActivatedRoute, private dispositivoService: DispositivoService) {}

  // Función para volver a la pa´gina principal
  volverAlInicio() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.dispositivoId = +params['id']; // Obtengo el ID desde la URL
      this.obtenerDetallesDispositivo();
    });
  }

  obtenerDetallesDispositivo() {
    // llamo backend con el ID de cada dispotivospara obtener más detalles
    this.dispositivoService.getDispositivos().subscribe((data) => {
      this.dispositivo = data.find(
        (d) => d.dispositivoId === this.dispositivoId
      );
    });

    // Funcinalidad para la última medición
    this.dispositivoService.getUltimaMedicion(this.dispositivoId).subscribe({
      next: (data) => {
        this.ultimaMedicion = data;
      },
      error: (err) => {
        console.error('Error al obtener la última medición:', err);
      },
    });
  }
}
