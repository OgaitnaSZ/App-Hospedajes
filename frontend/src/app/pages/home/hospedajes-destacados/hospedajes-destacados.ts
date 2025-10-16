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
  readonly hospedajeService = inject(HospedajeService);

  hospedajesCargados = signal<HospedajeListado[]>([]);

  readonly hospedajes = computed(() => this.hospedajesCargados());
  readonly totalHospedajes = computed(() => this.hospedajes().length);
  readonly hayHospedajes = computed(() => this.totalHospedajes() > 0);

  async ngOnInit() {
    this.hospedajesCargados.set(await this.hospedajeService.getHospedajesDestacados());
  }
}
