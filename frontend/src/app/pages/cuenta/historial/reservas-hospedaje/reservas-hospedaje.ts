import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../../core/services/reserva';
import { DetallesReserva } from '../detalles-reserva/detalles-reserva';

@Component({
  selector: 'app-reservas-hospedaje',
  imports: [CommonModule, DetallesReserva],
  templateUrl: './reservas-hospedaje.html',
  styleUrl: './reservas-hospedaje.css'
})
export class ReservasHospedaje {
  @Input() idUsuario: string | undefined;

  // Servicios
  reservaService = inject(ReservaService);

  // Signals
  reservas = this.reservaService.reservasUsuario;
  loading = this.reservaService.loading;
  error = this.reservaService.error;
  success = this.reservaService.success;

  // Computed
  readonly totalReservas = computed(() => this.reservas().length);
  readonly hayReservas = computed(() => this.totalReservas() > 0 && !this.error());

  indiceDetalle: string | null = null; // Índice de la reserva seleccionada

  ngOnInit(): void {
    if (!this.idUsuario) return;
    this.reservaService.getReservasUsuario(this.idUsuario, 'hospedaje');
  }
}
