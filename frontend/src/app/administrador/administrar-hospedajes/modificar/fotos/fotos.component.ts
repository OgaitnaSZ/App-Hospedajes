import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HospedajeApiService } from '../../../../services/hospedaje.api.service';

@Component({
  selector: 'app-fotos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fotos.component.html',
  styleUrl: './fotos.component.css'
})
export class FotosComponent {
  @Input() IdHospedaje: number | undefined;
  imagenPrincipal: number | null = null;
  imagenesUrl: any[] = [];
  imagenes: File[] = [];

  constructor(private hospedajeService: HospedajeApiService){}

  ngOnInit(): void {
    if (this.IdHospedaje !== null && this.IdHospedaje !== undefined) {
      this.cargarImagenes();
    } else {
      console.error('El ID de hospedaje no es válido');
    }
  }
    
  // Cargar Imagenes
  cargarImagenes(){
    if (this.IdHospedaje!== null && this.IdHospedaje!== undefined) {
      this.hospedajeService.getImagenes(this.IdHospedaje).subscribe(
        (imagenes: { Name: string }[]) => { 
          this.imagenesUrl = imagenes;
        },
        (error) => {
          console.error('Error al cargar imágenes:', error);
        }
      );
    }
  }
  // Imagen Principal
  seleccionarImagenPrincipal(IdFoto: number, NombreFoto:string): void {
    this.imagenPrincipal = IdFoto;
    if (this.IdHospedaje !== null && this.IdHospedaje !== undefined) {
      this.hospedajeService.seleccionarImagenPrincipal(this.IdHospedaje, NombreFoto).subscribe(
        (response) => {
          console.log('Cambios con exitos:', response);
        }
      );
    }
  }

  // Eliminar Fotos
  eliminarFoto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
      this.hospedajeService.eliminarFoto(id).subscribe(
        (response) => {
          console.log('Elimnacion exitosa:', response);
          this.cargarImagenes(); // Actualiza las imágenes
        },
        (error) => {
          console.error('Error al eliminar foto:', error);
        }
      );
      console.log(`Foto con ID ${id} eliminada.`);
    }
  }
  // Agregar Fotos
  agregarFotos(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0 && this.IdHospedaje != null) {
        const formData = new FormData();
        formData.append('IdHospedaje', this.IdHospedaje.toString()); // Agrega el ID del hospedaje
    
        Array.from(input.files).forEach((file) => {
          formData.append('imagenes[]', file, file.name);
        });
    
        this.hospedajeService.agregarFotos(formData).subscribe(
          (response) => {
            console.log('Fotos agregadas:', response);
            this.cargarImagenes(); // Actualiza las imágenes
          },
          (error) => {
            console.error('Error al agregar fotos:', error);
          }
        );
    } else {
        console.warn('No se seleccionaron imágenes.');
      }
  }
}
