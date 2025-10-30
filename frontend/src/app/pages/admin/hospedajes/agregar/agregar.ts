import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ServicioService } from '../../../../core/services/servicio';
import { AdminService } from '../../../../core/services/admin';
import { Hospedaje } from '../../../../core/interfaces/hospedaje.model';

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
  hospedaje = this.admin.hospedaje;
  loading = this.admin.loading;
  error = this.admin.error;
  success = this.admin.success;
  
  // Campos del formulario
  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    servicios: this.fb.control<number[]>([], Validators.required),
    estrellas: [3, [Validators.min(1), Validators.max(5)]],
    telefono: ['', Validators.required],
    ciudad: ['', Validators.required],
    direccion: ['', Validators.required],
    coordenadas: ['', Validators.required],
  });

  serviciosSeleccionados: number[] = []
  mostrarServicios = false;

  ngOnInit(){
    // Obtener servicios para el select
    this.servicio.getServicios("hospedaje");
  }

  // Helpers
  almacenarServicios(event: any) {
    const control = this.form.get('servicios');
    const valor = Number(event.target.value);
    const actual = control?.value || [];
  
    if (event.target.checked) {
      control?.setValue([...actual, valor]);
    } else {
      control?.setValue(actual.filter((id: number) => id !== valor));
    }
  }

  agregarHospedaje(): void {
    if (this.form.invalid) return this.error.set('Faltan datos.');
    const hospedaje: Hospedaje = this.form.getRawValue();
    this.admin.agregarHospedaje(hospedaje);
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
