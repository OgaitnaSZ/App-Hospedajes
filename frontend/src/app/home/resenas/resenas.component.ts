import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResenasApiService } from '../../services/resenas.api.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resenas.component.html',
  styleUrl: './resenas.component.css'
})
export class ResenasComponent {
  @Input() page: string | undefined; // pagina del componente padre
  @Input() IdHospedaje: number | undefined; // pagina del componente padre
  @ViewChild('calificaciones') calificaciones!: ElementRef;

  constructor(private resenaService: ResenasApiService){}
  hayResenas: boolean = false;
  resenas: any[] = [];

  ngOnInit(): void {
    if(this.page == 'home'){
      this.cargarMejoresResenas();
    }else if(this.page == 'hospedaje' && this.IdHospedaje != null && this.IdHospedaje != undefined){
      this.cargarResenasHospedaje(this.IdHospedaje);
    }
  }

  cargarMejoresResenas(){
    this.resenaService.cargarMejoresResenas(4).subscribe(
      (resenas) => {
        this.resenas = resenas;
        this.hayResenas = true;
        console.log(resenas);
      },
      (error)=>{
        console.error('Error al cargar reseñas:', error);
        this.hayResenas = false;
      }
    )
  }

  cargarResenasHospedaje(IdHospedaje: number){
    this.resenaService.cargarResenasHospedaje(IdHospedaje).subscribe(
      (resenas) => {
        if (Array.isArray(resenas)) {
          this.resenas = resenas; 
        } else {
          this.resenas = [resenas];
        }
        if(this.resenas[0].Calificacion != null){
          this.hayResenas = true;
        }
        console.log(resenas);
      },
      (error)=>{
        console.error('Error al cargar reseñas:', error);
        this.hayResenas = false;
      }
    )
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
