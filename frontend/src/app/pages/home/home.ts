import { Component,inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HospedajesDestacados } from './hospedajes-destacados/hospedajes-destacados';
import { Resenas } from './resenas/resenas';
import { Carrucel } from '../../layout/shared/carrucel/carrucel';
import { BlogResume } from '../../layout/shared/blog-resume/blog-resume';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, HospedajesDestacados, Resenas, Carrucel, BlogResume],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
private readonly router = inject(Router);

  // ✅ Signals para estado reactivo
  readonly fechaActual = new Date().toISOString().split('T')[0];
  readonly desde = signal<string | null>(null);
  readonly hasta = signal<string | null>(null);
  readonly cualquierFecha = signal(false);
  readonly checkOutMinDate = computed(() => {
    if (!this.desde()) return null;
    const d = new Date(this.desde()!);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  readonly destino = signal('');
  readonly personas = signal(0);

  // ✅ Métodos reactivos
  onCheckInChange(value: string): void {
    this.desde.set(value);
  }

  onCheckOutChange(value: string): void {
    this.hasta.set(value);
  }

  onCualquierFechaChange(): void {
    if (this.cualquierFecha()) {
      this.desde.set(this.fechaActual);
      this.hasta.set('');
    }
  }

  buscarHospedajes(): void {
    const queryParams = {
      desde: this.desde(),
      hasta: this.hasta(),
      destino: this.destino(),
      personas: this.personas(),
    };
    this.router.navigate(['/hospedajes'], { queryParams });
  }
}
