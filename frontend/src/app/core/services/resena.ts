import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token';
import { Resena, ResenaHome } from '../interfaces/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
    private apiUrl = 'http://localhost:4001/api/resena/';

    // Estado base del servicio
    private _resenasUsuario = signal<Resena[]>([]);
    private _resenasDestacadas = signal<ResenaHome[]>([]);
    private _resenasHospedaje = signal<ResenaHome[]>([]);
    private _isLoading = signal(false);
    private _error = signal<string | null>(null);

    private http = inject(HttpClient);
    private tokenService = inject(TokenService);

    readonly resenasDestacadas = computed(() => this._resenasDestacadas());
    readonly isLoading = computed(() => this._isLoading());
    readonly error = computed(() => this._error());
                          

    async getMejoresResenas(cantidad: number): Promise< ResenaHome | any> {
        this._isLoading.set(true);
        this._error.set(null);
        try {
            const data = await this.http.get<ResenaHome[]>(`${this.apiUrl}mejores/${cantidad}`).toPromise();
            this._resenasDestacadas.set(data ?? []);
            return this._resenasDestacadas();
        } catch (err: any) {
            this._error.set(err.message || 'Error al obtener mejores reseñas');
            this._resenasDestacadas.set([]);
            return [];
        } finally {
            this._isLoading.set(false);
        }
    }

    async getResenasUsuario(idUsuario:string, idHospedaje: string, idHabitacion: string): Promise< Resena | any> {
        this._isLoading.set(true);
        this._error.set(null);
        try {
            const data = await this.http.get<Resena[]>(`${this.apiUrl}/usuario/${idUsuario}/hospedaje/${idHospedaje}/habitacion/${idHabitacion}`, { headers: this.tokenService.createAuthHeaders() }).toPromise();
            this._resenasUsuario.set(data ?? []);
            return this._resenasUsuario();
        } catch (error: any) {
            this._error.set(error.message || 'Error al obtener reseñas');
            this._resenasUsuario.set([]);
            return [];
        } finally {
            this._isLoading.set(false);
        }
    }

    async getResenasHospedaje(idHospedaje: string){
        this._isLoading.set(true);
        this._error.set(null);

        try {
            const data = await this.http.get<ResenaHome[]>(`${this.apiUrl}/hospedaje/${idHospedaje}`).toPromise();
            this._resenasHospedaje.set(data ?? []);
            return this._resenasHospedaje();
        } catch (error: any) {
            this._error.set(error.message || 'Error al obtener reseñas');
            this._resenasHospedaje.set([]);
            return [];
        } finally {
            this._isLoading.set(false);
        }
    }

    async agregarResena(resena: Resena): Promise<any> {
        this._isLoading.set(true);
        this._error.set(null);

        try {
          return await this.http.post(`${this.apiUrl}agregar`, resena, { headers: this.tokenService.createAuthHeaders()}).toPromise();
        } catch (err: any) {
            this._error.set(err.message || 'Error al crear reseña');
        } finally {
          this._isLoading.set(false);
        }
    }

    // Actualizar datos del usuario
    async modificarResena(resena: Resena): Promise<any> {
       this._isLoading.set(true);
       this._error.set(null);
    
        try {
            return this.http.put(`${this.apiUrl}modificar`, resena, { headers: this.tokenService.createAuthHeaders() }). toPromise();
        } catch (error: any) {
            this._error.set(error.message || 'Error al modificar reseña');
        } finally {
          this._isLoading.set(false);
        }
    }

    async eliminarResena(idResena: string) {
        this._isLoading.set(true);
        this._error.set(null);

        try {
            return this.http.delete(`${this.apiUrl}eliminar/${idResena}`, { headers: this.tokenService.createAuthHeaders() }). toPromise();
        } catch (error: any) {
            this._error.set(error.message || 'Error al eliminar reseña');
        } finally {
          this._isLoading.set(false);
        }
    }
}