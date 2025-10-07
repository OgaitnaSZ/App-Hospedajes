import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActividadesApiService } from '../services/actividades.api.service';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.css'
})
export class ActividadesComponent {
  constructor(private actividadesService: ActividadesApiService,
              private router: Router,
  ) {}

  ciudad: string = 'Termas';

  actividades: any[] = [];
  hayActividades: boolean = false;

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(){
    this.actividadesService.getActividades(this.ciudad).subscribe(
      (data) => {
        console.log(data);  // Mostrar los datos en consola para desarrollar o verificar
        this.actividades = data; 
        if(data.message == 'No hay actividades disponibles.'){
          this.hayActividades = false;
        }else{
          this.hayActividades = true; 
        }
      },
      (error) => {
        console.error('Error al cargar actividades:', error);
        this.hayActividades = false;
      }
    );
  }

  reservar(actividad:any){
    const parametros = {
      IdActividad: actividad.IdActividad,
      Titulo: actividad.Nombre,
      Total: actividad.Precio,
      TipoReserva: "Actividad"
    };

    sessionStorage.setItem('reservaParametros', JSON.stringify(parametros));

    this.router.navigate(['/reservar'], { state: parametros });
  }
}
