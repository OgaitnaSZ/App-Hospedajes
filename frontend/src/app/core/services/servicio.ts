import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servicio } from '../interfaces/servicio.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:4001/api/servicio';

  // Inject
  private http = inject(HttpClient);

  // Signals de estado
  servicios = signal<Servicio | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  getServicios(tipo: string): void {
    this.loading.set(true);
    this.error.set(null);
    const parametros = `tipo=${tipo}`;
    
    this.http.get<Servicio>(`${this.apiUrl}?${parametros}`).pipe(
      tap((data) => {
          this.servicios.set(data)
      }),
      catchError(err => {
        this.error.set('Error al obtener servicios');
        console.error(err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }
}