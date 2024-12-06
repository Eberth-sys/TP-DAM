import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular'; //Importo el componente de alerta.
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

  constructor( private router: Router, private route: ActivatedRoute, private dispositivoService: DispositivoService, private alertController: AlertController ) {}

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
    // Método para accionar la válvula
    async accionarValvula(accion: string) {
      try {
        const response = await this.dispositivoService.accionarValvula(
          this.dispositivoId, accion);
        console.log('Acción realizada:', response);
  
        // Mostrar alerta  exitoso
        await this.presentAlert(
          '', //Si lo boroo me da error.
          `La válvula ha sido "[${accion}]" exitosamente.`,
          `Humedad registrada: ${response.humedad}%`
        );
  
        this.cargarHistorial(); // Recargar el historial
      } catch (error) {
        console.error('Error al accionar la válvula:', error);
  
        // Mostrar alerta estilizada con mensaje de error
        await this.presentAlert(
          'Error',
          'Hubo un error al realizar la acción.',
          'Por favor, intenta nuevamente.'
        );
      }
    }
  
  // Me´todo para mostrar la alerta estilizada
  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header, // Título 
      subHeader, 
      message, // Mensaje principal
      buttons: ['OK'], // Botone de la alerta
    });

    // Presenta la alerta en pantalla
    await alert.present();
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