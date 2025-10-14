import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:4001/api/auth/';

  // Crear los encabezados con el Bearer Token
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.getToken()}`, // Obtener token
    'Content-Type': 'application/json'
  });

  private createHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ data: any }>(`${this.apiUrl}login`, { email, password });
  }

  register(usuario:User): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, usuario);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUserId(idUsuario: number) {
    localStorage.setItem('idUsuario', idUsuario.toString());
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

  actualizarPassword(idUsuario: string, password: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}update-password`, { idUsuario, password, newPassword });
  }

  recuperarPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}recover-password`, { email });
  }

  resetearPassword(password: string, token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}reset-password`, { password, token });
  }
}
