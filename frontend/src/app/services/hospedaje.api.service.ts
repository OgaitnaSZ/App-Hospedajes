import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})

export class HospedajeApiService {
  constructor(private http: HttpClient, private login: LoginService) {}
  /* Listar Hospedajes */
  getHospedajes(parametros: string): Observable<any> {
    if (parametros != '' && parametros != null && parametros != undefined){
      return this.http.get(`https://vamos.fullbusiness.io/api/hospedajes/obtener-hospedajes.php?${parametros.toString()}`);
    }else{
      return this.http.get(`https://vamos.fullbusiness.io/api/hospedajes/obtener-hospedajes.php`);
    }
  }
  /* Obtener Hospedaje por Id */
  getHospedaje(idHospedaje: number): Observable<any> {
    return this.http.get(`https://vamos.fullbusiness.io/api/hospedajes/obtener-un-hospedaje.php?IdHospedaje=${idHospedaje}`);
  }
  /* Agregar Hospedaje */
  agregarHospedaje(formData: FormData): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/agregar-hospedaje.php`, formData);
  }
  /* Eliminar Hospedaje */
  eliminarHospedaje(IdHospedaje: number): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/eliminar-hospedaje.php`, { IdHospedaje: IdHospedaje });
  }
  /* Modificar Hospedaje */
  modificarHospedaje(hospedaje: any): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/modificar-hospedaje.php`, hospedaje);
  }

  /* Listar Hospedajes Destacados */
  getHospedajesDestacados(IdH1:number, IdH2:number, IdH3:number): Observable<any> {
    return this.http.get(`https://vamos.fullbusiness.io/api/hospedajes/obtener-hospedajes-destacados.php?IdH1=${IdH1}&IdH2=${IdH2}&IdH3=${IdH3}`);
  }

  /* Fotos */
  /* Obtener Fotos */
  getImagenes(idHospedaje: number): Observable<any> {
    return this.http.get(`https://vamos.fullbusiness.io/api/hospedajes/fotos/cargar-fotos.php?IdHospedaje=${idHospedaje}`);
  }
  /* Eliminar Foto */
  eliminarFoto(IdFoto: number): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/fotos/eliminar-foto.php`, { IdFoto: IdFoto });
  }
  /* Agregar Fotos */
  agregarFotos(formData: FormData): Observable<any>{
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/fotos/agregar-fotos.php`, formData);
  }
  /* Seleccionar Imagen Principal */
  seleccionarImagenPrincipal(IdHospedaje:number, NombreFoto:string): Observable<any>{
    return this.http.post(`https://vamos.fullbusiness.io/api/hospedajes/seleccionar-imagen-principal.php`, { IdHospedaje: IdHospedaje, NombreFoto: NombreFoto });
  }
}