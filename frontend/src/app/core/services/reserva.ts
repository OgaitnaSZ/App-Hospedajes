import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token';
import { ReservaHospedaje } from '../interfaces/reservaHospedaje.model';
import { ReservaActividad } from '../interfaces/reservaActividad.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:4001/api/reserva/';

  constructor(
                private http: HttpClient,
                private tokenService: TokenService
              ) {}

    reservarHospedaje(reserva: ReservaHospedaje) {
        return this.http.post(`${this.apiUrl}reservar-hospedaje`, reserva, { headers: this.tokenService.createAuthHeaders() });
    }

    reservarActividad(reserva: ReservaActividad) {
        return this.http.post(`${this.apiUrl}reservar-actividad`, reserva, { headers: this.tokenService.createAuthHeaders() });
    }

    // id reserva
    getReserva(id: string, tipo: string) {
      return this.http.post(`${this.apiUrl}/reserva`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() });
    }

    // id usuario
    getReservasUsuario(id: string, tipo: string) {
      return this.http.post(`${this.apiUrl}/reservas-usuario`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() });
    }

    // id reserva
    cancelarReserva(id: string, tipo: string) {
      return this.http.post(`${this.apiUrl}/cancelar`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() });
    }

    // id hospedaje o actividad
    obtenerFechasOcupadas(id: string, tipo: string) {
      return this.http.post(`${this.apiUrl}/fechas-ocupadas`, { id, tipo }, { headers: this.tokenService.createAuthHeaders() });
    }

    verificarPagoHospedaje(idPreferencia: string) {
        return this.http.post(`${this.apiUrl}/verificar-pago-hospedaje`, { idPreferencia }, { headers: this.tokenService.createAuthHeaders() });
    }

    verificarPagoActividad(idPreferencia: string) {
        return this.http.post(`${this.apiUrl}/verificar-pago-actividad`, { idPreferencia }, { headers: this.tokenService.createAuthHeaders() });
    }
}