import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DetallesComponent } from './detalles/detalles.component';
import { ReservaApiService } from '../../services/reserva.api.service';

@Component({
  selector: 'app-alojamientos',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, DetallesComponent],
  providers: [],
  templateUrl: './historial.component.html',
})
export class HistorialComponent {
  reservas: any[] = [];
  hayReservas: boolean = false;
  indiceDetalle: number | null = null; // Índice de la propiedad seleccionada

  constructor(private reservaService: ReservaApiService) {}

  ngOnInit(): void {
    this.reservaService.getReservasUsuario().subscribe(
      (reservas) => {
        this.reservas = reservas;
        console.log(reservas);
        this.hayReservas = reservas.length > 0;
      },
      (error) => {
        console.error('Error al cargar las reservas:', error);
      }
    );
  }
}
