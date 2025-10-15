import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from './token';
import { User, UserRegister } from '../interfaces/user.model';

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

  // Signals de estado
  private _isLoading = signal(false);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<User | null>(this.getStoredUser());

  // Computed (derivados)
  readonly isLoading = computed(() => this._isLoading());
  readonly isLoggedIn = computed(() => !!this._token());
  readonly currentUser = computed(() => this._user());

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    //  Efecto para mantener sincronizado localStorage
    effect(() => {
      const token = this._token();
      const user = this._user();
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
  async login(email: string, password: string): Promise<boolean> {
    this._isLoading.set(true);
    try {
      const res = await this.http
        .post<LoginResponse>(`${this.apiUrl}login`, { email, password })
        .toPromise();

      if (res?.data?.token && res.data.user) {
        this._token.set(res.data.token);
        this._user.set(res.data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  // Registro
  async register(usuario: UserRegister): Promise<any> {
    this._isLoading.set(true);
    try {
      return await this.http.post(`${this.apiUrl}register`, usuario).toPromise();
    } finally {
      this._isLoading.set(false);
    }
  }

  // Logout
  logout() {
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  // Cambiar contraseña
  async actualizarPassword(password: string, newPassword: string) {
    const user = this._user();
    if (!user) throw new Error('Usuario no autenticado');
    return await this.http
      .post<any>(
        `${this.apiUrl}update-password`,
        { idUsuario: user.idUsuario, password, newPassword },
        { headers: this.tokenService.createAuthHeaders() }
      )
      .toPromise();
  }

  // Recuperar contraseña
  async recuperarPassword(email: string) {
    return await this.http.post<any>(`${this.apiUrl}recover-password`, { email }).toPromise();
  }

  // Resetear contraseña
  async resetearPassword(password: string, token: string) {
    return await this.http.post<any>(`${this.apiUrl}reset-password`, { password, token }).toPromise();
  }

  // Helpers
  private getStoredUser(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  // Accesores públicos (solo lectura)
  get token() {
    return this._token.asReadonly();
  }

  get user() {
    return this._user.asReadonly();
  }
}
