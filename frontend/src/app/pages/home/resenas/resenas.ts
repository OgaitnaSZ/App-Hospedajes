import { Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResenaService } from '../../../core/services/resena';
import { UtilsService } from '../../../core/services/utils';
import { ResenaHome } from '../../../core/interfaces/resena.model';

@Component({
  selector: 'app-resenas',
  imports: [CommonModule, RouterModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class Resenas {
  @Input() page: string | undefined; // pagina del componente padre
  @Input() idHospedaje: string | undefined; // pagina del componente padre

  readonly resenaService = inject(ResenaService);
  readonly utilsService = inject(UtilsService);
  resenasCargadas = signal<ResenaHome[]>([]);

  readonly resenas = computed(() => this.resenasCargadas());
  readonly totalResenas = computed(() => this.resenas().length);
  readonly hayResenas = computed(() => this.totalResenas() > 0)

  async ngOnInit() {
    if(this.page == 'home'){
      this.resenasCargadas.set(await this.resenaService.getMejoresResenas(4));
    }else if(this.page == 'hospedaje' && this.idHospedaje != null && this.idHospedaje != undefined){
      this.resenasCargadas.set(await this.resenaService.getMejoresResenas(4));
    }
  }
}
