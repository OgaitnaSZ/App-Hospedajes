import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesApiService {
  constructor(private http: HttpClient) {}

  /* Obtener habitaciones de un hospedaje */
  obtenerHabitaciones(parametros: string): Observable<any> {
    return this.http.get(`https://vamos.fullbusiness.io/api/hospedajes/habitaciones/obtener-habitaciones.php?${parametros.toString()}`);
  }

  /* Obtener habitaciones admin */
  obtenerHabitacionesAdmin(IdHospedaje: number): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/habitaciones/obtener-habitaciones-admin.php`, { IdHospedaje: IdHospedaje });
  }

  /* Agregar Habitacion */
  agregarHabitacion(habitacion: any): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/habitaciones/agregar-habitacion.php`, habitacion);
  }

  /* Actualizar Habitacion */
  actualizarHabitacion(habitacion: any): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/habitaciones/actualizar-habitacion.php`, habitacion);
  }

  /* Eliminar habitacion */
  eliminarHabitacion(IdHabitacion: number): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/habitaciones/eliminar-habitacion.php`, { IdHabitacion: IdHabitacion });
  }
}
