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
  @Input() resenasHospedaje: ResenaHome[] | undefined; // pagina del componente padre

  // Inyecciones
  readonly resenaService = inject(ResenaService);
  readonly utilsService = inject(UtilsService);

  // Signals
  resenas = this.resenaService.resenasDestacadas;
  loading = this.resenaService.loading;
  error = this.resenaService.error;
  success = this.resenaService.success;

  readonly totalResenas = computed(() => this.resenas().length);
  readonly hayResenas = computed(() => this.totalResenas() > 0)

  async ngOnInit() {
    if(this.resenasHospedaje != undefined){
      console.log(this.resenasHospedaje)
      this.resenas.set(this.resenasHospedaje);
    }else{
      this.resenaService.getMejoresResenas(4);
    }
  }
}
