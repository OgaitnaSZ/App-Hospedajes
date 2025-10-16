import { Component, signal, computed, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HospedajeService } from '../../../core/services/hospedaje';

@Component({
  selector: 'app-hospedajes-destacados',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './hospedajes-destacados.html',
  styleUrl: './hospedajes-destacados.css'
})
export class HospedajesDestacados implements OnInit, OnDestroy {
  readonly hospedajeService = inject(HospedajeService);

  hospedajesCargados:any[] = [];

  readonly currentIndex = signal(0);
  readonly isMobile = signal(false);
  readonly autoPlayEnabled = signal(true);

  readonly hospedajes = computed(() => this.hospedajesCargados);
  readonly totalHospedajes = computed(() => this.hospedajes().length);
  readonly hasHospedajes = computed(() => this.totalHospedajes() > 0);

  private resizeObserver?: ResizeObserver;
  private intervalId?: number;

  constructor() {
    // Efecto 1: detectar tamaño de pantalla
    effect(() => {
      this.isMobile.set(window.innerWidth < 768);
    });

    // Efecto 2: autoplay reactivo
    effect(() => {
      // Observa señales: autoplay + lista cargada
      if (!this.autoPlayEnabled() || !this.hasHospedajes()) return;

      this.intervalId && clearInterval(this.intervalId);
      this.intervalId = window.setInterval(() => {
        const nextIndex = (this.currentIndex() + 1) % this.totalHospedajes();
        this.currentIndex.set(nextIndex);
      }, 5000);

      // Cleanup automático al cambiar signals
      return () => {
        clearInterval(this.intervalId);
      };
    });
  }

  async ngOnInit() {
    this.hospedajesCargados = await this.hospedajeService.getHospedajesDestacados();
    console.log(this.hospedajesCargados);
  }

  ngOnDestroy() {
    this.intervalId && clearInterval(this.intervalId);
    this.resizeObserver?.disconnect();
  }

  next() {
    if (this.currentIndex() < this.totalHospedajes() - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }
}
