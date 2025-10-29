import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token';
import { Resena, ResenaHome } from '../interfaces/resena.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
    private apiUrl = 'http://localhost:4001/api/resena/';

    // Inject
    private http = inject(HttpClient);
    private tokenService = inject(TokenService);

    // Signals de estado
    resenasUsuario = signal<Resena[]>([]);
    resenasDestacadas = signal<ResenaHome[]>([]);
    resenasHospedaje = signal<ResenaHome[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);

    getMejoresResenas(cantidad: number): void {
        this.loading.set(true);
        this.error.set(null);
        
        this.http.get<ResenaHome[]>(`${this.apiUrl}mejores/${cantidad}`).pipe(
            tap((data) => {
                this.resenasDestacadas.set(data)
            }),
            catchError(err => {
            this.error.set('Error al obtener reseñas');
            console.error(err);
            return of(null);
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    getResenasUsuario(idUsuario:string, idHospedaje: string, idHabitacion: string): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<Resena[]>(`${this.apiUrl}/usuario/${idUsuario}/hospedaje/${idHospedaje}/habitacion/${idHabitacion}`, 
        { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.resenasUsuario.set(data)
            }),
            catchError(err => {
            this.error.set('Error al obtener reseñas');
            console.error(err);
            return of(null);
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    getResenasHospedaje(idHospedaje: string): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<ResenaHome[]>(`${this.apiUrl}/hospedaje/${idHospedaje}`).pipe(
            tap((data) => {
                this.resenasHospedaje.set(data)
            }),
            catchError(err => {
            this.error.set('Error al obtener reseñas');
            console.error(err);
            return of(null);
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    agregarResena(resena: Resena): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.post(`${this.apiUrl}agregar`, resena, { headers: this.tokenService.createAuthHeaders()}).pipe(
            tap(() => {
                this.success.set("Reseña agregada con exito")
            }),
            catchError(err => {
            this.error.set('Error al agregar reseñas');
            console.error(err);
            return of(null);
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    // Actualizar datos del usuario
    modificarResena(resena: Resena): void {
        this.loading.set(true);
        this.error.set(null);
    
        this.http.put(`${this.apiUrl}modificar`, resena, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Reseña modificada con exito")
            }),
            catchError(err => {
            this.error.set('Error al modificar reseñas');
            console.error(err);
            return of(null);
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    eliminarResena(idResena: string) : void {
        this.loading.set(true);
        this.error.set(null);

        this.http.delete(`${this.apiUrl}eliminar/${idResena}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Reseña eliminada con exito")
            }),
            catchError(err => {
            this.error.set('Error al eliminar reseñas');
            console.error(err);
            return of(null);
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }
}