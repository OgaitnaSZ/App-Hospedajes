import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActividadesApiService } from '../../services/actividades.api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './actividadesAdmin.component.html'
})
export class ActividadesAdminComponent {
  constructor(private actividadesService: ActividadesApiService) {}

    actividades: any[] = [];
    actividadActiva: any = {};
    mostrarEditor: boolean = false;
    esActividadNueva: boolean = false;
    selectedFile: File | null = null;
    imagenError: string = '';

    ngOnInit(): void {
      this.cargarActividades();
    }
  
    cargarActividades(){
      this.actividadesService.getActividades('').subscribe(
        (data) => {
          this.actividades = Array.isArray(data) ? data : [];  // Asegurar que sea un array
        },
        (error) => {
          console.error('Error al cargar actividades:', error);
        }
      );
    }
  
    /* Editar o Agregar Actividad */
    editarAgregar(metodo: number): void {
      this.mostrarEditor = true;
      if (metodo === 0) { // Agregar una habitación
        this.actividadActiva = {
          Nombre: '',
          Descripcion: '',
          Precio: 0,
        };
        this.esActividadNueva = true;
      }else{
        this.esActividadNueva = false;
      }
    }
  
    actualizarServicio(){
      if (!this.selectedFile) {
        this.imagenError = 'Debes seleccionar almenos una imagen antes de continuar.';
        return;
      }

      const formData = new FormData();
      formData.append('IdActividad', this.actividadActiva.IdActividad);
      formData.append('Nombre', this.actividadActiva.Nombre);
      formData.append('Descripcion', this.actividadActiva.Descripcion);
      formData.append('Ciudad', this.actividadActiva.Ciudad);
      formData.append('Precio', this.actividadActiva.Precio);

      formData.append('Imagen', this.selectedFile, this.selectedFile.name);

      if (this.esActividadNueva) {
        // Usar FormData en el método agregarActividad
        this.actividadesService.agregarActividad(formData).subscribe(
          (response) => {
            console.log('Actividad agregada:', response);
            this.cargarActividades();
          },
          (error) => {
            console.error('Error al agregar la actividad:', error);
          }
        );
      } else {
        this.actividadesService.modificarActividad(formData).subscribe(
          (response) => {
            console.log('Actividad actualizada:', response);
            this.cargarActividades();
          },
          (error) => {
            console.error('Error al modificar actividad:', error);
          }
        );
      }
      this.mostrarEditor = false;
    }
  
    //Eliminar Hospedaje
    eliminar(idActividad: number){
      if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
        this.actividadesService.eliminarActividad(idActividad).subscribe(
          (response) => {
            console.log('Elimnacion exitosa:', response);
            this.cargarActividades();
          },
          (error) => {
            console.error('Error al eliminar actividad:', error);
          }
        );
      }
    }

    //Imagen
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.actividadActiva.Imagen = file.name;
      }
    }
}
