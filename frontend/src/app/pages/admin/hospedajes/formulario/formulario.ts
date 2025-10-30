import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ServicioService } from '../../../../core/services/servicio';
import { AdminService } from '../../../../core/services/admin';
import { EstadoHospedaje, Hospedaje } from '../../../../core/interfaces/hospedaje.model';
import { HabitacionesAdmin } from './habitaciones/habitaciones';
import { Fotos } from './fotos/fotos';

@Component({
  selector: 'app-formulario',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, RouterModule, HabitacionesAdmin, Fotos],
  templateUrl: './formulario.html'
})
export class FormularioHospedaje {
  // Servicios
  admin = inject(AdminService);
  servicio = inject(ServicioService)
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  // Signals
  servicios = this.servicio.servicios;
  hospedaje = this.admin.hospedaje;
  loading = this.admin.loading;
  error = this.admin.error;
  success = this.admin.success;
  
  // Campos del formulario
  form = this.fb.nonNullable.group({
    idHospedaje: [''],
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    servicios: this.fb.control<string[]>([], Validators.required),
    estrellas: [3, [Validators.min(1), Validators.max(5)]],
    telefono: ['', Validators.required],
    ciudad: ['', Validators.required],
    direccion: ['', Validators.required],
    coordenadas: ['', Validators.required],
  });

  serviciosSeleccionados: string[] = [];
  mostrarServicios = false;
  idHospedaje: string = '';
  titulo: string = 'Agregar Hospedaje';

  ngOnInit(){
    // Obtener servicios para el select
    this.servicio.getServicios("hospedaje");

    // Verificar si se recibe un ID de hospedaje
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idHospedaje = id;
        this.admin.getHospedaje(id);
        this.titulo = 'Modificar'
      }
    });
    
  }

  // Effect para cargar datos cuando el hospedaje se obtiene
  cargarDatosEffect = effect(() => {
    const hospedaje = this.hospedaje();
    
    if (hospedaje && this.idHospedaje) {
      // Cargar los valores en el formulario
      this.form.patchValue({
        idHospedaje: hospedaje.idHospedaje,
        titulo: hospedaje.titulo,
        descripcion: hospedaje.descripcion,
        estrellas: hospedaje.estrellas,
        telefono: hospedaje.telefono,
        ciudad: hospedaje.ciudad,
        direccion: hospedaje.direccion,
        coordenadas: hospedaje.coordenadas,
      });

      // Cargar los servicios seleccionados (ya son números)
      if (hospedaje.servicios) {
        const serviciosArray = hospedaje.servicios.split(',').map(s => s.trim());
        this.serviciosSeleccionados = serviciosArray;
        this.form.get('servicios')?.setValue(serviciosArray);
      }
    }
  });

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
  }

  toggleEstado() {
    const hospedajeActual = this.hospedaje();
    if (!hospedajeActual) return;
  
    const nuevoEstado: EstadoHospedaje =
      hospedajeActual.estado === EstadoHospedaje.Activo ? EstadoHospedaje.Desactivado : EstadoHospedaje.Activo;
  
    // Llamada HTTP (no suscribe, solo dispara)
    this.admin.cambiarEstadoHospedaje(this.idHospedaje);
  
    // Actualiza el signal y fuerza re-render
    this.admin.hospedaje.update(h => ({
      ...h!,
      estado: nuevoEstado
    }));
  }
  
  // Verifica si el servicio está seleccionado
  isServicioSeleccionado(idServicio: string): boolean {
    const servicios = this.form.get('servicios')?.value || [];
    return servicios.includes(idServicio.toString());
  }

  agregarHospedaje(): void {
    if (this.form.invalid) return this.error.set('Faltan datos.');
    
    const formValue = this.form.getRawValue();
    const serviciosString = Array.isArray(formValue.servicios)
        ? formValue.servicios.join(',')
        : formValue.servicios
    
    const hospedaje: Hospedaje = {
      ...formValue,
      servicios: String(serviciosString)
    };
  
    if (this.idHospedaje) {
      this.admin.modificarHospedaje(hospedaje);
    } else {
      this.admin.agregarHospedaje(hospedaje);
    }
  }

  successEffect = effect(() => {
    const success = this.success();
    if (success) {
      this.router.navigate(
        [`/administrador/hospedajes/editar/${this.admin.hospedaje()?.idHospedaje}`],
      );
    }
  });
}
