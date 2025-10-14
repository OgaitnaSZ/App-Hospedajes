import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token';
import { Resena } from '../interfaces/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
      private apiUrl = 'http://localhost:4001/api/resena/';
    
      constructor(
                    private http: HttpClient,
                    private tokenService: TokenService
                  ) {}

    getResenasUsuario(idUsuario:string, idHospedaje: string, idHabitacion: string) {
        return this.http.get(`${this.apiUrl}/usuario/${idUsuario}/hospedaje/${idHospedaje}/habitacion/${idHabitacion}`, { headers: this.tokenService.createAuthHeaders() });
    }

    getMejoresResenas(cantidad: number) {
        return this.http.get(`${this.apiUrl}mejores/${cantidad}`);
    }

    agregarResena(resena: Resena){
        return this.http.post(`${this.apiUrl}agregar`, resena, { headers: this.tokenService.createAuthHeaders() });
    }

    modificarResena(resena: Resena) {
        return this.http.put(`${this.apiUrl}modificar`, resena, { headers: this.tokenService.createAuthHeaders() });
    }

    eliminarResena(idResena: string) {
        return this.http.delete(`${this.apiUrl}eliminar/${idResena}`, { headers: this.tokenService.createAuthHeaders() });
    }
}