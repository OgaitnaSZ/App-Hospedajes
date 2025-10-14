import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './token';
import { User } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4001/api/auth/';

  constructor(
            private http: HttpClient, 
            private router: Router,
            private tokenService: TokenService 
          ) {}

  login(email: string, password: string) {
    return this.http.post<{ data: any }>(`${this.apiUrl}login`, { email, password });
  }

  register(usuario:User){
    return this.http.post(`${this.apiUrl}register`, usuario);
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

  actualizarPassword(idUsuario: string, password: string, newPassword: string){
    return this.http.post<any>(`${this.apiUrl}update-password`, { idUsuario, password, newPassword }, { headers: this.tokenService.createAuthHeaders() });
  }

  recuperarPassword(email: string){
    return this.http.post<any>(`${this.apiUrl}recover-password`, { email });
  }

  resetearPassword(password: string, token: string){
    return this.http.post<any>(`${this.apiUrl}reset-password`, { password, token });
  }
}
