import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HospedajeApiService } from '../services/hospedaje.api.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-hospedajes',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  providers: [HospedajeApiService],
  templateUrl: './hospedajes.component.html',
})

export class HospedajesComponent {
  hospedajes: any[] = [];
  hayHospedajes: Boolean = false;  // Se muestra el componente si hay hospedajes

  fechaActual: string = new Date().toISOString().split('T')[0];
  desde: string = '';
  hasta: string = '';
  destino: string = '';
  personas: number = 0;
  cualquierFecha: boolean = false; // Nueva variable para controlar la casilla

  constructor(private hospedajeService: HospedajeApiService, 
              private route:ActivatedRoute, 
              private titleService: Title, 
              private metaService: Meta
  ) {}
  ngOnInit(): void {
    // Acceder a los parámetros GET de la URL
    this.route.queryParams.subscribe(params => {
      this.destino = params['destino'];
      this.desde = params['desde'];
      this.hasta = params['hasta'];
      this.personas = params['personas'] ? parseInt(params['personas'], 10) : 0;
    });
    this.cargarHospedajes();

    this.titleService.setTitle("Los mejores hospedajes en "+ this.destino);
    this.metaService.updateTag({ property: 'og:title', content: "Los mejores hospedajes en "+ this.destino });
    this.metaService.updateTag({ property: 'og:image', content: `https://vamos.fullbusiness.io/assets/uploads/hospedajes/${this.hospedajes[0].Imagen}`});
  }

  cargarHospedajes(): void {
    const params = new URLSearchParams();
    if (this.destino) params.append('destino', this.destino);
    if (this.desde) params.append('desde', this.desde);
    if (this.hasta) params.append('hasta', this.hasta);
    if (this.personas) params.append('personas', this.personas.toString());

    this.hospedajeService.getHospedajes(params.toString()).subscribe(
      (data) => {
        // Verifica si data es un objeto (solo una reserva) o un arreglo
        if (Array.isArray(data)) {
          this.hospedajes = data;  // Si es un arreglo, asigna directamente
        } else {
          this.hospedajes = [data];  // Si es un objeto, lo convierte en un arreglo
        }
        console.log(this.hospedajes);
        if(data.message == 'No hay actividades disponibles.'){
          this.hayHospedajes = false;
        }else{
          this.hayHospedajes = true; 
        }
      },
      (error) => {
        this.hayHospedajes = false;
      }
    );
  }

  aplicarFiltros(): void {
    this.cargarHospedajes();
    console.log(this.desde);
  }
  onCualquierFechaChange(): void {
    if (this.cualquierFecha) {
      this.desde = '';
      this.hasta = '';
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
}
