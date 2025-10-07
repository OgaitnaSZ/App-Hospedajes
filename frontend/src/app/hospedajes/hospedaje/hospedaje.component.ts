import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HospedajeApiService } from '../../services/hospedaje.api.service';
import { HabitacionesApiService } from '../../services/habitaciones.api.service';
import { ServiciosApiService } from '../../services/servicios.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { ResenasComponent } from '../../home/resenas/resenas.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-hospedaje',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, DatepickerComponent, ResenasComponent],
  providers: [HospedajeApiService],
  templateUrl: './hospedaje.component.html',
  styles: `.imgCarrucel{height: 30vh} @media all and (min-width: 768px){.imgCarrucel{height: 59vh}}`
})
export class HospedajeComponent {
  @ViewChild('verHabitaciones') seccionHabitaciones!: ElementRef;
  @ViewChild('verCalificaciones') resenasComponent!: ResenasComponent;
  constructor(private hospedajeService: HospedajeApiService, 
              private habitacionesService: HabitacionesApiService, 
              private serviciosService: ServiciosApiService, 
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private titleService: Title, 
              private metaService: Meta) {}

  hayHabitaciones: boolean = false;
  idHospedaje: number = 0;
  habitaciones: any[] = [];
  serviciosHospedaje: any[] = [];
  serviciosHabitacion: any[] = [];
  imagenesUrl: any[] = [];
  desde: Date = new Date();
  hasta: Date = new Date();
  personas: number = 1;
  noches: number = 1;
  total: number = 0;
  mostrarDatepicker : boolean = false;
  calificacionPromedio: string = "";

  onDatesSelected(dates: { start: Date, end: Date }) {
    this.desde = dates.start;
    this.hasta = dates.end;
    this.mostrarDatepicker = false; // Ocultar el calendario al seleccionar las fechas
    this.calcularNoches();
    // Puedes hacer lo que necesites con las fechas aquí, como enviarlas a un servidor o usarlas en tu lógica de negocio.
  }

  hospedaje: any;
  
  ngOnInit(): void {
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idHospedaje = +id; // Convierte a número
        console.log('ID de hospedaje:', this.idHospedaje);
      } else {
        console.log('ID de hospedaje no encontrado');
      }
    });

    if (this.idHospedaje !== null && this.idHospedaje !== undefined) {
      this.hospedajeService.getHospedaje(this.idHospedaje).subscribe(
        (data) => {
          this.hospedaje = data;
          if (Number.isInteger(this.hospedaje.CalificacionPromedio)) {
            this.calificacionPromedio = this.hospedaje.CalificacionPromedio.toString()+".0";
          }else{
            this.calificacionPromedio = this.hospedaje.CalificacionPromedio.toString();
          }
        },
        (error) => {
          console.error('Error al cargar hospedaje:', error);
        }
      );

      // Cargar Imágenes
      this.hospedajeService.getImagenes(this.idHospedaje).subscribe(
        (imagenes) => { 
          this.imagenesUrl = imagenes;
          console.log('Imágenes cargadas:', this.imagenesUrl);
        },
        (error) => {
          console.error('Error al cargar imágenes:', error);
        }
      );
      this.cargarServiciosHospedaje();

      this.titleService.setTitle(this.hospedaje.Titulo);
      this.metaService.updateTag({ property: 'og:title', content: this.hospedaje.Titulo });
      this.metaService.updateTag({ property: 'og:image', content: `https://vamos.fullbusiness.io/assets/uploads/hospedajes/${this.hospedaje.Imagen}`});

    } else {
      console.error('El ID de hospedaje no es válido');
    }
    this.cargarHabitaciones();
  }
  filtrar(){
    this.cargarHabitaciones();
  }
  getMapUrl(coordenadas: string): SafeResourceUrl {
    const url = `https://www.google.com/maps?q=${coordenadas}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); // Marca la url como segura
  }
  // Reservar
  reservar(IdHabitacion: number, precio: number, NumHabitacion: number) {
    this.total = this.noches * precio;

    const parametros = {
      Total: this.total,
      IdHabitacion: IdHabitacion,
      IdHospedaje: this.idHospedaje,
      FechaInicio: this.desde.toISOString().split('T')[0],
      FechaFin: this.hasta.toISOString().split('T')[0],
      Personas: this.personas,
      TituloHospedaje: this.hospedaje.Titulo,
      Habitacion: NumHabitacion,
      TipoReserva: "Hospedaje"
    };

    sessionStorage.setItem('reservaParametros', JSON.stringify(parametros));

    this.router.navigate(['/reservar'], { state: parametros });
  }
  
  calcularNoches(){
    if (this.desde && this.hasta) {
      const start = new Date(this.desde);
      const end = new Date(this.hasta);

      // Calcular la diferencia en milisegundos
      const diffInMs = end.getTime() - start.getTime();

      // Convertir la diferencia a días
      this.noches = diffInMs / (1000 * 60 * 60 * 24);
    } else {
      this.noches = 0; // Manejo de fechas inválidas o no seleccionadas
    }
  }

  cargarHabitaciones(){
    const params = new URLSearchParams();
    if (this.idHospedaje) params.append('IdHospedaje', this.idHospedaje.toString());
    if (this.desde) params.append('desde', this.desde.toISOString().split('T')[0]);
    if (this.hasta) params.append('hasta', this.hasta.toISOString().split('T')[0]);
    if (this.personas) params.append('personas', this.personas.toString());

    this.habitacionesService.obtenerHabitaciones(params.toString()).subscribe(
      (habitaciones) => {
        this.habitaciones = habitaciones;
        if (habitaciones.length > 0){
          this.hayHabitaciones = true;
        }else{
          this.hayHabitaciones = false;
        }
      },
      (error) => {
        console.error('Error al cargar habitaciones:', error);
      }
    );
  }

  cargarServiciosHospedaje(){
    //Cargar todos los servicios
    this.serviciosService.obtenerServicios("hospedaje").subscribe(
      (servicios) => {
        this.serviciosHospedaje = servicios;
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
      }
    );
    this.serviciosService.obtenerServicios("habitacion").subscribe(
      (servicios) => {
        this.serviciosHabitacion = servicios;
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
      }
    );
  }

  getNombreServicio(idServicio: string, tipo: number): string {
    // Aquí debes buscar el nombre del servicio en tu listado de servicios
    let servicio: any;
    if(tipo == 0){
      servicio = this.serviciosHospedaje.find(s => s.IdServicio == parseInt(idServicio));
    }else{
      servicio = this.serviciosHabitacion.find(s => s.IdServicio == parseInt(idServicio));
    }
    return servicio ? servicio.Nombre : '';
  }
  getDescripcionServicio(idServicio: string): string {
    const servicio = this.serviciosHospedaje.find(s => s.IdServicio === parseInt(idServicio));
    return servicio ? servicio.Descripcion : '';
  }

  scrollToSection(id: string) {
    if (id === 'verHabitaciones' && this.seccionHabitaciones) {
      // Scroll a la sección local
      this.seccionHabitaciones.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'verCalificaciones' && this.resenasComponent) {
      // Invoca el método del componente hijo
      this.resenasComponent.scrollToCalificaciones();
    } else {
      console.error('Elemento no encontrado:', id);
    }
  }
}
