import { Component, Input } from '@angular/core';
import { Habitacion } from '../../../../../core/interfaces/habitacion.model';

@Component({
  selector: 'app-habitaciones',
  imports: [],
  templateUrl: './habitaciones.html',
  styleUrl: './habitaciones.css'
})
export class HabitacionesAdmin {
  @Input() habitaciones: Habitacion[] | undefined;

  ngOnInit(){
    console.log(this.habitaciones)
  }


}
