import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://vamos.fullbusiness.io/api/usuarios/login.php';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, pass: string) {
    return this.http.post<{ token: string ; idUsuario: number ; rol: string}>(this.apiUrl, { email, pass });
  }

  crearUsuario(userData:any): Observable<any> {
    return this.http.post(`https://vamos.fullbusiness.io/api/usuarios/register.php`, userData);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  setRol(rol: string) {
    console.log("Intentando guardar rol: "+rol)
    localStorage.setItem('rol', rol);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  getRol() {
    return localStorage.getItem('rol');
  }

  setUserId(idUsuario: number) {
    localStorage.setItem('idUsuario', idUsuario.toString());
    localStorage.setItem('testClave', "testValor");
  }

  getUserId(): number | null {
    const id = localStorage.getItem('idUsuario');
    return id ? parseInt(id, 10) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  recuperarPassword(emailRec: string): Observable<any> {
    return this.http.post<any>(`https://vamos.fullbusiness.io/api/usuarios/recuperar-password.php`, { emailRec: emailRec });
  }
}
