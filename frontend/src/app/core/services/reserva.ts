import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservaHospedaje } from '../interfaces/reservaHospedaje.model';
import { ReservaActividad } from '../interfaces/reservaActividad.model';
import { catchError, finalize, of, tap } from 'rxjs';
import { TokenService } from './token';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:4001/api/reserva/';

  // Inject
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  // Signals de estado
  reserva = signal<any | null>(null);
  reservasUsuario = signal<any | null>(null);
  fechasOcupadas = signal<any | null>(null);
  estadoPago = signal<string>('');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  reservarHospedaje(reserva: ReservaHospedaje): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.post(`${this.apiUrl}reservar-hospedaje`, reserva, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap(() => {
        this.success.set("Reserva exitosa");
      }),
      catchError(err => {
        this.error.set('Error al reservar hospedaje');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  reservarActividad(reserva: ReservaActividad) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post(`${this.apiUrl}reservar-actividad`, reserva, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap(() => {
        this.success.set("Reserva exitosa");
      }),
      catchError(err => {
        this.error.set('Error al reservar actividad');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // id reserva
  getReserva(id: string, tipo: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post(`${this.apiUrl}/reserva`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap((data) => {
        this.reserva.set(data);
      }),
      catchError(err => {
        this.error.set('Error al obtener reserva');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // id usuario
  getReservasUsuario(id: string, tipo: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post(`${this.apiUrl}/reservas-usuario`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap((data) => {
        this.reservasUsuario.set(data);
      }),
      catchError(err => {
        this.error.set('Error al obtener reservas');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // id reserva
  cancelarReserva(id: string, tipo: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post(`${this.apiUrl}/cancelar`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap(() => {
        this.success.set("Reserva pendiente de cancelacion");
      }),
      catchError(err => {
        this.error.set('Error al cancelar reserva');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // id hospedaje o actividad
  obtenerFechasOcupadas(id: string, tipo: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post(`${this.apiUrl}/fechas-ocupadas`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap((data) => {
        this.fechasOcupadas.set(data)
      }),
      catchError(err => {
        this.error.set('Error al obtener fechas ocupadas');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  verificarPagoHospedaje(idPreferencia: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<string>(`${this.apiUrl}/verificar-pago-hospedaje`, { idPreferencia }, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap((data) => {
        this.estadoPago.set(data);
      }),
      catchError(err => {
        this.error.set('Error al verificar pago');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  verificarPagoActividad(idPreferencia: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<string>(`${this.apiUrl}/verificar-pago-actividad`, { idPreferencia }, { headers: this.tokenService.createAuthHeaders() })
    .pipe(
      tap((data) => {
        this.estadoPago.set(data);
      }),
      catchError(err => {
        this.error.set('Error al verificar pago');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }
}