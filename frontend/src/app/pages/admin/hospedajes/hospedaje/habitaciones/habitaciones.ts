import { Component, Input, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin';
import { Habitacion } from '../../../../../core/interfaces/habitacion.model';
import { ServicioService } from '../../../../../core/services/servicio';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-habitaciones',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './habitaciones.html',
  styleUrl: './habitaciones.css'
})
export class HabitacionesAdmin {
  @Input() habitacionesHospedaje: Habitacion[] | undefined;
  @Input() idHospedaje: string | undefined;

  // Servicios
  admin = inject(AdminService);
  servicio = inject(ServicioService)
  fb = inject(FormBuilder);

  // Signals
  habitaciones = this.admin.habitaciones;
  habitacion = this.admin.habitacion;
  servicios = this.servicio.servicios;
  fotos = this.admin.fotos;
  loading = this.admin.loadingHabitaciones;
  error = this.admin.errorHabitaciones;
  success = this.admin.successHabitaciones;

  mostrarForm = signal(false);
  esNueva = signal(false);
  titulo: string = 'Nueva Habitacion';

  // Formulario
  form = this.fb.nonNullable.group({
    idHabitacion: [''],
    idHospedaje: [''],
    numero: ['', [Validators.required]],
    tipo: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    capacidad: [0, [Validators.required, Validators.min(1)]],
    servicios: this.fb.control<string[]>([], Validators.required),
  });

  serviciosSeleccionados: number = 0;

  constructor() {
    // Effect para actualizar habitaciones cuando hay cambios
    effect(() => {
      if (this.success() && this.idHospedaje !== undefined) {
        this.admin.getHabitaciones(this.idHospedaje);
      }
    });
  }

  ngOnInit(): void {
    this.habitaciones.set([]);
    if (this.habitacionesHospedaje && this.habitacionesHospedaje?.length > 0) {
      this.servicio.getServicios('habitacion');
      this.habitaciones.set(this.habitacionesHospedaje);
    }
  }

// Helpers
  almacenarServicios(event: Event) {
    const input = event.target as HTMLInputElement;
    const id = input.value;
    const control = this.form.get('servicios');
    const actualArray = control?.value || [];
    
    if (input.checked) {
      control?.setValue([...actualArray, id]);
    } else {
      control?.setValue(actualArray.filter((x: string) => x !== id));
    }
    this.serviciosSeleccionados = control?.value?.length ?? 0;
  }

  isServicioSeleccionado(idServicio: string): boolean {
    const servicios = this.form.get('servicios')?.value || [];
    return servicios.includes(idServicio.toString());
  }

  editarAgregar(habitacion?: Habitacion): void {
    this.mostrarForm.set(true);

    if (habitacion) {
      // Editar habitación existente
      this.esNueva.set(false);
      this.titulo = 'Modificar Habitacion';
      this.form.patchValue({
        idHabitacion: habitacion.idHabitacion,
        idHospedaje: this.idHospedaje,
        numero: habitacion.numero,
        tipo: habitacion.tipo,
        precio: habitacion.precio,
        capacidad: habitacion.capacidad,
      });

      // Cargar servicios seleccionados
      if (habitacion.servicios) {
        const serviciosArray = habitacion.servicios.split(',').map(s => s.trim());
        this.form.get('servicios')?.setValue(serviciosArray);
      }
    } else {
      // Nueva habitación
      this.esNueva.set(true);
      this.titulo = 'Nueva Habitacion';
      this.form.reset({
        idHabitacion: '',
        idHospedaje: this.idHospedaje,
        numero: '',
        tipo: '',
        precio: 0,
        capacidad: 0
      });
    }
  }

  guardarHabitacion(): void {
    if (this.form.invalid) {
      console.log('Por favor complete todos los campos requeridos.');
      return;
    }

    const formValue = this.form.getRawValue();
    const serviciosString = Array.isArray(formValue.servicios)
      ? formValue.servicios.join(',')
      : formValue.servicios;

    const habitacion: Habitacion = {
      ...formValue,
      servicios: String(serviciosString),
    };

    if (this.esNueva()) {
      this.admin.agregarHabitacion(habitacion);
    } else {
      this.admin.modificarHabitacion(habitacion);
    }
  }

  eliminarHabitacion(idHabitacion: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      this.admin.eliminarHabtiacion(idHabitacion);
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
