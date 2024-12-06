import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: 'historial.component.html',
  styleUrls: ['historial.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class HistorialComponent implements OnInit {
  historial: any[] = []; // valor Historial de mediciones
  dispositivoId!: number; // ID del dispositivo
  nombreDispositivo: string = ''; // Nombre del dispositivo

  constructor(
    private route: ActivatedRoute,
    private dispositivoService: DispositivoService,
    private router: Router 
  ) {}

  volverAlInicio() {
    this.router.navigate(['/home']); // volver al inicio de pg.
  }

  ngOnInit() {
    // Obtener el ID del dispositivo desde la URL
    this.route.params.subscribe((params) => {
      this.dispositivoId = +params['id'];
      

      // Obtener el historial de mediciones
      this.dispositivoService.getHistorialMediciones(this.dispositivoId).subscribe(
        (data) => {
          console.log('Historial:', data); 
          this.historial = data; // Guardar el historial
        },
        (error) => {
          console.error('Error al obtener el historial de mediciones:', error);
        }
      );
    });

    // Obtener el nombre del dispositivo
    this.dispositivoService.getDispositivos().subscribe(
      (data) => {
        const dispositivo = data.find((d) => d.dispositivoId === this.dispositivoId);
        if (dispositivo) {
          this.nombreDispositivo = dispositivo.nombre; // Asignar el nombre
          console.log('Nombre del dispositivo:', this.nombreDispositivo); // Verificar el nombre
        }
      },
      (error) => {
        console.error('Error al obtener el nombre del dispositivo:', error);
      }
    );
  }
}
