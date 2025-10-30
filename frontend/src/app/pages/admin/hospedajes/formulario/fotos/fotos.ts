import { Component, Input, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin';

@Component({
  selector: 'app-fotos',
  imports: [CommonModule],
  templateUrl: './fotos.html',
  styleUrl: './fotos.css'
})
export class Fotos {
  @Input() idHospedaje: string | undefined;

  // Servicios
  admin = inject(AdminService);

  // Signals
  hospedaje = this.admin.hospedaje;
  fotos = this.admin.fotos;
  loading = this.admin.loading;
  error = this.admin.error;
  success = this.admin.success;

  ngOnInit(): void {
    if (this.idHospedaje == undefined) return console.error('El ID de hospedaje no es válido');
    this.admin.getFotos(this.idHospedaje)
    this.admin.getHospedaje(this.idHospedaje)
  }

  seleccionarImagenPrincipal(idFoto: string): void {
    if (this.idHospedaje == undefined) return console.error('El ID de hospedaje no es válido');
    this.admin.seleccionarImagenPrincipal(this.idHospedaje, idFoto);
  }

  eliminarFoto(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
      this.admin.eliminarFoto(id);
      console.log(`Foto con ID ${id} eliminada.`);
    }
  }

  agregarFotos(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0 && this.idHospedaje != null) {
        const formData = new FormData();
        formData.append('idHospedaje', this.idHospedaje.toString()); // Agrega el ID del hospedaje
    
        Array.from(input.files).forEach((file) => {
          formData.append('imagenes[]', file, file.name);
        });
    
        this.admin.subirFotos(formData);
    } else {
        console.warn('No se seleccionaron imágenes.');
    }
  }
}
