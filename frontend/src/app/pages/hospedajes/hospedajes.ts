import { Component, inject, signal, computed, effect } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospedajeService } from '../../core/services/hospedaje';
import { UtilsService } from '../../core/services/utils';
import { DatesService } from '../../core/services/dates';
import { Datepicker } from '../../layout/shared/date-picker/date-picker';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-hospedajes',
  imports: [CommonModule, RouterModule, FormsModule, Datepicker],
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
  readonly datesService = inject(DatesService);

  // Signals del formulario y URL
  readonly destino = signal<string>('');
  readonly desde = signal<string>(this.formatDate(new Date()));
  readonly hasta = signal<string>('');
  readonly personas = signal<number>(1);
  readonly cualquierFecha = signal<boolean>(false);

  // Signal de resultados
  hospedajes = this.hospedajeService.hospedajes;
  loading = this.hospedajeService.loading;
  error = this.hospedajeService.error;
  success = this.hospedajeService.success;

  // Computed
  readonly totalHospedajes = computed(() => this.hospedajes().length);
  readonly hayHospedajes = computed(() => this.totalHospedajes() > 0 && !this.error());
  readonly fechaActual = new Date().toISOString().split('T')[0];

  mostrarDatepicker = signal<boolean>(false);

  constructor() {
    // Sincroniza parámetros de URL -> signals
    effect(() => {
      const params = this.route.snapshot.queryParams;
      this.destino.set(params['destino'] || '');
      this.desde.set(params['desde'] || '');
      this.hasta.set(params['hasta'] || '');
      this.personas.set(params['personas'] ? parseInt(params['personas'], 10) : 1);
      
      const saved = this.datesService.currentDates();
  
      // espera a tener ambos antes de ejecutar
      if (saved?.data) {
        this.desde.set(saved.data.fechaInicio.split('T')[0]);
        this.hasta.set(saved.data.fechaSalida.split('T')[0]);
      }
    });

    // Reacciona a cambios de filtros y actualiza hospedajes automáticamente
    effect(() => {
      const d = this.destino();
      const fi = this.desde();
      const ff = this.hasta();
      const p = this.personas();

      this.hospedajeService.getHospedajes(d, fi, ff, p);
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
          content: `http://localhost:4001/assets/uploads/hospedajes/${h[0].fotos}`
        });
      }
    });
  }

  // Métodos
  aplicarFiltros(): void {
    // Este método solo es necesario si querés forzar un reload manual,
    // pero con los signals y effects ya se actualiza automáticamente.
  }
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDatesSelected(dates: { start: Date; end: Date }): void {
    this.desde.set(this.formatDate(dates.start));
    this.hasta.set(this.formatDate(dates.end));
    this.mostrarDatepicker.set(false);
  }
}
