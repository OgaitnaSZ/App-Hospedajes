import { Component } from '@angular/core';

@Component({
  selector: 'app-soporte',
  imports: [],
  templateUrl: './soporte.html',
  styleUrl: './soporte.css'
})
export class Soporte {
// Controlamos qué acordeón está abierto
  openIndex: number | null = null;

  // Lista de preguntas frecuentes
  questions = [
    {
      title: '¿Problemas con las reservas?',
      body: 'Si tuviste algún problema por favor envíanos un email con el título de - Incidencias - al email: consultas.vamos@gmail.com y te respondemos en la brevedad.'
    },
    {
      title: '¿Puedo organizar un tour personalizado?',
      body: 'Si, nuestro equipo trabaja para que puedas tener la experiencia que mejor se adapte a ti.'
    },
    {
      title: '¿Cuando se efectúa la reserva?',
      body: 'La reserva se hace efectiva en el momento de cobro.'
    },
    {
      title: '¿Puedo cancelar mi reserva?',
      body: 'Las reservas están sujetas a políticas de cancelación. Si desea cancelar en menos de 24hs no es posible un reembolso. Si desea realizar un cambio debe realizarse con un mínimo de 72hs (3 días).'
    },
    {
      title: '¿Incluye seguro?',
      body: 'Todos nuestros servicios incluyen seguro.'
    }
  ];

  // Método para alternar el estado de los acordeones
  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
