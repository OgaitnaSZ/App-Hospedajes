import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient, private login: LoginService) {}

  cargarDatos(): Observable<any> {
    //Obtener ID de la session
    const idSession = this.login.getUserId();
    return this.http.post<any>('https://vamos.fullbusiness.io/api/usuarios/obtener-datos-usuario.php', {IdUsuario: idSession});
  }

  actualizarDatos(userData: any): Observable<any> {
    const idSession = this.login.getUserId();
    return this.http.post<any>(`https://vamos.fullbusiness.io/api/usuarios/actualizar-datos-usuario.php`, {... userData, IdUsuario: idSession });
  }

  actualizarPassword(user: any): Observable<any> {
    return this.http.post<any>(`https://vamos.fullbusiness.io/api/usuarios/actualizar-password.php`, user);
  }

  /* Suscribirse al email */
  suscribirseEmail(email: string): Observable<any> {
    return this.http.post<any>(`https://vamos.fullbusiness.io/api/usuarios/suscribirse-email.php`, { email: email });
  }
}
