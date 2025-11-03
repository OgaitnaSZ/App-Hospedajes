import { Component, Input, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin';
import { Actividad } from '../../../core/interfaces/actividad.model';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-actividades',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class Actividades {
  // Servicios
  admin = inject(AdminService);
  fb = inject(FormBuilder);

  // Signals
  actividades = this.admin.actividades;
  loading = this.admin.loadingActividades;
  error = this.admin.errorActividades;
  success = this.admin.successActividades;

  mostrarForm = signal(false);
  esNueva = signal(false);
  titulo: string = 'Nueva Actividad';

  // Formulario
  form = this.fb.nonNullable.group({
    idActividad: [''],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    imagen: ['', Validators.required],
    ciudad: ['0', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    // Effect para actualizar habitaciones cuando hay cambios
    effect(() => {
      if (this.success()) {
        this.admin.getActividades();
      }
    });
  }

  ngOnInit(): void {
    this.admin.getActividades();
  }


  editarAgregar(actividad?: Actividad): void {
    this.mostrarForm.set(true);

    if (actividad) {
      // Editar habitación existente
      this.esNueva.set(false);
      this.titulo = 'Modificar Actividad';
      this.form.patchValue({
        idActividad: actividad.idActividad,
        nombre: actividad.nombre,
        descripcion: actividad.descripcion,
        imagen: actividad.imagen,
        ciudad: actividad.ciudad,
        precio: actividad.precio,
      });
    } else {
      // Nueva habitación
      this.esNueva.set(true);
      this.titulo = 'Nueva Actividad';
      this.form.reset({
        idActividad: '',
        nombre: '',
        descripcion: '',
        imagen: '',
        ciudad: '',
        precio: 0
      });
    }
  }

  guardarActividad(): void {
    if (this.form.invalid) {
      console.log('Por favor complete todos los campos requeridos.');
      return;
    }

    const formValue = this.form.getRawValue();

    if (this.esNueva()) {
      this.admin.agregarActividad(formValue);
    } else {
      this.admin.modificarActividad(formValue);
    }
  }

  eliminarActividad(idActividad: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      this.admin.eliminarActividad(idActividad);
    }
  }

  cerrarFormulario(): void {
    this.mostrarForm.set(false);
    this.form.reset();
  }

  // Effect para cerrar el formulario después de guardar
  successEffect = effect(() => {
    const success = this.success();
    if (success && this.mostrarForm()) {
      this.mostrarForm.set(false);
      this.form.reset();
    }
  });
}
