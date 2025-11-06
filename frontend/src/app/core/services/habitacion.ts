import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Habitacion, HabitacionDetalle } from '../interfaces/habitacion.model';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private apiUrl = 'https://app-hospedajes-backend.vercel.app/api/habitacion/';

  // Inject
  private http = inject(HttpClient);

  // Estado base del servicio
  habitaciones = signal<HabitacionDetalle[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  /* Listar Habitaciones */
  getHabitaciones(idHospedaje: string, desde: string, hasta: string, capacidad: number): void {
      this.loading.set(true);
      this.error.set(null);

      const params = `idHospedaje=${idHospedaje}&desde=${desde}&hasta=${hasta}&capacidad=${capacidad}`;

      this.http.get<HabitacionDetalle[]>(`${this.apiUrl}hospedaje?${params}`).pipe(
        tap((data) => {
            this.habitaciones.set(data)
        }),
        catchError(err => {
          this.error.set('Error al obtener hospedajes');
          console.error(err);
          return [];
        }),
        finalize(() => this.loading.set(false))
      ).subscribe();
  }
}