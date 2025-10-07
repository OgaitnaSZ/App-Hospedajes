import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HospedajesDestacadosComponent } from "./hospedajes-destacados/hospedajes-destacados.component";
import { ResenasComponent } from './resenas/resenas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HospedajesDestacadosComponent, ResenasComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}
  
  fechaActual: string = new Date().toISOString().split('T')[0];
  desde: string | null = null; // Fecha seleccionada para check-in
  hasta: string | null = null; // Fecha seleccionada para check-out
  cualquierFecha: boolean = false; // Variable para controlar la casilla
  checkOutMinDate: string | null = null; // Fecha mínima permitida para check-out
  destino: string = '';
  personas: number = 0; 

  // Método para actualizar restricciones al seleccionar check-in
  onCheckInChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.desde = input.value;

    if (this.desde) {
      const checkIn = new Date(this.desde);
      checkIn.setDate(checkIn.getDate() + 1);
      this.checkOutMinDate = checkIn.toISOString().split('T')[0];
    } else {
      this.checkOutMinDate = null;
    }
  }

  // Método para actualizar restricciones al seleccionar check-out
  onCheckOutChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.hasta = input.value;
  }

  buscarHospedajes(){
    const queryParams = {
      desde: this.desde,
      hasta: this.hasta,
      destino: this.destino,
      personas: this.personas
    };

    // Redirigir a otro componente con los parámetros GET
    this.router.navigate(['/hospedajes'], { queryParams });
  }
  onCualquierFechaChange(): void {
    if (this.cualquierFecha) {
      this.desde = this.fechaActual;
      this.hasta = '';
    }
    console.log(this.cualquierFecha);
  }
}
