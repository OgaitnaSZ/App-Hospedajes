import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadesApiService {
  private apiUrl: string = 'localhost:4001/api/actividad/';
  
  constructor(private http: HttpClient) {}

  /* Obtener Actividades */
  getActividades(ciudad: string): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/actividades/obtener-actividades.php`, { ciudad: ciudad});
  }

  /* Agregar Actividad */
  agregarActividad(actividad: any): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/actividades/agregar-actividad.php`, actividad);
  }

  /* Modificar Actividad */
  modificarActividad(actividad: any): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/actividades/modificar-actividad.php`, actividad);
  }

  /* Eliminar Actividad */
  eliminarActividad(IdActividad: number): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/actividades/eliminar-actividad.php`, { IdActividad: IdActividad});
  }
}
