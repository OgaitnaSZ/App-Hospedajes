import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospedaje } from '../interfaces/hospedaje.model';
import { Habitacion } from '../interfaces/habitacion.model';
import { Actividad } from '../interfaces/actividad.model';
import { TokenService } from './token';
import { Foto } from '../interfaces/foto.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:4001/api/admin/';

  constructor(
                private http: HttpClient,
                private tokenService: TokenService
              ) {}
    /* Hospedajes */
    getHospedajes() {
        return this.http.get(`${this.apiUrl}hospedajes/hospedajes`, { headers: this.tokenService.createAuthHeaders() });
    }

    /* Agregar Hospedaje */
    agregarHospedaje(hospedaje: Hospedaje) {
        return this.http.post(`${this.apiUrl}hospedajes/agregar`, hospedaje, { headers: this.tokenService.createAuthHeaders() });
    }
    /* Modificar Hospedaje */
    modificarHospedaje(hospedaje: Hospedaje) {
        return this.http.put(`${this.apiUrl}hospedajes/modificar`, hospedaje, { headers: this.tokenService.createAuthHeaders() });
    }
    /* Eliminar Hospedaje */
    eliminarHospedaje(idHospedaje: string) {
        return this.http.delete(`${this.apiUrl}hospedajes/eliminar/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() });
    }

    /* Habitaciones */
    getHabitaciones(idHospedaje: string) {
        return this.http.get(`${this.apiUrl}habitaciones/hospedaje/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() });
    }

    agregarHabitacion(habitacion: Habitacion) {
        return this.http.post(`${this.apiUrl}habitaciones/agregar`, habitacion, { headers: this.tokenService.createAuthHeaders() });
    }

    modificarHabitacion(habitacion: Habitacion) {
        return this.http.put(`${this.apiUrl}habitaciones/modificar`, habitacion, { headers: this.tokenService.createAuthHeaders() });
    }

    eliminarHabtiacion(idHabitacion: string) {
        return this.http.delete(`${this.apiUrl}habitaciones/eliminar/${idHabitacion}`, { headers: this.tokenService.createAuthHeaders() });
    }

    /* Fotos */
    subirFotos(formData: FormData){
        return this.http.post(`${this.apiUrl}foto/subir`, formData, { headers: this.tokenService.createAuthHeaders() });
    }

    async getFotos(idHospedaje: string) : Promise<Foto | any> {
        try {
            const fotos = await this.http.get(`http://localhost:4001/api/foto/hospedaje/${idHospedaje}`).toPromise();
            return fotos;
        } catch (error: any) {
            return null;
        }
    }

    eliminarFoto(idFoto: string){
        return this.http.delete(`${this.apiUrl}foto/eliminar/${idFoto}`, { headers: this.tokenService.createAuthHeaders() });
    }

    /* Actividades */
    getActividades(idHospedaje: string) {
        return this.http.get(`${this.apiUrl}actividades/hospedaje/${idHospedaje}`, { headers: this.tokenService.createAuthHeaders() });
    }

    agregarActividad(actividad: Actividad) {
        return this.http.post(`${this.apiUrl}actividades/agregar`, actividad, { headers: this.tokenService.createAuthHeaders() });
    }

    modificarActividad(actividad: Actividad) {
        return this.http.put(`${this.apiUrl}actividades/modificar`, actividad, { headers: this.tokenService.createAuthHeaders() });
    }

    eliminarActividad(idActividad: string) {
        return this.http.delete(`${this.apiUrl}actividades/eliminar/${idActividad}`, { headers: this.tokenService.createAuthHeaders() });
    }
}