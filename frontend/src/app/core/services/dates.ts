import { Injectable, signal, effect, computed } from '@angular/core';

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
  dates = signal<Fechas | null>(this.getStoredDates());
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Computed
  readonly currentDates = computed(() => this.dates());

  constructor() {
    //  Efecto para mantener sincronizado localStorage
    effect(() => {
      const dates = this.dates();
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
    this.dates.set({
      data: {
        fechaInicio: start.toISOString(),
        fechaSalida: end.toISOString(),
      },
    });
  }
}
