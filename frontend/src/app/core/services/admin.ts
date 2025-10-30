import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospedaje } from '../interfaces/hospedaje.model';
import { Habitacion } from '../interfaces/habitacion.model';
import { Actividad } from '../interfaces/actividad.model';
import { TokenService } from './token';
import { Foto } from '../interfaces/foto.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:4001/api/admin/';

    // Inject
    http = inject(HttpClient);
    tokenService = inject(TokenService)

    // Signals de estado
    loading = signal(false);
    error = signal<string | null>(null);
    success = signal<string | null>(null);
    
    hospedaje = signal<Hospedaje | null>(null);
    hospedajes = signal<Hospedaje[]>([]);
    habitaciones = signal<Habitacion[]>([]);
    fotos = signal<Foto[]>([]);
    actividades = signal<Actividad[]>([]);

    /* Hospedajes */
    getHospedajes(): void {
        this.loading.set(true);
        this.error.set(null);
        
        this.http.get<Hospedaje[]>(`${this.apiUrl}hospedajes/hospedajes`, { headers: this.tokenService.createAuthHeaders() }).pipe(
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
        
        this.http.get<Hospedaje>(`${this.apiUrl}hospedajes/hospedaje/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.hospedaje.set(data)
            }),
            catchError(err => {
                this.error.set('Error al obtener hospedajes');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    /* Agregar Hospedaje */
    agregarHospedaje(hospedaje: Hospedaje): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.post<Hospedaje>(`${this.apiUrl}hospedajes/agregar`, hospedaje, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.hospedaje.set(data);
                this.success.set("Hospedaje creado con exito");
            }),
            catchError(err => {
                this.error.set('Error al agregar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }
    /* Modificar Hospedaje */
    modificarHospedaje(hospedaje: Hospedaje): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.put(`${this.apiUrl}hospedajes/modificar`, hospedaje, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Hospedaje modificado con exito")
            }),
            catchError(err => {
                this.error.set('Error al modificar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }
    /* Cambiar estado de hospedaje */
    cambiarEstadoHospedaje(idHospedaje: string) {
        this.loading.set(true);
        this.error.set(null);

        this.http.patch(`${this.apiUrl}hospedajes/cambiarEstado/${idHospedaje}`, {}, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Estado actualizado con exito")
            }),
            catchError(err => {
                this.error.set('Error al eliminar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    /* Eliminar Hospedaje */
    eliminarHospedaje(idHospedaje: string) {
        this.loading.set(true);
        this.error.set(null);

        this.http.patch(`${this.apiUrl}hospedajes/eliminar/${idHospedaje}`, {}, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Hospedaje eliminado con exito")
            }),
            catchError(err => {
                this.error.set('Error al eliminar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    /* Habitaciones */
    getHabitaciones(idHospedaje: string) {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<Habitacion[]>(`${this.apiUrl}habitaciones/hospedaje/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.habitaciones.set(data)
            }),
            catchError(err => {
                this.error.set('Error al obtener habitaciones');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    agregarHabitacion(habitacion: Habitacion) {
        this.loading.set(true);
        this.error.set(null);

        this.http.post(`${this.apiUrl}habitaciones/agregar`, habitacion, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Habitacion agregada con exito")
            }),
            catchError(err => {
                this.error.set('Error al agregar habitacion');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    modificarHabitacion(habitacion: Habitacion) {
        this.loading.set(true);
        this.error.set(null);

        this.http.put(`${this.apiUrl}habitaciones/modificar`, habitacion, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Habitacion modificada con exito")
            }),
            catchError(err => {
                this.error.set('Error al modificar habitacion');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    eliminarHabtiacion(idHabitacion: string) {
        this.loading.set(true);
        this.error.set(null);

        this.http.delete(`${this.apiUrl}habitaciones/eliminar/${idHabitacion}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Habitacion eliminada con exito")
            }),
            catchError(err => {
                this.error.set('Error al eliminar habitacion');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    /* Fotos */
    subirFotos(formData: FormData){
        this.loading.set(true);
        this.error.set(null);

        this.http.post(`${this.apiUrl}foto/subir`, formData, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Fotos subidas con exito")
            }),
            catchError(err => {
                this.error.set('Error al subir fotos');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    getFotos(idHospedaje: string) : void {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<Foto[]>(`http://localhost:4001/api/foto/hospedaje/${idHospedaje}`).pipe(
            tap((data) => {
                this.fotos.set(data)
            }),
            catchError(err => {
                this.error.set('Error al obtener fotos');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    seleccionarImagenPrincipal(idHospedaje: string, idFoto: string): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.patch(`http://localhost:4001/api/foto/seleccionarPrincipal`, {idHospedaje, idFoto} ,{ headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Foto actualizada con exito")
            }),
            catchError(err => {
                this.error.set('Error al actualizar foto');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    eliminarFoto(idFoto: string): void {
        this.loading.set(true);
        this.error.set(null);

        this.http.delete(`${this.apiUrl}foto/eliminar/${idFoto}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Foto eliminada con exito")
            }),
            catchError(err => {
                this.error.set('Error al eliminar foto');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    /* Actividades */
    getActividades(idHospedaje: string) {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<Actividad[]>(`${this.apiUrl}actividades/hospedaje/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.actividades.set(data)
            }),
            catchError(err => {
                this.error.set('Error al obtener actividades');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    agregarActividad(actividad: Actividad) {
        this.loading.set(true);
        this.error.set(null);

        this.http.post(`${this.apiUrl}actividades/agregar`, actividad, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Actividad agregada con exito")
            }),
            catchError(err => {
                this.error.set('Error al agregar actividad');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    modificarActividad(actividad: Actividad) {
        this.loading.set(true);
        this.error.set(null);

        this.http.put(`${this.apiUrl}actividades/modificar`, actividad, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Actividad modificada con exito")
            }),
            catchError(err => {
                this.error.set('Error al modificar actividad');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    eliminarActividad(idActividad: string) {
        this.loading.set(true);
        this.error.set(null);

        this.http.delete(`${this.apiUrl}actividades/eliminar/${idActividad}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.success.set("Actividad eliminada con exito")
            }),
            catchError(err => {
                this.error.set('Error al eliminar actividad');
                console.error(err);
                return [];
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }
}