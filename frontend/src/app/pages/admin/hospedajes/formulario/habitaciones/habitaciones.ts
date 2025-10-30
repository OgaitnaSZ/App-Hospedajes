import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habitaciones',
  imports: [],
  templateUrl: './habitaciones.html',
  styleUrl: './habitaciones.css'
})
export class HabitacionesAdmin {
  @Input() idHospedaje: string | undefined;
}
