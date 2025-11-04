import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../../core/services/reserva';
import { DetallesReserva } from '../detalles-reserva/detalles-reserva';

@Component({
  selector: 'app-reservas-actividad',
  imports: [CommonModule, DetallesReserva],
  templateUrl: './reservas-actividad.html',
  styleUrl: './reservas-actividad.css'
})
export class ReservasActividad {
  @Input() idUsuario: string | undefined;

  // Servicios
  reservaService = inject(ReservaService);

  // Signals
  reservas = this.reservaService.reservasActividades;
  loading = this.reservaService.loading;
  error = this.reservaService.error;
  success = this.reservaService.success;

  // Computed
  readonly totalReservas = computed(() => this.reservas().length);
  readonly hayReservas = computed(() => this.totalReservas() > 0 && !this.error());

  indiceDetalle: string | null = null; // Índice de la reserva seleccionada

  ngOnInit(): void {
    if (!this.idUsuario) return;
    this.reservaService.getReservasUsuario(this.idUsuario, 'actividad');
  }
}
