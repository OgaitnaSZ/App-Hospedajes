import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fotos',
  imports: [],
  templateUrl: './fotos.html',
  styleUrl: './fotos.css'
})
export class Fotos {
  @Input() idHospedaje: string | undefined;
}
