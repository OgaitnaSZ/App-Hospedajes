import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HospedajeApiService } from '../../services/hospedaje.api.service';

@Component({
  selector: 'app-hospedajes-destacados',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  providers: [HospedajeApiService],
  templateUrl: './hospedajes-destacados.component.html',
})
export class HospedajesDestacadosComponent {
  hospedajes: any[] = [];
  currentIndex = 0;
  isMobile: boolean = false;

  constructor(private hospedajeService: HospedajeApiService) {}

  ngOnInit(): void {
    this.hospedajeService.getHospedajesDestacados(41, 42, 40).subscribe(
      (data) => {
        console.log(data);
        this.hospedajes = data;
      },
      (error) => {
        console.error('Error al cargar hospedajes:', error);
      }
    );
  }
}
