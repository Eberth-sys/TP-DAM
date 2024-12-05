import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../models/dispositivo.model'; // traigo desde la carpeta models

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
}

