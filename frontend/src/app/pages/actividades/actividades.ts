import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin';

@Component({
  selector: 'app-actividades',
  imports: [CommonModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class Actividades {
  // Inyecciones
  router = inject(Router);
  admin = inject(AdminService);

  actividades = this.admin.actividades;
  loading = this.admin.loadingActividades;
  error = this.admin.errorActividades;
  success = this.admin.successActividades;

  // Computed
  readonly totalActividades = computed(() => this.actividades().length);
  readonly hayActividades = computed(() => this.totalActividades() > 0 && !this.error());
  
  ciudad: string = 'Termas';

  ngOnInit(): void {
    this.admin.getActividades();
  }

  reservar(actividad:any){
    const parametros = {
      idActividad: actividad.idActividad,
      titulo: actividad.Nombre,
      total: actividad.Precio,
      tipoReserva: "actividad"
    };

    sessionStorage.setItem('reservaParametros', JSON.stringify(parametros));

    this.router.navigate(['/reservar'], { state: parametros });
  }
}
