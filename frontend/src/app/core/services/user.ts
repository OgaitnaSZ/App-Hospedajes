import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token';
import { User } from '../interfaces/user.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4001/api/user/';

  // Inject
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  // Signals de estado
  userData = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Cargar datos del usuario
  loadUserData(idUsuario: string): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.get<{ usuario: User }>(`${this.apiUrl}get-data/${idUsuario}`, 
      { headers: this.tokenService.createAuthHeaders() }).pipe(
        tap((data) => {
            this.userData.set(data.usuario)
        }),
        catchError(err => {
          this.error.set('Error al obtener datos de usuario');
          console.error(err);
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      ).subscribe();
  }

  // Actualizar datos del usuario
  updateUserData(usuario: User): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.put<any>(`${this.apiUrl}update-data`, usuario, 
      { headers: this.tokenService.createAuthHeaders() }).pipe(
        tap((data) => {
          this.success.set("Usuario actualizado");
          this.userData.set(data)
        }),
              catchError(err => {
        this.error.set('Error al actualizar datos de usuario');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // Suscribir email (no afecta el estado del usuario)
  subscribeEmail(email: string): any {
    this.http.post<any>(`${this.apiUrl}subscribe-email`, { email }).pipe(
      tap(() => {
        this.success.set("Usuario suscripto con exito")
      }),
      catchError(err => {
        this.error.set('Error al suscribir');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }
}