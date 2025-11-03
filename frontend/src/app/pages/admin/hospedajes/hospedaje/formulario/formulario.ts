import { Component, effect, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ServicioService } from '../../../../../core/services/servicio';
import { AdminService } from '../../../../../core/services/admin';
import { Hospedaje, hospedajeDetalleAdmin } from '../../../../../core/interfaces/hospedaje.model';

@Component({
  selector: 'app-formulario',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, RouterModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario {
  @Input() hospedajeDetalles: hospedajeDetalleAdmin | null | undefined;

  // Servicios
  admin = inject(AdminService);
  servicio = inject(ServicioService)
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  // Signals
  servicios = this.servicio.servicios;
  hospedaje = this.admin.hospedaje;
  loading = this.admin.loadingHospedajes;
  error = this.admin.errorHospedajes;
  success = this.admin.successHospedajes;
  
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
  titulo: string = 'Agregar Hospedaje';
  activeTab: 'form' | 'habitaciones' | 'fotos' = 'form';


  ngOnInit(){
    // Obtener servicios para el select
    this.servicio.getServicios("hospedaje");

    if(this.hospedajeDetalles){
      this.hospedaje.set(this.hospedajeDetalles);
      this.titulo = `Modificar`
    }
  }

  // Effect para cargar datos cuando el hospedaje se obtiene
  cargarDatosEffect = effect(() => {
    const hospedaje = this.hospedaje();
    
    if (hospedaje) {
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
  
    if (this.hospedaje()?.idHospedaje !== '') {
      this.admin.modificarHospedaje(hospedaje);
    } else {
      this.admin.agregarHospedaje(hospedaje);
    }
  }

  successEffect = effect(() => {
    const success = this.success();
    if (success) {
      this.router.navigate(
        [`/administrador/hospedajes/editar/${this.success()}`],
      );
    }
  });
}
