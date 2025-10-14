import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HospedajeService {
  private apiUrl = 'http://localhost:4001/api/habitacion/';

  constructor(private http: HttpClient) {}

  /* Listar Habitaciones */
  getHabitaciones(idHospedaje?: string, desde?: string, hasta?: string, capacidad?: string) {
    const parametros = `idHospedaje=${idHospedaje}&desde=${desde}&hasta=${hasta}&capacidad=${capacidad}`
    return this.http.get(`${this.apiUrl}hospedajes?${parametros}`);
  }
}