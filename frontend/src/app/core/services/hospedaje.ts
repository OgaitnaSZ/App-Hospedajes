import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospedaje, HospedajeDetalles } from '../interfaces/hospedaje.model';
import { HospedajeListado } from '../interfaces/hospedaje.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospedajeService {
  private apiUrl = 'http://localhost:4001/api/hospedaje/';

  // Inject
  private http = inject(HttpClient);

  // Signals de estado
  hospedaje = signal<HospedajeDetalles | null>(null);
  hospedajes = signal<HospedajeListado[]>([]);
  hospedajesDestacados = signal<HospedajeListado[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  getHospedajes(ciudad?: string, fechaInicio?: string, fechaFin?: string, capacidad?: number): void {
    this.loading.set(true);
    this.error.set(null);

    const params = `ciudad=${ciudad}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&capacidad=${capacidad}`;
    
    this.http.get<HospedajeListado[]>(`${this.apiUrl}hospedajes?${params}`).pipe(
      tap((data) => {
          this.hospedajes.set(data)
      }),
      catchError(err => {
        this.error.set('Error al obtener hospedajes');
        console.error(err);
        return [];
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  getHospedaje(idHospedaje: string): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.get<HospedajeDetalles>(`${this.apiUrl}hospedaje/${idHospedaje}`).pipe(
      tap((data) => {
        this.hospedaje.set(data)
      }),
      catchError(err => {
        this.error.set('Error al obtener hospedaje');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  getHospedajesDestacados(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<HospedajeListado[]>(`${this.apiUrl}destacados`).pipe(
      tap((data) => {
          this.hospedajesDestacados.set(data)
      }),
      catchError(err => {
        this.error.set('Error al obtener hospedajes destacados');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

}
