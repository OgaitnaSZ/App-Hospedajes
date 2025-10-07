import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ResenasApiService {
  constructor(private http: HttpClient, private login: LoginService) {}

  /* Agregar Reseña */
  agregarResena(formData: FormData): Observable<any> {
    const IdUsuario = this.login.getUserId();
    if (IdUsuario) {
      formData.append('IdUsuario', IdUsuario.toString());
    }
    return this.http.post(`https://vamos.fullbusiness.io/api/resenas/agregar-resena.php`, formData);
  }

  /* Cargar Reseña existente */
  cargarResena(IdHospedaje: number): Observable<any> {
    const IdUsuario = this.login.getUserId();
    return this.http.post(`https://vamos.fullbusiness.io/api/resenas/cargar-resena.php`, { IdUsuario: IdUsuario, IdHospedaje: IdHospedaje});
  }

  /* Cargar Reseñas por hospedaje */  
  cargarResenasHospedaje(IdHospedaje: number): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/resenas/cargar-resenas-hospedaje.php`, {IdHospedaje: IdHospedaje});
  }

  /* Cargar Mejores Resenas */
  cargarMejoresResenas(cantidad: number): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/resenas/cargar-mejores-resenas.php`, {Cantidad: cantidad});
  }
}
