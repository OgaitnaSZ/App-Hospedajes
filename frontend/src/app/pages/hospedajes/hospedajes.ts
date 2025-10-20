import { Component, inject, signal, computed, effect } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospedajeService } from '../../core/services/hospedaje';
import { UtilsService } from '../../core/services/utils';
import { Title, Meta } from '@angular/platform-browser';
import { HospedajeListado } from '../../core/interfaces/hospedaje.model';

@Component({
  selector: 'app-hospedajes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hospedajes.html',
  styleUrl: './hospedajes.css'
})
export class Hospedajes {
  // Inyecciones
  readonly hospedajeService = inject(HospedajeService);
  readonly route = inject(ActivatedRoute);
  readonly titleService = inject(Title);
  readonly metaService = inject(Meta);
  readonly utilsService = inject(UtilsService);

  // Signals del formulario y URL
  readonly destino = signal<string>('');
  readonly desde = signal<string>('');
  readonly hasta = signal<string>('');
  readonly personas = signal<number>(1);
  readonly cualquierFecha = signal<boolean>(false);

  // Signal de resultados
  readonly hospedajesCargados = signal<HospedajeListado[]>([]);

  // Computed
  readonly hospedajes = computed(() => this.hospedajesCargados());
  readonly totalHospedajes = computed(() => this.hospedajes().length);
  readonly hayHospedajes = computed(() => this.totalHospedajes() > 0);
  readonly fechaActual = new Date().toISOString().split('T')[0];

  constructor() {
    // Sincroniza parámetros de URL -> signals
    effect(() => {
      const params = this.route.snapshot.queryParams;
      this.destino.set(params['destino'] || '');
      this.desde.set(params['desde'] || '');
      this.hasta.set(params['hasta'] || '');
      this.personas.set(params['personas'] ? parseInt(params['personas'], 10) : 1);
    });

    // Reacciona a cambios de filtros y actualiza hospedajes automáticamente
    effect(async () => {
      const d = this.destino();
      const fi = this.desde();
      const ff = this.hasta();
      const p = this.personas();

      if (this.cualquierFecha()) {
        this.desde.set('');
        this.hasta.set('');
      }

      this.hospedajesCargados.set(await this.hospedajeService.getHospedajes(d, fi, ff, p));
      console.log(this.hospedajes());
    });

    // Efecto para metadatos dinámicos
    effect(() => {
      const d = this.destino();
      const h = this.hospedajes();

      const titulo = d ? `Los mejores hospedajes en ${d}` : 'Hospedajes disponibles';
      this.titleService.setTitle(titulo);
      this.metaService.updateTag({ property: 'og:title', content: titulo });

      if (h.length > 0) {
        this.metaService.updateTag({
          property: 'og:image',
          content: `http://localhost:4001/assets/uploads/hospedajes/${h[0].imagen}`
        });
      }
    });
  }

  // Métodos
  aplicarFiltros(): void {
    // Este método solo es necesario si querés forzar un reload manual,
    // pero con los signals y effects ya se actualiza automáticamente.
  }

  onCualquierFechaChange(): void {
    if (this.cualquierFecha()) {
      this.desde.set('');
      this.hasta.set('');
    }
  }
}
