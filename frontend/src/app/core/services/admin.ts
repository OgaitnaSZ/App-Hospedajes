import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospedaje, hospedajeDetalleAdmin } from '../interfaces/hospedaje.model';
import { Habitacion } from '../interfaces/habitacion.model';
import { Actividad } from '../interfaces/actividad.model';
import { TokenService } from './token';
import { Foto } from '../interfaces/foto.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'https://app-hospedajes-backend.vercel.app/api/admin/';

    // Inject
    http = inject(HttpClient);
    tokenService = inject(TokenService)

    // Signals de estado
    loadingHospedajes = signal(false);
    loadingHabitaciones = signal(false);
    loadingFotos = signal(false);
    loadingActividades = signal(false);
    errorHospedajes = signal<string | null>(null);
    errorHabitaciones = signal<string | null>(null);
    errorFotos = signal<string | null>(null);
    errorActividades = signal<string | null>(null);
    successHospedajes = signal<string | null>(null);
    successHabitaciones = signal<string | null>(null);
    successFotos = signal<string | null>(null);
    successActividades = signal<string | null>(null);
    
    hospedajes = signal<Hospedaje[]>([]);
    hospedaje = signal<hospedajeDetalleAdmin | null>(null);
    hospedajeNew = signal<Hospedaje | null>(null);
    habitaciones = signal<Habitacion[]>([]);
    habitacion = signal<Habitacion | null>(null);
    fotos = signal<Foto[]>([]);
    actividades = signal<Actividad[]>([]);

    /* Hospedajes */
    getHospedajes(): void {
        this.loadingHospedajes.set(true);
        this.errorHospedajes.set(null);
        
        this.http.get<Hospedaje[]>(`${this.apiUrl}hospedajes/hospedajes`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.hospedajes.set(data)
            }),
            catchError(err => {
                this.errorHospedajes.set('Error al obtener hospedajes');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHospedajes.set(false))
        ).subscribe();
    }
    getHospedaje(idHospedaje: string): void {
        this.loadingHospedajes.set(true);
        this.errorHospedajes.set(null);
        
        this.http.get<hospedajeDetalleAdmin>(`${this.apiUrl}hospedajes/hospedaje/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.hospedaje.set(data)
            }),
            catchError(err => {
                this.errorHospedajes.set('Error al obtener hospedajes');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHospedajes.set(false))
        ).subscribe();
    }

    /* Agregar Hospedaje */
    agregarHospedaje(hospedaje: Hospedaje): void {
        this.loadingHospedajes.set(true);
        this.errorHospedajes.set(null);

        this.http.post<Hospedaje>(`${this.apiUrl}hospedajes/agregar`, hospedaje, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.hospedajeNew.set(data);
                this.successHospedajes.set(<string>data.idHospedaje);
            }),
            catchError(err => {
                this.errorHospedajes.set('Error al agregar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHospedajes.set(false))
        ).subscribe();
    }
    /* Modificar Hospedaje */
    modificarHospedaje(hospedaje: Hospedaje): void {
        this.loadingHospedajes.set(true);
        this.errorHospedajes.set(null);

        this.http.put(`${this.apiUrl}hospedajes/modificar`, hospedaje, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successHospedajes.set("Hospedaje modificado con exito")
            }),
            catchError(err => {
                this.errorHospedajes.set('Error al modificar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHospedajes.set(false))
        ).subscribe();
    }
    /* Cambiar estado de hospedaje */
    cambiarEstadoHospedaje(idHospedaje: string) {
        this.loadingHospedajes.set(true);
        this.errorHospedajes.set(null);

        this.http.patch(`${this.apiUrl}hospedajes/cambiarEstado/${idHospedaje}`, {}, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successHospedajes.set("Estado actualizado con exito")
            }),
            catchError(err => {
                this.errorHospedajes.set('Error al eliminar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHospedajes.set(false))
        ).subscribe();
    }

    /* Eliminar Hospedaje */
    eliminarHospedaje(idHospedaje: string) {
        this.loadingHospedajes.set(true);
        this.errorHospedajes.set(null);

        this.http.patch(`${this.apiUrl}hospedajes/eliminar/${idHospedaje}`, {}, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successHospedajes.set("Hospedaje eliminado con exito")
            }),
            catchError(err => {
                this.errorHospedajes.set('Error al eliminar hospedaje');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHospedajes.set(false))
        ).subscribe();
    }

    /* Habitaciones */
    getHabitaciones(idHospedaje: string) {
        this.loadingHabitaciones.set(true);
        this.errorHabitaciones.set(null);

        this.http.get<Habitacion[]>(`${this.apiUrl}habitaciones/hospedaje/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.habitaciones.set(data)
            }),
            catchError(err => {
                this.errorHabitaciones.set('Error al obtener habitaciones');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHabitaciones.set(false))
        ).subscribe();
    }

    agregarHabitacion(habitacion: Habitacion) {
        this.loadingHabitaciones.set(true);
        this.errorHabitaciones.set(null);

        this.http.post(`${this.apiUrl}habitaciones/agregar`, habitacion, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successHabitaciones.set("Habitacion agregada con exito")
            }),
            catchError(err => {
                this.errorHabitaciones.set('Error al agregar habitacion');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHabitaciones.set(false))
        ).subscribe();
    }

    modificarHabitacion(habitacion: Habitacion) {
        this.loadingHabitaciones.set(true);
        this.errorHabitaciones.set(null);

        this.http.put(`${this.apiUrl}habitaciones/modificar`, habitacion, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successHabitaciones.set("Habitacion modificada con exito")
            }),
            catchError(err => {
                this.errorHabitaciones.set('Error al modificar habitacion');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHabitaciones.set(false))
        ).subscribe();
    }

    eliminarHabtiacion(idHabitacion: string) {
        this.loadingHabitaciones.set(true);
        this.errorHabitaciones.set(null);

        this.http.delete(`${this.apiUrl}habitaciones/eliminar/${idHabitacion}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successHabitaciones.set("Habitacion eliminada con exito")
            }),
            catchError(err => {
                this.errorHabitaciones.set('Error al eliminar habitacion');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingHabitaciones.set(false))
        ).subscribe();
    }

    /* Fotos */
    subirFotos(formData: FormData){
        this.loadingFotos.set(true);
        this.errorFotos.set(null);

        this.http.post(`${this.apiUrl}foto/subir`, formData, { headers: this.tokenService.createAuthHeaders({ excludeContentType: true }) }).pipe(
            tap(() => {
                this.successFotos.set("Fotos subidas con exito")
            }),
            catchError(err => {
                this.errorFotos.set('Error al subir fotos');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingFotos.set(false))
        ).subscribe();
    }

    getFotos(idHospedaje: string) : void {
        this.loadingFotos.set(true);
        this.errorFotos.set(null);

        this.http.get<Foto[]>(`http://localhost:4001/api/foto/hospedaje/${idHospedaje}`).pipe(
            tap((data) => {
                this.fotos.set(data)
            }),
            catchError(err => {
                this.errorFotos.set('Error al obtener fotos');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingFotos.set(false))
        ).subscribe();
    }

    actualizarOrdenFotos(fotos: Foto[]): void {
        this.loadingFotos.set(true);
        this.errorFotos.set(null);

        this.http.patch(`${this.apiUrl}foto/actualizarOrden`, {fotos} ,{ headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successFotos.set("Fotos actualizadas con exito")
            }),
            catchError(err => {
                this.errorFotos.set('Error al actualizar foto');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingFotos.set(false))
        ).subscribe();
    }

    eliminarFoto(idFoto: string): void {
        this.loadingFotos.set(true);
        this.errorFotos.set(null);

        this.http.delete(`${this.apiUrl}foto/eliminar/${idFoto}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successFotos.set("Foto eliminada con exito")
            }),
            catchError(err => {
                this.errorFotos.set('Error al eliminar foto');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingFotos.set(false))
        ).subscribe();
    }

    /* Actividades */
    getActividades() {
        this.loadingActividades.set(true);
        this.errorActividades.set(null);

        this.http.get<Actividad[]>(`${this.apiUrl}actividades`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap((data) => {
                this.actividades.set(data)
            }),
            catchError(err => {
                this.errorActividades.set('Error al obtener actividades');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingActividades.set(false))
        ).subscribe();
    }

    agregarActividad(actividad: Actividad) {
        this.loadingActividades.set(true);
        this.errorActividades.set(null);

        this.http.post(`${this.apiUrl}actividades/agregar`, actividad, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successActividades.set("Actividad agregada con exito")
            }),
            catchError(err => {
                this.errorActividades.set('Error al agregar actividad');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingActividades.set(false))
        ).subscribe();
    }

    modificarActividad(actividad: Actividad) {
        this.loadingActividades.set(true);
        this.errorActividades.set(null);

        this.http.put(`${this.apiUrl}actividades/modificar`, actividad, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successActividades.set("Actividad modificada con exito")
            }),
            catchError(err => {
                this.errorActividades.set('Error al modificar actividad');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingActividades.set(false))
        ).subscribe();
    }

    eliminarActividad(idActividad: string) {
        this.loadingActividades.set(true);
        this.errorActividades.set(null);

        this.http.delete(`${this.apiUrl}actividades/eliminar/${idActividad}`, { headers: this.tokenService.createAuthHeaders() }).pipe(
            tap(() => {
                this.successActividades.set("Actividad eliminada con exito")
            }),
            catchError(err => {
                this.errorActividades.set('Error al eliminar actividad');
                console.error(err);
                return [];
            }),
            finalize(() => this.loadingActividades.set(false))
        ).subscribe();
    }
}