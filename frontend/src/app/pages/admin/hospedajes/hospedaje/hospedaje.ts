import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../core/services/admin';
import { HabitacionesAdmin } from './habitaciones/habitaciones';
import { Fotos } from './fotos/fotos';
import { Formulario } from "./formulario/formulario";
import { EstadoHospedaje } from '../../../../core/interfaces/hospedaje.model';

@Component({
  selector: 'app-hospedaje-admin',
  imports: [RouterModule, CommonModule, RouterModule, HabitacionesAdmin, Fotos, Formulario],
  templateUrl: './hospedaje.html'
})

export class HospedajeAdmin {
  // Servicios
  admin = inject(AdminService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Signals
  hospedaje = this.admin.hospedaje;

  idHospedaje: string = '';
  titulo: string = 'Agregar Hospedaje';
  activeTab: 'form' | 'habitaciones' | 'fotos' = 'form';

  ngOnInit(){
    this.admin.hospedaje.set(null);

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

  toggleEstado() {
    const hospedajeActual = this.hospedaje();
    if (!hospedajeActual) return;
  
    const nuevoEstado: EstadoHospedaje =
      hospedajeActual.estado === EstadoHospedaje.Activo ? EstadoHospedaje.Desactivado : EstadoHospedaje.Activo;
  
    // Llamada HTTP (no suscribe, solo dispara)
    if(this.hospedaje()?.idHospedaje) this.admin.cambiarEstadoHospedaje(<string>this.hospedaje()?.idHospedaje);
  
    // Actualiza el signal y fuerza re-render
    this.admin.hospedaje.update(h => ({
      ...h!,
      estado: nuevoEstado
    }));
  }
}
