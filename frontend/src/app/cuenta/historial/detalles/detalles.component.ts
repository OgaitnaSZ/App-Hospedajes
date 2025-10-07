import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResenasApiService } from '../../../services/resenas.api.service';
import { ReservaApiService } from '../../../services/reserva.api.service';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent {
  @Input() IdReserva: any; // Recibe la propiedad desde el componente padre

  constructor(
    private reservaService: ReservaApiService,
    private resenaService: ResenasApiService,
  ) {}
  
  fechaActual: Date = new Date();
  reserva: any ;
  nuevaResena: any = {
    IdResena: 0,
    Usuario: '',
    IdHospedaje: 0,
    IdHabitacion: 0,
    Calificacion: 0, 
    Comentario: '',
    Fecha: '', 
  }
  stars = Array(5).fill(0); // 5 estrellas
  existeResena: boolean = false;

  ngOnInit(): void {
    if (this.IdReserva !== null && this.IdReserva !== undefined) {
      this.reservaService.getReserva(this.IdReserva).subscribe(
        (reserva) => {
          console.log(reserva);
          console.log(this.fechaActual.toISOString().split('T')[0]);
          this.reserva = reserva;
          this.cargarResena(reserva.IdHospedaje, reserva.IdHabitacion);
        },
        (error) => {
          console.error('Error al cargar las reservas:', error);
        }
      );
    } else {
      console.error('El ID de la reserva no es válido');
    }
  }

  cancelarReserva(idReserva: number): void {
    this.reservaService.cancelarReserva(idReserva).subscribe(
      (response) => {
        console.log('Reserva cancelada:', response);
      },
      (error) => {
        console.error('Error al cancelar reserva:', error);
      }
    );
  }

  esCancelable(fechaInicial: string){
    if(new Date(fechaInicial) > this.fechaActual){
      return true;
    }else{
      return false;
    }
  }

  setRating(rating: number): void {
    this.nuevaResena.Calificacion = rating;
  }

  hoverRating(rating: number): void {
    this.nuevaResena.Calificacion = rating;
  }

  agregarResena(idHospedaje: number): void {
    const formData = new FormData();
    formData.append('IdHospedaje', idHospedaje.toString());
    formData.append('IdHabitacion', this.reserva.IdHabitacion.toString());
    formData.append('Calificacion', this.nuevaResena.Calificacion.toString());
    formData.append('Comentario', this.nuevaResena.Comentario);
    formData.append('Fecha', new Date().toISOString());

    if (this.existeResena) {
      formData.append('Accion', 'Actualizar');
    } else {
      formData.append('Accion', 'Crear');
    }

    this.resenaService.agregarResena(formData).subscribe(
      (response) => {
        console.log('Resena agregada:', response);
        // Limpia los campos después de enviar la reseña
        this.nuevaResena.Calificacion = 5;
        this.nuevaResena.Comentario = '';
      },
      (error) => {
        console.error('Error al agregar reseña:', error);
      }
    );
  }

  cargarResena(IdHospedaje: number, IdHabitacion: number) {
    this.resenaService.cargarResena(IdHospedaje).subscribe(
      (response) => {
        if(response.Comentario != '' && response.Comentario != null) {
          console.log('Resena cargada:', response);
          this.nuevaResena = response;
          this.existeResena = true;
        }else{
          this.nuevaResena.Calificacion = 5;
          this.nuevaResena.Comentario = '';
          this.existeResena = false;
        }
      },
      (error) => {
        console.error('No hay resena:', error);
        this.existeResena = false;
      }
    );
  }
}
