import { Component, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import { Swiper } from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-carrucel',
  imports: [],
  templateUrl: './carrucel.html',
  styleUrl: './carrucel.css'
})
export class Carrucel implements AfterViewInit{
   @Input() images: { url: string; title?: string; alt?: string }[] = [];

  ngAfterViewInit() {
    // Inicializar Swiper
    new Swiper('.destinations-swiper', {
      // Configuración del carrusel
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
    });
  }
    ngOnChanges(changes: SimpleChanges) {
    if (changes['images']) {
      setTimeout(() => this.ngAfterViewInit(), 100);
    }
  }
}
