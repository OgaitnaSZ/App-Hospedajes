import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospedaje } from '../interfaces/hospedaje.model';
import { HospedajeListado } from '../interfaces/hospedaje.model';

@Injectable({
  providedIn: 'root'
})
export class HospedajeService {
  private apiUrl = 'http://localhost:4001/api/hospedaje/';

  // Estado base del servicio
  private _hospedajesDestacados = signal<HospedajeListado[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Computed (expuestos como solo lectura)
  readonly hospedajesDestacados = computed(() => this._hospedajesDestacados());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  constructor(private http: HttpClient) {}

  async getHospedajes(ciudad?: string, fechaInicio?: string, fechaFin?: string, capacidad?: string) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const params = `ciudad=${ciudad}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&capacidad=${capacidad}`;
      const data = await this.http.get<Hospedaje[]>(`${this.apiUrl}hospedajes?${params}`).toPromise();
      return data ?? [];
    } catch (err: any) {
      this._error.set(err.message || 'Error al obtener hospedajes');
      return [];
    } finally {
      this._isLoading.set(false);
    }
  }

  async getHospedaje(idHospedaje: number): Promise<Hospedaje | null> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const hospedaje = await this.http.get<Hospedaje>(`${this.apiUrl}hospedaje/${idHospedaje}`).toPromise();
      return hospedaje ?? null;
    } catch (err: any) {
      this._error.set(err.message || 'Error al obtener hospedaje');
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }
  async getHospedajesDestacados(): Promise<any> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const data = await this.http.get<HospedajeListado[]>(`${this.apiUrl}destacados`).toPromise();
      this._hospedajesDestacados.set(data ?? []);
      return this._hospedajesDestacados();
    } catch (err: any) {
      this._error.set(err.message || 'Error al obtener hospedajes destacados');
      this._hospedajesDestacados.set([]);
      return [];
    } finally {
      this._isLoading.set(false);
    }
  }

}
