import { Injectable, signal, computed, effect } from '@angular/core';

interface Fechas {
  data: {
    fechaInicio: string;
    fechaSalida: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DatesService {
  // Signals de estado
  private _isLoading = signal(false);
  private _dates = signal<Fechas | null>(this.getStoredDates());

  // Computed (derivados)
  readonly isLoading = computed(() => this._isLoading());
  readonly currentDates = computed(() => this._dates());

  constructor() {
    //  Efecto para mantener sincronizado localStorage
    effect(() => {
      const dates = this._dates();
      if (dates) {
        localStorage.setItem('dates', JSON.stringify(dates));
      } else {
        localStorage.removeItem('dates');
      }
    });
  }

  private getStoredDates(): Fechas | null {
    const stored = localStorage.getItem('dates');
    return stored ? JSON.parse(stored) : null;
  }

  setDates(start: Date, end: Date) {
    this._dates.set({
      data: {
        fechaInicio: start.toISOString(),
        fechaSalida: end.toISOString(),
      },
    });
  }
}
