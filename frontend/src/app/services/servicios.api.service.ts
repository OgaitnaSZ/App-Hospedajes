import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ServiciosApiService {
  constructor(private http: HttpClient, private login: LoginService) {}

  obtenerServicios(tipo: string): Observable<any> {
    return this.http.get(`https://vamos.fullbusiness.io/api/hospedajes/servicios/obtener-servicios.php?tipo=${tipo}`);
  }
}
