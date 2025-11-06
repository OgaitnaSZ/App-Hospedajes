import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { preferenciaMP } from '../interfaces/mercadopago.model';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {
  private preferenceUrl = 'https://app-hospedajes-backend.vercel.app/api/reservas/mercado-pago/crear-preferencia.php';
  private webhookUrl = 'https://app-hospedajes-backend.vercel.app/api/reservas/mercado-pago/webhook.php';
  mercadopago: any;

  // Inyecciones
  http = inject(HttpClient);
  
  // Signals
  preferenciaMP = signal<preferenciaMP | null>(null);
  estadoPago = signal<any | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  createPreference(preferenceData: any): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.post<preferenciaMP>(this.preferenceUrl, preferenceData).pipe(
      tap((data) => {
          this.preferenciaMP.set(data)
      }),
      catchError(err => {
      this.error.set('Error al crear preferencia');
      console.error(err);
      return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  verificarPago(preferenceId: any): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>(this.webhookUrl, preferenceId).pipe(
      tap((data) => {
          this.estadoPago.set(data)
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
