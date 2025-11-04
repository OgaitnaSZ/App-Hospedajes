import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalles-reserva',
  imports: [],
  templateUrl: './detalles-reserva.html',
  styleUrl: './detalles-reserva.css'
})
export class DetallesReserva {
  @Input() idReserva: string | undefined;
}
