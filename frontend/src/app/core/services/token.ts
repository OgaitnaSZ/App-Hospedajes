import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root' 
})
export class TokenService {

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  createAuthHeaders(contentType: string = 'application/json'): HttpHeaders {
    const token = this.getToken();
    
    // Si el token existe, incluye 'Bearer', si no, es una cadena vacía.
    const headersConfig: { [name: string]: string | string[] } = {
      'Content-Type': contentType
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headersConfig);
  }
}