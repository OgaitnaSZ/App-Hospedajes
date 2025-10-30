import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-hospedajes',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './hospedajes.html',
  styleUrl: './hospedajes.css'
})
export class HospedajesAdmin {
  // Servicios
  admin = inject(AdminService);

  // Signals
  hospedajes = this.admin.hospedajes;
  loading = this.admin.loading;
  error = this.admin.error;
  success = this.admin.success;

  ngOnInit(): void {
    this.admin.getHospedajes();
  }

  getTextoCorto(texto: string): string {
    return texto.length > 30 ? texto.substring(0, 30) + ' ...' : texto;
  }

  //Eliminar Hospedaje
  eliminar(idHospedaje: string){
    if (confirm('¿Estás seguro de que deseas eliminar este hospedaje?')) {
      this.admin.eliminarHospedaje(idHospedaje);
    }
  }
}
