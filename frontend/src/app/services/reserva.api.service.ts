import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaApiService {
  constructor(private http: HttpClient, private login: LoginService) {}

    /* Obtener Reserva por id */
    getReserva(IdReserva: number): Observable<any> {
      return this.http.post(`https://vamos.fullbusiness.io/api/reservas/obtener-reserva.php`, { IdReserva: IdReserva});
    }

    /* Obtener Reservas por usuario */
    getReservasUsuario(): Observable<any> {
      const IdUsuario = this.login.getUserId();
      return this.http.post(`https://vamos.fullbusiness.io/api/reservas/obtener-reservas-por-usuario.php`, { IdUsuario: IdUsuario});
    }

    /* Reservar Hospedaje */
    reservarHospedaje(datosReserva: any): Observable<any> {
      const IdUsuario = this.login.getUserId();
      if(IdUsuario != null) {
        datosReserva.IdUsuario = IdUsuario;
      }
      return this.http.post(`https://vamos.fullbusiness.io/api/reservas/reservar-hospedaje.php`, datosReserva);
    }

    /* Reservar Actividad */
    reservarActividad(datosReserva: any): Observable<any> {
      const IdUsuario = this.login.getUserId();
      if(IdUsuario != null) {
        datosReserva.IdUsuario = IdUsuario;
      }
      return this.http.post(`https://vamos.fullbusiness.io/api/reservas/reservar-actividad.php`, datosReserva);
    }

    /* Cancelar Reserva */
    cancelarReserva(IdReserva: number): Observable<any> {
      return this.http.post(`https://vamos.fullbusiness.io/api/reservas/cancelar-reserva.php`, {IdReserva});
    }

    /* Obtener fechas ocupadas */
    getFechasOcupadas(IdHospedaje: number): Observable<any> {
      return this.http.post(`https://vamos.fullbusiness.io/api/reservas/obtener-fechas-ocupadas.php`, {IdHospedaje: IdHospedaje});
    }

    /* Verificar Pago */
    verificarPago(IdPreferencia: string): Observable<any> {
      return this.http.post(`https://vamos.fullbusiness.io/api/reservas/verificar-pago.php`, { IdPreferencia: IdPreferencia });
    }
}
