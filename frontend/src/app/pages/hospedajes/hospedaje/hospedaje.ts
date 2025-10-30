import { Component, effect, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title, Meta } from '@angular/platform-browser';
import { HospedajeService } from '../../../core/services/hospedaje';
import { UtilsService } from '../../../core/services/utils';
import { Carrucel } from '../../../layout/shared/carrucel/carrucel'
import { ActivatedRoute } from '@angular/router';
import { Disponibilidad } from './disponibilidad/disponibilidad';
import { Resenas } from '../../home/resenas/resenas';

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
  fotos: any[] = [];
  hospedaje = this.hospedajeService.hospedaje;
  loading = this.hospedajeService.loading;
  error = this.hospedajeService.error;
  success = this.hospedajeService.success;

  constructor() {
    effect(() => {
      const h = this.hospedaje();
      if (h && h.fotos) {
        this.fotos = h.fotos.map(url => ({
          url,
          alt: h.titulo
        }));
      }
      console.log(this.hospedaje());
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idHospedaje = id;
        this.hospedajeService.getHospedaje(id);
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
