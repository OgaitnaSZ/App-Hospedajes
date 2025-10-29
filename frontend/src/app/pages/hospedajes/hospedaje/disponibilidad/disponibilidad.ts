import { Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../../../../core/services/habitacion';
import { DatesService } from '../../../../core/services/dates';
import { Datepicker } from '../../../../layout/shared/date-picker/date-picker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disponibilidad',
  imports: [CommonModule, FormsModule, Datepicker],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css'
})
export class Disponibilidad {
  @Input() idHospedaje: string | undefined;
  @Input() imagen:string | undefined;
  
  // Inyecciones
  readonly habitacionesService = inject(HabitacionService);
  readonly datesService = inject(DatesService);
  router = inject(Router);

  // Variables
  desde = signal<string>(this.formatDate(new Date()));
  hasta = signal<string>('');
  personas = signal<number>(1);
  mostrarDatepicker = signal<boolean>(false);
  hayHabitaciones = signal<boolean>(false);
  total = signal<number>(0);

  habitaciones = this.habitacionesService.habitaciones;
  loading = this.habitacionesService.loading;
  error = this.habitacionesService.error;
  success = this.habitacionesService.success;

  // Computed
  readonly totalHabitaciones = computed(() => this.habitaciones().length);
  readonly hayHospedajes = computed(() => this.totalHabitaciones() > 0);
  readonly fechaActual = new Date().toISOString().split('T')[0];

  private cargarFechasGuardadas() {
    const id = this.idHospedaje;
    const saved = this.datesService.currentDates();
  
    if (id && saved?.data) {
      this.desde.set(saved.data.fechaInicio.split('T')[0]);
      this.hasta.set(saved.data.fechaSalida.split('T')[0]);
      this.cargarHabitaciones();
    }
  }
  
  ngOnInit() {
    // Esperamos un poco para asegurarnos de que el @Input() ya llegó
    setTimeout(() => {
      this.cargarFechasGuardadas();
    }, 50);
  }


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
        this.habitacionesService.getHabitaciones(
          this.idHospedaje,
          this.desde(),
          this.hasta(),
          this.personas()
        );
        this.habitaciones().length > 0 ? this.hayHabitaciones.set(true) : this.hayHabitaciones.set(false)
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

  reservar(idHabitacion: string, precio: number, total:number, numHabitacion: string): void {
    const parametros = {
      idHabitacion: idHabitacion,
      idHospedaje: this.idHospedaje,
      precio: precio,
      precioTotal: total,
      fechaInicio: this.desde(),
      fechaFin: this.hasta(),
      personas: this.personas(),
      tituloHospedaje: "titulo",
      habitacion: numHabitacion,
      imagen: this.imagen,
      tipoReserva: "hospedaje"
    };
    sessionStorage.removeItem('reservaParametros');
    sessionStorage.setItem('reservaParametros', JSON.stringify(parametros));
    this.router.navigate(['/reservar']);
  }
}
