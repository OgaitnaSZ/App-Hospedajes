import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './token';
import { User, UserRegister } from '../interfaces/user.model';
import { catchError, finalize, of, tap } from 'rxjs';

interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4001/api/auth/';

  // Inject
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  // Signals de estado
  user = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(this.getStoredToken());
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Computed
  readonly isLoggedIn = computed(() => !!this.token());
  readonly currentUser = computed(() => this.user());

  constructor() {
    // Efecto para mantener sincronizado localStorage
    effect(() => {
      const token = this.token();
      const user = this.user();
  
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    });
  }

  // Login
  login(email: string, password: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.post<LoginResponse>(`${this.apiUrl}login`, { email, password }).pipe(
      tap((data) => {
        this.success.set("Login exitoso");
        this.user.set(data.data.user);
        this.token.set(data.data.token);
      }),
      catchError(err => {
        this.error.set('Error al iniciar session');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // Registro
  register(usuario: UserRegister): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.post(`${this.apiUrl}register`, usuario).pipe(
      tap(() => {
        this.success.set("Login exitoso");
      }),
      catchError(err => {
        this.error.set('Error al registrar usuario');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // Logout
  logout() {
    this.token.set(null);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  // Cambiar contraseña
  actualizarPassword(password: string, newPassword: string) {
    this.loading.set(true);
    this.error.set(null);

    const user = this.user();
    if (!user) throw new Error('Usuario no autenticado');
    
    this.http.put(`${this.apiUrl}update-password`,
        { idUsuario: user.idUsuario, password, newPassword },
        { headers: this.tokenService.createAuthHeaders() })
        .pipe(
          tap(() => {
            this.success.set("Password actualizado");
          }),
          catchError(err => {
            this.error.set('Error al actualizar password');
            console.error(err);
            return of(null);
          }),
          finalize(() => this.loading.set(false))
        ).subscribe();
  }

  // Recuperar contraseña
  recuperarPassword(email: string) {
    this.loading.set(true);
    this.error.set(null);

    this.http.post(`${this.apiUrl}recover-password`, { email }).pipe(
      tap(() => {
        this.success.set("Email enviado");
      }),
      catchError(err => {
        this.error.set('Error al recuperar password');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // Resetear contraseña
  resetearPassword(password: string, token: string) {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.post(`${this.apiUrl}reset-password`, { password, token }).pipe(
      tap(() => {
        this.success.set("Password actualizado");
      }),
      catchError(err => {
        this.error.set('Error al actualizar password');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // Helpers
  private getStoredUser(): User | null {
    const stored = localStorage.getItem('user');
    if (!stored || stored === 'undefined' || stored === 'null') {
      return null;
    }
  
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error al parsear usuario almacenado:', e);
      return null;
    }
  }
  
  private getStoredToken(): string | null {
    const stored = localStorage.getItem('token');
    if (!stored || stored === 'undefined' || stored === 'null') {
      return null;
    }
  
    return stored; // ✅ no uses JSON.parse aquí
  }

  // Accesores públicos (solo lectura)
  get getToken() {
    return this.token.asReadonly();
  }

  get getUser() {
    return this.user.asReadonly();
  }
}
