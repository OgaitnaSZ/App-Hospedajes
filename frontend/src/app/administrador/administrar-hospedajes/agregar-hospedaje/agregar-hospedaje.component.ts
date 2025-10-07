import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HospedajeApiService } from '../../../services/hospedaje.api.service';
import { ServiciosApiService } from '../../../services/servicios.api.service';

@Component({
  selector: 'app-agregar-hospedaje',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  providers: [HospedajeApiService],
  templateUrl: './agregar-hospedaje.component.html',
})
export class AgregarHospedajeComponent {
  constructor(private hospedajeService: HospedajeApiService, private serviciosService: ServiciosApiService, private router: Router) {}
  imagenes: File[] = [];
  imagenError: string = '';
  
  servicios: any[] = [];
  serviciosSeleccionados: number[] = []
  nuevoHospedaje = {
    IdHospedaje: 0,
    Titulo: '',
    Descripcion: '',
    Servicios: '',
    Estrellas: 0,
    Telefono: '',
    Ciudad: '',
    Direccion: '',
    Imagen: '',
    CalificacionPromedio : 0,
    Coordenadas: '',
  };

  ngOnInit(){
    // Obtener servicios para el select
    this.serviciosService.obtenerServicios("hospedaje").subscribe(
      (servicios) => {
        this.servicios = servicios; 
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
      }
    );
  }

  almacenarServicios(event: any) {
    if (event.target.checked) {
      this.serviciosSeleccionados.push(Number(event.target.value));
    } else {
      const index = this.serviciosSeleccionados.indexOf(Number(event.target.value));
      if (index > -1) {
        this.serviciosSeleccionados.splice(index, 1);
      }
    }
  }

  // Captura de fotos seleccionadas
  onFileChange(event: any): void {
    if (event.target.files) {
      this.imagenes = Array.from(event.target.files);
    }
  }

  agregarHospedaje(): void {
    this.imagenError = ''; // Reiniciar el mensaje de error

    if (!this.imagenes || this.imagenes.length === 0) {
      this.imagenError = 'Debes seleccionar almenos una imagen antes de continuar.';
      return;
    }
    
    const formData = new FormData();

    this.nuevoHospedaje.Servicios = this.serviciosSeleccionados.join(',');

    // Agregar datos del hospedaje
    formData.append('Titulo', this.nuevoHospedaje.Titulo);
    formData.append('Descripcion', this.nuevoHospedaje.Descripcion);
    formData.append('Servicios', this.nuevoHospedaje.Servicios);
    formData.append('Telefono', this.nuevoHospedaje.Telefono);
    formData.append('Ciudad', this.nuevoHospedaje.Ciudad);
    formData.append('Direccion', this.nuevoHospedaje.Direccion);
    formData.append('Coordenadas', this.nuevoHospedaje.Coordenadas);
    
    // Agregar las imágenes seleccionadas
    if (this.imagenes && this.imagenes.length > 0) {
      this.imagenes.forEach((file, index) => {
        formData.append('imagenes[]', file, file.name);
      });
    } else {
      console.warn('No se seleccionaron imagenes.');
    }
    
    // Llamada al servicio de backend
    this.hospedajeService.agregarHospedaje(formData).subscribe(
      (response) => {
        console.log('Hospedaje agregado:', response);
        this.router.navigate(['/administrador/hospedajes']);
      },
      (error) => {
        console.error('Error al agregar hospedaje:', error);
      }
    );
  }
}
