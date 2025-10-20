import { Component, ElementRef, ViewChild, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, Title, Meta } from '@angular/platform-browser';
import { HospedajeService } from '../../../core/services/hospedaje';
import { HabitacionService } from '../../../core/services/habitacion';
import { ServicioService } from '../../../core/services/servicio';
import { AdminService } from '../../../core/services/admin';
import { UtilsService } from '../../../core/services/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Datepicker } from '../../../layout/shared/date-picker/date-picker';
import { Resenas } from '../../home/resenas/resenas';
import { HospedajeDetalles } from '../../../core/interfaces/hospedaje.model';

@Component({
  selector: 'app-hospedaje',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, Datepicker, Resenas],
  providers: [HospedajeService],
  templateUrl: './hospedaje.html'
})
export class Hospedaje {
  @ViewChild('verHabitaciones') seccionHabitaciones!: ElementRef;
  @ViewChild('verCalificaciones') resenasComponent!: Resenas;

  // Inyecciones
  readonly hospedajeService = inject(HospedajeService);
  readonly habitacionesService = inject(HabitacionService);
  readonly serviciosService = inject(ServicioService);
  readonly adminSevice = inject(AdminService);
  readonly utilsService = inject(UtilsService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly sanitizer = inject(DomSanitizer);
  readonly title = inject(Title);
  readonly meta = inject(Meta);

  // Variables
  idHospedaje: string = '';
  desde = signal<Date | null>(null);
  hasta = signal<Date | null>(null);
  personas = signal<number>(1);

  noches = computed(() => {
    const start = this.desde();
    const end = this.hasta();
    if (!start || !end) return 0;
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60 * 24);
  });

  total = signal<number>(0);
  hospedaje = signal<HospedajeDetalles | null>(null);
  habitaciones = signal<HospedajeDetalles | null>(null);

  mostrarDatepicker = signal<boolean>(false);
  hayHabitaciones = signal<boolean>(false);

  readonly fechaActual = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) return;
      
      this.idHospedaje = id;
      try {
        const data = await this.hospedajeService.getHospedaje(id);
        console.log(data);
        if (data) {
          this.hospedaje.set(data);
        } else {
          console.warn('Hospedaje no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener hospedaje', error);
      }
    });
  }
  
  cargarHabitaciones(){

  }

  onDatesSelected(dates: { start: Date; end: Date }): void {
    this.desde.set(dates.start);
    this.hasta.set(dates.end);
    this.mostrarDatepicker.set(false);
  }

  reservar(idHabitacion: string, precio: number, numHabitacion: string): void {
    // TODO: Lógica de reserva
    console.log('Reservar habitación:', idHabitacion, precio, numHabitacion);
  }

  getMapUrl(coords: string | undefined): SafeResourceUrl {
    const url = `https://www.google.com/maps?q=${coords}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  scrollToSection(id: string): void {
    if (id === 'verHabitaciones' && this.seccionHabitaciones) {
      this.seccionHabitaciones.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'verCalificaciones' && this.resenasComponent) {
      // Asegurarse de que el método exista
      if (typeof this.resenasComponent.scrollToCalificaciones === 'function') {
        this.resenasComponent.scrollToCalificaciones();
      }
    }
  }
}
