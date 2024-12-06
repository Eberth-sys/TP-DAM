import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DispositivoService } from '../services/dispositivo.service';
import { Dispositivo } from '../models/dispositivo.model';
import { Router , RouterModule} from '@angular/router';


@Component({
  selector: 'app-detalles',
  templateUrl: 'detalles.component.html',
  styleUrls: ['detalles.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class DetallesComponent implements OnInit {
  dispositivoId!: number; // ID del dispositivo recibido desde la URL
  dispositivo?: Dispositivo; // Detalle del dispositivo
  ultimaMedicion?: any // propieda de la func de ultima medici´on.
  historial: any[] = []; // Lista para el historial de mediciones recargado

  constructor( private router: Router, private route: ActivatedRoute, private dispositivoService: DispositivoService) {}

  // Función para volver a la pa´gina principal
  volverAlInicio() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.dispositivoId = +params['id']; // Obtengo el ID desde la URL
      this.obtenerDetallesDispositivo();
      this.cargarHistorial(); //actualizar el historial con el resgitro de la valvula.
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

  //Accionar valvula funcipón
  accionarValvula(accion: string) {
    this.dispositivoService.accionarValvula(this.dispositivoId, accion)
      .then((response) => {
        console.log('Acción realizada:', response);
        alert(`Estado de la Válvula ha sido "[${accion}]" exitosamente. \nHumedad registrada: ${response.humedad}%`);
        this.cargarHistorial(); //recargho el historial
      })
      .catch((error) => {
        console.error('Error al accionar la válvula:', error);
        alert('Hubo un error al realizar la acción.');
      });
  }
  
  //Actualizar el historial de mediciones
  cargarHistorial() {
    this.dispositivoService.getHistorialMediciones(this.dispositivoId).subscribe({
      next: (data) => {
        this.historial = data; // Asignar el historial
      },
      error: (err) => {
        console.error('Error al cargar el historial de mediciones:', err);
      },
    });
  }
  
}