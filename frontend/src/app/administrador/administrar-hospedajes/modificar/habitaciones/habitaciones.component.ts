import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { Habitacion } from '../../../../interfaces/habitacion';
import { HabitacionesApiService } from '../../../../services/habitaciones.api.service';
import { ServiciosApiService } from '../../../../services/servicios.api.service';
import { Servicio } from '../../../../interfaces/servicio';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './habitaciones.component.html',
})

export class HabitacionesComponent {
  mensaje: string = '';
  @Input() IdHospedaje: number | undefined;
  constructor(private habitacionesApiService: HabitacionesApiService,
              private serviciosService: ServiciosApiService){}

  habitaciones: Habitacion[] = [];
  habitacionActiva: Habitacion = {
    IdHabitacion: 0,
    IdHospedaje: 0,
    Numero: 0,
    Tipo: '',
    Precio: 0,
    Capacidad: 0,
    Servicios: ''
  }
  esHabitacionNueva: boolean = false;

  mostrarServicios: boolean = false;;
  serviciosHabitacion: Servicio[] = [];
  serviciosSeleccionados: number[] = [];

  ngOnInit(): void {
    if (this.IdHospedaje !== null && this.IdHospedaje !== undefined) {
      this.cargarHabitaciones(this.IdHospedaje);
    } else {
      console.error('El ID de hospedaje no es válido');
    }
  }

  cargarHabitaciones(IdHospedaje: number){
    this.habitacionesApiService.obtenerHabitacionesAdmin(IdHospedaje).subscribe(
      (habitaciones) => {
        this.habitaciones = habitaciones;
        console.log('Habitaciones cargadas:', habitaciones);
      },
      (error) => {
        console.error('Error al cargar habitaciones:', error);
      }
    );
  }

  editarAgregar(metodo: number): void {
    this.mostrarServicios = true; // Mostrar los servicios de la habitación activa
    this.cargarServicios();
    if (metodo === 0) { // Agregar una habitación
      this.habitacionActiva = {
        IdHabitacion: 0,
        IdHospedaje: 0,
        Numero: 0,
        Tipo: '',
        Precio: 0,
        Capacidad: 0,
        Servicios: ''
      }; // Mostrar la nueva habitación activa
      this.esHabitacionNueva = true;
    }else{
      this.esHabitacionNueva = false;
    }
  }

  cargarServicios() {
    this.serviciosService.obtenerServicios("hospedaje").subscribe(
      (servicios) => {
        this.serviciosHabitacion = servicios;
        if (this.habitacionActiva && this.habitacionActiva.Servicios) {
          this.serviciosSeleccionados = this.habitacionActiva.Servicios.split(',')
            .map(id => {
              const numId = parseInt(id.trim(), 10);
              return isNaN(numId) ? null : numId;
            })
            .filter((id): id is number => id !== null); // Asegura que el tipo sea `number`
        }        
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
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

  actualizarHabitacion(){
    this.habitacionActiva.Servicios = this.serviciosSeleccionados.join(',');

    if(this.esHabitacionNueva && this.IdHospedaje != null){
      this.habitacionActiva.IdHospedaje = this.IdHospedaje;
      this.habitacionesApiService.agregarHabitacion(this.habitacionActiva).subscribe(
        (response) => {
          console.log('Habitación actualizada:', response);
          console.log(this.habitacionActiva);
          this.ngOnInit();
        },
        (error) => {
          console.error('Error al agregar habitación:', error);
          this.mensaje = 'No se pudo agregar la habitacion';
        }
      );
      this.esHabitacionNueva = false;
      this.mostrarServicios = false;
      this.mensaje = "Habitación agregada con éxito.";
    }else{
      this.habitacionesApiService.actualizarHabitacion(this.habitacionActiva).subscribe(
        (response) => {
          console.log('Habitación actualizada:', response);
          this.ngOnInit();
        },
        (error) => {
          console.error('Error al modificar habitación:', error);
          this.mensaje = 'No se pudo modificar';
        }
      );
        this.mostrarServicios = false;
        this.mensaje = "Habitación agregada con éxito.";
    }

  }

  eliminarHabitacion(IdHabitacion: number){
    if (confirm('¿Estás seguro de que deseas eliminar esta habitacion?')) {
      this.habitacionesApiService.eliminarHabitacion(IdHabitacion).subscribe(
        (response) => {
          console.log('Habitación eliminada:', response);
          this.ngOnInit();
        },
        (error) => {
          console.error('Error al eliminar habitación:', error);
          this.mensaje = 'No se pudo borrar la habitacion porque está reservada actualmente';
        }
      );
    }
  }
}
