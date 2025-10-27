import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Mercadopago {
  http = inject(HttpClient);

  private preferenceUrl = 'https://vamos.fullbusiness.io/api/reservas/mercado-pago/crear-preferencia.php';
  private webhookUrl = 'https://vamos.fullbusiness.io/api/reservas/mercado-pago/webhook.php';
  mercadopago: any;
  
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  async createPreference(preferenceData: any): Promise<{ preference_id: string, id_pago: string } | any> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const data = await this.http.post<{ preference_id: string, id_pago: string }>(this.preferenceUrl, preferenceData).toPromise();
      if(data) return data;
    } catch (error: any) {
      this._error.set(error.message || 'Error al pagar');
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }

  async verificarPago(preferenceId: any): Promise<any> {
    this._isLoading.set(true);
    this._error.set(null);

    try{
      const data = await this.http.post<any>(this.webhookUrl, preferenceId).toPromise();
      if(data) return data;
    }catch (error: any) {
      this._error.set(error.message || 'Error al verificar pago');
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }
}
