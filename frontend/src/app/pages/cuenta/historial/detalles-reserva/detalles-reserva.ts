import { Component, Input, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from '../../../../core/services/reserva';
import { ResenaService } from '../../../../core/services/resena';
import { Resena } from '../../../../core/interfaces/resena.model';
import { ReservaHospedajeDetalle } from '../../../../core/interfaces/reservaHospedaje.model';
import { ReservaActividadDetalle } from '../../../../core/interfaces/reservaActividad.model';

@Component({
  selector: 'app-detalles-reserva',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detalles-reserva.html',
  styleUrl: './detalles-reserva.css'
})
export class DetallesReserva {
  @Input() reservaHospedaje: ReservaHospedajeDetalle | undefined;
  @Input() reservaActividad: ReservaActividadDetalle | undefined;

  // Injects
  reservaService = inject(ReservaService);
  resenaService = inject(ResenaService);
  fb = inject(FormBuilder);

  // Signals
  reservaH = this.reservaService.reservaHospedaje;
  reservaA = this.reservaService.reservaActividad;
  resena = this.resenaService.resena;
  loadingReserva = this.reservaService.loading;
  errorReserva = this.reservaService.error;
  successReserva = this.reservaService.success;
  loadingResena = this.reservaService.loading;
  errorResena = this.reservaService.error;
  successResena = this.reservaService.success;

  // Computed
  readonly existeResena = computed(() => this.resena() && !this.errorResena());

  // Variables
  stars = Array(5).fill(0); // 5 estrellas
  // Campos del formulario
  formData = this.fb.nonNullable.group({
    idUsuario: this.resena()?.idUsuario ?? '',
    idResena: this.resena()?.idResena ?? '',
    idHospedaje: this.resena()?.idHospedaje ?? '',
    idHabitacion: this.resena()?.idHabitacion ?? '',
    calificacion: this.resena()?.calificacion ?? 5,
    comentario: this.resena()?.comentario ?? '',
  });


  ngOnInit(): void {
    if(this.reservaHospedaje){
      this.reservaH.set(this.reservaHospedaje)
      this.resenaService.getResenasUsuario(
        <string>this.reservaH()?.idUsuario, 
        <string>this.reservaH()?.idHospedaje, 
        <string>this.reservaH()?.idHabitacion
      );
    }
  }

  cancelarReserva(tipo: string): void {
    if(tipo == 'hospedaje'){
      this.reservaService.cancelarReserva(<string>this.reservaH()?.idReserva, tipo);
    }else{
      this.reservaService.cancelarReserva(<string>this.reservaA()?.idReserva, tipo);
    }
  }

  esCancelable(fechaInicial: string){
    const fechaActual: Date = new Date();
    if(new Date(fechaInicial) > fechaActual){
      return true;
    }else{
      return false;
    }
  }

  setRating(rating: number): void {
    this.resena.update(resena => ({
      ...resena,
      calificacion: rating
    }) as Resena);
  }

  hoverRating(rating: number): void {
    this.resena.update(resena => ({
      ...resena,
      calificacion: rating
    }) as Resena);
  }

  guardarDatos(): void {
    if (this.formData.invalid) return this.errorResena.set('Faltan datos.');

    const formValue = this.formData.getRawValue();

    if(this.resena() && this.successResena()){
      this.resenaService.agregarResena(formValue);
    }else{
      this.resenaService.modificarResena(formValue);
    }
  }

  successEffectReserva = effect(() => {
    const success = this.successReserva();
    if (success) {
      this.reservaService.getReserva(<string>this.reservaH()?.idReserva, 'hospedaje');
    }
  });

  successEffectResena = effect(() => {
    const success = this.successResena();
    if (success) {
      this.resenaService.getResenasUsuario(<string>this.reservaH()?.idUsuario, <string>this.reservaH()?.idHospedaje, <string>this.reservaH()?.idHabitacion);
    }
  });
}
