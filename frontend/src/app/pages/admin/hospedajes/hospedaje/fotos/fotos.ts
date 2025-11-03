import { Component, Input, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Foto } from '../../../../../core/interfaces/foto.model';

@Component({
  selector: 'app-fotos',
  imports: [CommonModule, DragDropModule],
  templateUrl: './fotos.html',
  styleUrl: './fotos.css'
})
export class Fotos {
  @Input() fotosHospedaje: Foto[] | undefined;
  @Input() idHospedaje: string | undefined;
  ordenOriginal = signal<number[]>([]);

  // Servicios
  admin = inject(AdminService);

  // Signals
  hospedaje = this.admin.hospedaje;
  fotos = this.admin.fotos;
  loading = this.admin.loadingFotos;
  error = this.admin.errorFotos;
  success = this.admin.successFotos;

  // Computed
  hayCambios = computed(() => {
    const ordenActual = this.fotos().map(f => f.sort);
    const original = this.ordenOriginal();
    
    if (ordenActual.length !== original.length) return true;
    
    return ordenActual.some((sort, index) => sort !== original[index]);
  });

  constructor() {
    // Effect para actualizar fotos cuando hay cambios
    effect(() => {
      const mensajeSuccess = this.success();
      
      if (mensajeSuccess && this.idHospedaje) {
        // Si el mensaje de éxito indica que se subieron o eliminaron fotos
        if (mensajeSuccess.includes('foto') || mensajeSuccess.includes('Foto')) {
          this.admin.getFotos(this.idHospedaje);
          
          // Limpiar fotos seleccionadas y cerrar modal si se subieron
          if (mensajeSuccess) {
            this.fotosSeleccionadas = [];
            this.verSubir = false;
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.fotos.set([]);
    if (this.fotosHospedaje !== undefined &&this.fotosHospedaje?.length > 0){
      this.fotos.set(this.fotosHospedaje);
      this.ordenOriginal.set(this.fotosHospedaje.map(f => f.sort));
    }
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
    this.ordenOriginal.set(this.fotos().map(f => f.sort));
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
  maxFotos = 10;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
  
    const nuevas = Array.from(input.files);
  
    const imagenes = nuevas.filter(file => file.type.startsWith('image/'));
  
    const totalActual = this.fotos().length + this.fotosSeleccionadas.length;
  
    const disponibles = this.maxFotos - totalActual;
  
    if (disponibles <= 0) {
      this.error.set(`Ya alcanzaste el máximo de ${this.maxFotos} fotos.`);
      input.value = '';
      return;
    }
  
    const permitidas = imagenes.slice(0, disponibles);
  
    if (permitidas.length < imagenes.length) {
      this.error.set(`Solo puedes agregar ${disponibles} foto(s) más.`);
    }
  
    this.fotosSeleccionadas.push(...permitidas);
  }


  agregarFotos(event: Event) {
    event.preventDefault();

    if (this.idHospedaje == undefined) return this.error.set("Falta el ID hospedaje")

    const formData = new FormData();
    this.fotosSeleccionadas.forEach(file => formData.append('fotos', file));
    formData.append('idHospedaje', this.idHospedaje);

    this.admin.subirFotos(formData);
  }
}
