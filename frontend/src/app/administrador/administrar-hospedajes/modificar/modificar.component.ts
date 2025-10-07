import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute} from '@angular/router';
import { HospedajeApiService } from '../../../services/hospedaje.api.service';
import { ServiciosApiService } from '../../../services/servicios.api.service';
import { FotosComponent } from "./fotos/fotos.component";
import { HabitacionesComponent } from "./habitaciones/habitaciones.component";

@Component({
  selector: 'app-modificar',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule, FotosComponent, HabitacionesComponent],
  providers: [HospedajeApiService],
  templateUrl: './modificar.component.html',
})
export class ModificarComponent {
  servicios: any[] = [];
  serviciosSeleccionados: number[] = [];

  constructor(private hospedajeService: HospedajeApiService, 
              private serviciosService: ServiciosApiService,
              private router: Router, 
              private route: ActivatedRoute) {
                this.serviciosSeleccionados = [];
              }

  hospedaje = {
    IdHospedaje: 0,
    Titulo: '',
    Descripcion: '',
    Servicios: '',
    Estrellas: 0,
    Telefono: '',
    Ciudad: '',
    Direccion: '',
    Imagen: '',
    CalificacionPromedio : 0,
    Coordenadas: ''
  };

  idHospedaje: number = 0;
  mensaje: string = '';

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idHospedaje = +id; // Convierte a número
      } else {
        console.log('ID de hospedaje no encontrado');
      }
    });
    
    if (this.idHospedaje !== null && this.idHospedaje !== undefined) {
      this.cargarHospedaje();
      this.cargarServicios();
    } else {
      console.error('El ID de hospedaje no es válido');
    }
  }
  cargarHospedaje(){
    this.hospedajeService.getHospedaje(this.idHospedaje).subscribe(
      (data) => {
        this.hospedaje = data; 
      },
      (error) => {
        console.error('Error al cargar hospedaje:', error);
      }
    );
  }

  cargarServicios() {
    this.serviciosService.obtenerServicios("hospedaje").subscribe(
      (servicios) => {
        this.servicios = servicios;
        if (this.hospedaje && this.hospedaje.Servicios) {
          this.serviciosSeleccionados = this.hospedaje.Servicios.split(',')
            .map(id => {
              const numId = parseInt(id.trim(), 10);
              return isNaN(numId) ? null : numId;
            })
            .filter((id): id is number => id !== null); // Asegura que el tipo sea `number`
          console.log(this.serviciosSeleccionados);
        }        
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
      }
    );
  }
  modificarHospedaje(){
    this.hospedaje.Servicios = this.serviciosSeleccionados.join(',');
    this.hospedajeService.modificarHospedaje(this.hospedaje).subscribe(
      (response) => {
        console.log('Cambios con exitos:', response);
        this.router.navigate(['/administrador/hospedajes']);
      },
      (error) => {
        console.log(error);
        this.mensaje = 'Error al editar hospedaje: '+ error;
      }
    );
  }
  almacenarServicios(event: any) {
    const idServicio = Number(event.target.value); // Convertir a número
    if (event.target.checked) {
        if (!this.serviciosSeleccionados.includes(parseInt(idServicio.toString(), 10))) {
          console.log();
            this.serviciosSeleccionados.push(idServicio);
        }
    } else {
        const index = this.serviciosSeleccionados.indexOf(idServicio);
        if (index > -1) {
            this.serviciosSeleccionados.splice(index, 1);
        }
    }
    console.log(this.serviciosSeleccionados);
  }

  servicioSeleccionado(idServicio: number) {
    return this.serviciosSeleccionados.includes(parseInt(idServicio.toString(), 10));
  }
}
