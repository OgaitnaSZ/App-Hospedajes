import { Component, signal, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title, Meta } from '@angular/platform-browser';
import { HospedajeService } from '../../../core/services/hospedaje';
import { UtilsService } from '../../../core/services/utils';
import { Carrucel } from '../../../layout/shared/carrucel/carrucel'
import { ActivatedRoute } from '@angular/router';
import { Disponibilidad } from './disponibilidad/disponibilidad';
import { Resenas } from '../../home/resenas/resenas';
import { HospedajeDetalles } from '../../../core/interfaces/hospedaje.model';

@Component({
  selector: 'app-hospedaje',
  standalone: true,
  imports: [Carrucel, Resenas, Disponibilidad],
  providers: [HospedajeService],
  templateUrl: './hospedaje.html'
})
export class Hospedaje {
  // Inyecciones
  readonly hospedajeService = inject(HospedajeService);
  readonly utilsService = inject(UtilsService);
  readonly route = inject(ActivatedRoute);
  readonly sanitizer = inject(DomSanitizer);
  readonly title = inject(Title);
  readonly meta = inject(Meta);

  // Variables
  idHospedaje: string = '';
  fotos: any | null;
  hospedaje = signal<HospedajeDetalles | null>(null);

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) return;
      
      this.idHospedaje = id;
      try {
        const data = await this.hospedajeService.getHospedaje(id);
        if (data) {
          this.hospedaje.set(data);
          this.fotos = this.hospedaje()?.fotos.map(url => ({
            url,
            alt: this.hospedaje()?.titulo
          }));
        } else {
          console.warn('Hospedaje no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener hospedaje', error);
      }
    });
  }

  getMapUrl(coords: string | undefined): SafeResourceUrl {
    const url = `https://www.google.com/maps?q=${coords}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
