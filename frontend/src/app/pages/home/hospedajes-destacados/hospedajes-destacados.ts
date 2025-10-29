import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HospedajeService } from '../../../core/services/hospedaje';
import { HospedajeListado } from '../../../core/interfaces/hospedaje.model';

@Component({
  selector: 'app-hospedajes-destacados',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './hospedajes-destacados.html',
  styleUrl: './hospedajes-destacados.css'
})
export class HospedajesDestacados {
  // Servicios
  readonly hospedajeService = inject(HospedajeService);

  // Hospedajes
  hospedajesDestacados = this.hospedajeService.hospedajesDestacados;
  loading = this.hospedajeService.loading;
  error = this.hospedajeService.error;
  success = this.hospedajeService.success;

  readonly totalHospedajes = computed(() => this.hospedajesDestacados().length);
  readonly hayHospedajes = computed(() => this.totalHospedajes() > 0);

  ngOnInit() {
    this.hospedajeService.getHospedajesDestacados();
  }
}
