import { Component, computed, inject, Input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../../../../core/services/habitacion';
import { DatesService } from '../../../../core/services/dates';
import { HabitacionDetalle } from '../../../../core/interfaces/habitacion.model';
import { Datepicker } from '../../../../layout/shared/date-picker/date-picker';

@Component({
  selector: 'app-disponibilidad',
  imports: [CommonModule, FormsModule, Datepicker],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css'
})
export class Disponibilidad {
  @Input() idHospedaje: string | undefined;
  
  // Inyecciones
  readonly habitacionesService = inject(HabitacionService);
  readonly datesService = inject(DatesService);

  // Variables
  desde = signal<string>(this.formatDate(new Date()));
  hasta = signal<string>('');
  personas = signal<number>(1);
  mostrarDatepicker = signal<boolean>(false);
  hayHabitaciones = signal<boolean>(false);
  total = signal<number>(0);
  
  // Signal de resultados
  readonly habitacionesCargadas = signal<HabitacionDetalle[]>([]);
  
  // Computed
  readonly habitaciones = computed(() => this.habitacionesCargadas());
  readonly totalHabitaciones = computed(() => this.habitaciones().length);
  readonly hayHospedajes = computed(() => this.totalHabitaciones() > 0);
  readonly fechaActual = new Date().toISOString().split('T')[0];

  readonly syncEffect = effect(() => {
    const id = this.idHospedaje;
    const saved = this.datesService.currentDates();

    // espera a tener ambos antes de ejecutar
    if (id && saved?.data) {
      this.desde.set(saved.data.fechaInicio.split('T')[0]);
      this.hasta.set(saved.data.fechaSalida.split('T')[0]);
      this.cargarHabitaciones();
    }
  }); 

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  noches = computed(() => {
    const start = new Date(this.desde());
    const end = new Date(this.hasta());
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60 * 24);
  });

  async cargarHabitaciones() {
    try {
      if (this.idHospedaje && this.desde() && this.hasta()) {
        const data = await this.habitacionesService.getHabitaciones(
          this.idHospedaje,
          this.desde(),
          this.hasta(),
          this.personas()
        );
        this.habitacionesCargadas.set(data);
        this.hayHabitaciones.set(true);
      }
    } catch (error) {
      this.hayHabitaciones.set(false);
      console.error('Error al obtener habitaciones', error);
    }
  }

  onDatesSelected(dates: { start: Date; end: Date }): void {
    this.desde.set(this.formatDate(dates.start));
    this.hasta.set(this.formatDate(dates.end));
    this.mostrarDatepicker.set(false);
  }

  reservar(idHabitacion: string, precio: number, numHabitacion: string): void {
    // TODO: Lógica de reserva
    console.log('Reservar habitación:', idHabitacion, precio, numHabitacion);
  }
}
