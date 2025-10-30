import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ServicioService } from '../../../../core/services/servicio';
import { AdminService } from '../../../../core/services/admin';
import { Servicio } from '../../../../core/interfaces/servicio.model';

@Component({
  selector: 'app-agregar',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, RouterModule],
  templateUrl: './agregar.html',
  styleUrl: './agregar.css'
})
export class AgregarHospedaje {
  // Servicios
  admin = inject(AdminService);
  servicio = inject(ServicioService)
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  // Signals
  servicios = this.servicio.servicios;
  hospedaje = this.admin.nuevoHospedaje;
  loading = this.admin.loading;
  error = this.admin.error;
  success = this.admin.success;

  // Campos del formulario
  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    servicios: ['', Validators.required],
    estrellas: 0,
    telefono: ['', Validators.required],
    ciudad: ['', Validators.required],
    direccion: ['', Validators.required],
    imagen: ['', Validators.required],
    calificacionPromedio : ['', Validators.required],
    coordenadas: ['', Validators.required]
  });

  imagenes: File[] = [];
  serviciosSeleccionados: number[] = []


  ngOnInit(){
    // Obtener servicios para el select
    this.servicio.getServicios("hospedaje");
  }

  // Helpers
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
    if (!this.imagenes || this.imagenes.length === 0) {
      return this.error.set('Debes seleccionar al menos una imagen antes de continuar.');
    }
  
    const formData = new FormData();
  
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
  
    this.serviciosSeleccionados.forEach((servicioId) => {
      formData.append('servicios[]', servicioId.toString());
    });
  
    if (this.imagenes && this.imagenes.length > 0) {
      this.imagenes.forEach((file) => {
        formData.append('imagenes[]', file, file.name);
      });
    }
  
    this.admin.agregarHospedaje(formData);
  }
}
