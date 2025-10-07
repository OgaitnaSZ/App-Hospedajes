import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {
  constructor(private http: HttpClient, private login: LoginService) {}

  private preferenceUrl = 'https://vamos.fullbusiness.io/api/reservas/mercado-pago/crear-preferencia.php';
  private webhookUrl = 'https://vamos.fullbusiness.io/api/reservas/mercado-pago/webhook.php';

  mercadopago: any;

  createPreference(preferenceData: any): Observable<{ preference_id: string, id_pago: string }> {
    return this.http.post<{ preference_id: string, id_pago: string }>(this.preferenceUrl, preferenceData);
  }

  verificarPago(preferenceId: any): Observable<any> {
    return this.http.post<any>(this.webhookUrl, preferenceId);
  }
}
