import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HospedajeService {
  private apiUrl = 'http://localhost:4001/api/servicio';

  constructor(private http: HttpClient) {}

  /* Listar Servicios */
  getServicios(tipo: string) {
    const parametros = `tipo=${tipo}`;
    return this.http.get(`${this.apiUrl}?${parametros}`);
  }
}