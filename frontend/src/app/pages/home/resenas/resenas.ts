import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-resenas',
  imports: [],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class Resenas {
  @Input() page: string | undefined; // pagina del componente padre
  @Input() IdHospedaje: number | undefined; // pagina del componente padre
  @ViewChild('calificaciones') calificaciones!: ElementRef;
}
