import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospedaje } from '../interfaces/hospedaje.model';
import { Habitacion } from '../interfaces/habitacion.model';
import { Actividad } from '../interfaces/actividad.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:4001/api/admin/';

  constructor(private http: HttpClient) {}
    /* Hospedajes */
    getHospedajes() {
        return this.http.get(`${this.apiUrl}hospedajes/hospedajes`);
    }

    /* Agregar Hospedaje */
    agregarHospedaje(hospedaje: Hospedaje) {
        return this.http.post(`${this.apiUrl}hospedajes/agregar`, hospedaje);
    }
    /* Modificar Hospedaje */
    modificarHospedaje(hospedaje: Hospedaje) {
        return this.http.put(`${this.apiUrl}hospedajes/modificar`, hospedaje);
    }
    /* Eliminar Hospedaje */
    eliminarHospedaje(idHospedaje: string) {
        return this.http.delete(`${this.apiUrl}hospedajes/eliminar/${idHospedaje}`);
    }

    /* Habitaciones */
    getHabitaciones(idHospedaje: string) {
        return this.http.get(`${this.apiUrl}habitaciones/hospedaje/${idHospedaje}`);
    }

    agregarHabitacion(habitacion: Habitacion) {
        return this.http.post(`${this.apiUrl}habitaciones/agregar`, habitacion);
    }

    modificarHabitacion(habitacion: Habitacion) {
        return this.http.put(`${this.apiUrl}habitaciones/modificar`, habitacion);
    }

    eliminarHabtiacion(idHabitacion: string) {
        return this.http.delete(`${this.apiUrl}habitaciones/eliminar/${idHabitacion}`);
    }

    /* Fotos */
    subirFotos(formData: FormData){
        return this.http.post(`${this.apiUrl}foto/subir`, formData);
    }

    getFotos(idHospedaje: string){
        return this.http.get(`${this.apiUrl}foto/hospedaje/${idHospedaje}`);
    }

    eliminarFoto(idFoto: string){
        return this.http.delete(`${this.apiUrl}foto/eliminar/${idFoto}`);
    }

    /* Actividades */
    getActividades(idHospedaje: string) {
        return this.http.get(`${this.apiUrl}actividades/hospedaje/${idHospedaje}`);
    }

    agregarActividad(actividad: Actividad) {
        return this.http.post(`${this.apiUrl}actividades/agregar`, actividad);
    }

    modificarActividad(actividad: Actividad) {
        return this.http.put(`${this.apiUrl}actividades/modificar`, actividad);
    }

    eliminarActividad(idActividad: string) {
        return this.http.delete(`${this.apiUrl}actividades/eliminar/${idActividad}`);
    }
}