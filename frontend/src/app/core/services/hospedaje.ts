import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospedaje } from '../interfaces/hospedaje.model';
import { HospedajeListado } from '../interfaces/hospedaje.model';

@Injectable({
  providedIn: 'root'
})
export class HospedajeService {
  private apiUrl = 'http://localhost:4001/api/hospedaje/';

  // Estado base del servicio
  private _hospedaje = signal<Hospedaje[]>([]);
  private _hospedajesDestacados = signal<HospedajeListado[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  private http = inject(HttpClient);

  // Computed (expuestos como solo lectura)
  readonly hospedaje = computed(() => this._hospedaje());
  readonly hospedajesDestacados = computed(() => this._hospedajesDestacados());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  async getHospedajes(ciudad?: string, fechaInicio?: string, fechaFin?: string, capacidad?: number): Promise< HospedajeListado | any> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const params = `ciudad=${ciudad}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&capacidad=${capacidad}`;
      const data = await this.http.get<HospedajeListado[]>(`${this.apiUrl}hospedajes?${params}`).toPromise();
      return data ?? [];
    } catch (error: any) {
      this._error.set(error.message || 'Error al obtener hospedajes');
      return [];
    } finally {
      this._isLoading.set(false);
    }
  }

  async getHospedaje(idHospedaje: string): Promise<Hospedaje | any> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const hospedaje = await this.http.get<Hospedaje>(`${this.apiUrl}hospedaje/${idHospedaje}`).toPromise();
      return hospedaje;
    } catch (error: any) {
      this._error.set(error.message || 'Error al obtener hospedaje');
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }
  async getHospedajesDestacados(): Promise< HospedajeListado | any> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const data = await this.http.get<HospedajeListado[]>(`${this.apiUrl}destacados`).toPromise();
      this._hospedajesDestacados.set(data ?? []);
      return this._hospedajesDestacados();
    } catch (error: any) {
      this._error.set(error.message || 'Error al obtener hospedajes destacados');
      this._hospedajesDestacados.set([]);
      return [];
    } finally {
      this._isLoading.set(false);
    }
  }

}
