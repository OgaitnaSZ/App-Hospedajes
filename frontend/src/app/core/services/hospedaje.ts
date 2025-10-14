import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HospedajeService {
  private apiUrl = 'http://localhost:4001/api/hospedaje/';

  constructor(private http: HttpClient) {}

  /* Listar Hospedajes */
  getHospedajes(ciudad?: string, fechaInicio?: string, fechaFin?: string, capacidad?: string) {
    const parametros = `ciudad=${ciudad}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&capacidad=${capacidad}`
    return this.http.get(`${this.apiUrl}hospedajes?${parametros}`);
  }

  /* Obtener Hospedaje por Id */
  getHospedaje(idHospedaje: number) {
    return this.http.get(`${this.apiUrl}hospedaje/${idHospedaje}`);
  }

  /* Obtener Hospedajes destacados */
  agregarHospedaje() {
    return this.http.get(`${this.apiUrl}destacados`);
  }
}