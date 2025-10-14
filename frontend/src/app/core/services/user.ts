import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token';
import { User } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4001/api/user/';

  constructor(
            private http: HttpClient,
            private tokenService: TokenService 
          ) {}

  getData(idUsuario: string) {
    return this.http.get<{ usuario: User }>(`${this.apiUrl}get-data/${idUsuario}`, { headers: this.tokenService.createAuthHeaders() });
  }

  updateData(usuario:User) {
    return this.http.put(`${this.apiUrl}update-data`, usuario, { headers: this.tokenService.createAuthHeaders() });
  }

  suscribeEmail(email: string) {
    return this.http.post<any>(`${this.apiUrl}subscribe-email`, { email });
  }
}
