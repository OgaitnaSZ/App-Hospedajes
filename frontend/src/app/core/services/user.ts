import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token';
import { User } from '../interfaces/user.model';

interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4001/api/user/';

  // Signals de estado
  private _state = signal<UserState>({
    data: this.getStoredUserData(),
    isLoading: false,
    error: null
  });

  // Computed (derivados) - solo lectura para componentes
  readonly userData = computed(() => this._state().data);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly hasUserData = computed(() => !!this._state().data);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    // Efecto para sincronizar con localStorage
    effect(() => {
      const userData = this.userData();
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        localStorage.removeItem('userData');
      }
    });
  }

  // Cargar datos del usuario
  async loadUserData(idUsuario: string): Promise<void> {
    this._updateState({ isLoading: true, error: null });
    
    try {
      const response = await this.http
        .get<{ usuario: User }>(`${this.apiUrl}get-data/${idUsuario}`, { 
          headers: this.tokenService.createAuthHeaders() 
        })
        .toPromise();

      this._updateState({ 
        data: response?.usuario || null, 
        isLoading: false 
      });
      
    } catch (error: any) {
      this._updateState({ 
        error: error?.message || 'Error al cargar datos del usuario',
        isLoading: false 
      });
      throw error;
    }
  }

  // Actualizar datos del usuario
  async updateUserData(usuario: User): Promise<void> {
    this._updateState({ isLoading: true, error: null });
    
    try {
      await this.http
        .put(`${this.apiUrl}update-data`, usuario, { 
          headers: this.tokenService.createAuthHeaders() 
        })
        .toPromise();

      // Actualizar el estado local con los nuevos datos
      this._updateState({ 
        data: usuario, 
        isLoading: false 
      });
      
    } catch (error: any) {
      this._updateState({ 
        error: error?.message || 'Error al actualizar datos',
        isLoading: false 
      });
      throw error;
    }
  }

  // Suscribir email (no afecta el estado del usuario)
  async subscribeEmail(email: string): Promise<any> {
    return await this.http
      .post<any>(`${this.apiUrl}subscribe-email`, { email })
      .toPromise();
  }

  // Limpiar estado (útil para logout)
  clearUserData(): void {
    this._updateState({
      data: null,
      error: null,
      isLoading: false
    });
  }

  // Helper para actualizar estado parcialmente
  private _updateState(partialState: Partial<UserState>): void {
    this._state.update(current => ({ ...current, ...partialState }));
  }

  // Helper para obtener datos almacenados
  private getStoredUserData(): User | null {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  }
}