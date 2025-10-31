import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-fotos',
  imports: [CommonModule, DragDropModule],
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

  drop(event: any) {
    const e = event as CdkDragDrop<Fotos[]>;
    const copia = [...this.fotos()];
    moveItemInArray(copia, e.previousIndex, e.currentIndex);
    copia.forEach((f, i) => (f.sort = i + 1));
    this.fotos.set(copia);
  }

  actualizarOrden(){
    this.admin.actualizarOrdenFotos(this.fotos());
  }
  
  eliminarFoto(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
      this.admin.eliminarFoto(id);
      this.admin.fotos.update(lista =>
        lista.filter(f => f.idFoto !== id)
      );
    }
  }

  verSubir: boolean = false;
  fotosSeleccionadas: File[] = [];

  onFileSelected(event: any) {
    this.fotosSeleccionadas = Array.from(event.target.files);
  }

  agregarFotos(event: Event) {
    event.preventDefault();

    if (this.idHospedaje !== undefined && this.idHospedaje != ''){
      const formData = new FormData();
      this.fotosSeleccionadas.forEach(file => formData.append('fotos', file));
      formData.append('idHospedaje', this.idHospedaje.toString());
  
      this.admin.subirFotos(formData);
    }

  }
}
