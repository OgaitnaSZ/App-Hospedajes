import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Habitacion, HabitacionDetalle } from '../interfaces/habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private apiUrl = 'http://localhost:4001/api/habitacion/';

  // Estado base del servicio
  private _habitaciones = signal<Habitacion[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  private http = inject(HttpClient);

  // Computed (expuestos como solo lectura)
  readonly habitacion = computed(() => this._habitaciones());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  /* Listar Habitaciones */
  async getHabitaciones(idHospedaje: string, desde: string, hasta: string, capacidad: number): Promise< HabitacionDetalle | any> {
    try {
      const params = `idHospedaje=${idHospedaje}&desde=${desde}&hasta=${hasta}&capacidad=${capacidad}`;
      const data = await this.http.get<HabitacionDetalle[]>(`${this.apiUrl}hospedaje?${params}`).toPromise();
      return data ?? [];
    } catch (error: any) {
      this._error.set(error.message || 'Error al obtener hospedajes');
      return [];
    } finally {
      this._isLoading.set(false);
    }
  }
}