import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasHospedaje } from './reservas-hospedaje/reservas-hospedaje';
import { ReservasActividad } from './reservas-actividad/reservas-actividad';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, ReservasHospedaje, ReservasActividad],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial {
  // Inyects
  auth = inject(AuthService);

  usuario = this.auth.currentUser();
  activeTab: 'hospedajes' | 'actividades' = 'hospedajes';
}
