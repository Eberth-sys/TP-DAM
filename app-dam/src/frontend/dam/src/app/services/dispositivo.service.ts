import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../models/dispositivo.model'; // traigo desde la carpeta models
import { Medicion } from '../models/medicion.model';

@Injectable({
  providedIn: 'root',
})
export class DispositivoService {
  private apiUrl = 'http://localhost:8000/dispositivo'; // URL del backend

  constructor(private http: HttpClient) {} //inyecto HTTP para las solicitudes.

  // Método para obtener la lista de dispositivos
  getDispositivos(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.apiUrl);
  }

  // Método para obtener la última medición de un dispositivo
  getUltimaMedicion(dispositivoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${dispositivoId}/ultima-medicion`);
  }

  // Método  historial de mediciones 
  getHistorialMediciones(dispositivoId: number): Observable<any[]> {
    const url = `${this.apiUrl}/${dispositivoId}/historial-mediciones`; // Construir la URL
    return this.http.get<any[]>(url); // Realizar la solicitud GET
  }

  //Metodo para accionar la valvula
  accionarValvula(dispositivoId: number, accion: string): Promise<any> {
    const url = `${this.apiUrl}/${dispositivoId}/accion-valvula`;
    return this.http.post(url, { accion }).toPromise();
  }
  
  
  
 
}


