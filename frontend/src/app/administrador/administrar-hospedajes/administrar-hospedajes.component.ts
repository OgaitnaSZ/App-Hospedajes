import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HospedajeApiService } from '../../services/hospedaje.api.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-administrar-hospedajes',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterLink, RouterLinkActive, RouterModule],
  providers: [HospedajeApiService],
  templateUrl: './administrar-hospedajes.component.html',
})
export class AdministrarHospedajesComponent {
  constructor(private hospedajeService: HospedajeApiService) {}
  hospedajes: any[] = [];
  mensaje: string = '';

  ngOnInit(): void {
    this.cargarHospedajes();
  }

  cargarHospedajes(){
    this.hospedajes = [];
    this.hospedajeService.getHospedajes('').subscribe(
      (data) => {
        this.hospedajes = Array.isArray(data) ? data : [];  // Asegurar que sea un array
      },
      (error) => {
        console.error('Error al cargar hospedajes:', error);
      }
    );
  }
  getTextoCorto(texto: string): string {
    return texto.length > 30 ? texto.substring(0, 30) + ' ...' : texto;
  }

  //Eliminar Hospedaje
  eliminar(IdHospedaje: number){
    if (confirm('¿Estás seguro de que deseas eliminar este hospedaje?')) {
      this.hospedajeService.eliminarHospedaje(IdHospedaje).subscribe(
        (response) => {
          this.cargarHospedajes();
          console.log('Elimnacion exitosa:', response);
          this.mensaje = 'Elimnacion exitosa.';
        },
        (error) => {
          console.error('Error al eliminar hospedaje:', error);
          this.mensaje = 'Error al eliminar hospedaje.';
        }
      );
    }
  }
}
