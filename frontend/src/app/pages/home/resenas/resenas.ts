import { Component, computed, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResenaService } from '../../../core/services/resena';
import { ResenaHome } from '../../../core/interfaces/resena.model';

@Component({
  selector: 'app-resenas',
  imports: [CommonModule, RouterModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class Resenas {
  @Input() page: string | undefined; // pagina del componente padre
  @Input() idHospedaje: number | undefined; // pagina del componente padre
  @ViewChild('calificaciones') calificaciones!: ElementRef;

  readonly resenaService = inject(ResenaService);
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

  obtenerEstrellas(cantidad: number) : number[]{
    let estrellas: number[] = [];
    if(cantidad != null && cantidad != undefined){
      for(let i=0 ; i<cantidad ; i++){
        estrellas.push(1);
      }
    }
    return estrellas;
  }

  scrollToCalificaciones() {
    this.calificaciones.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
