import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ReservaApiService } from '../services/reserva.api.service';
import { MercadopagoService } from '../services/mercadopago.service';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reservar.component.html',
})
export class ReservarComponent {
  constructor(private reservaService: ReservaApiService, 
              private mercadopagoService: MercadopagoService,
              private router: Router){}

  parametros: any;
  fechaActual = new Date();
  minDate: string = `${this.fechaActual.getFullYear()}-${('0' + (this.fechaActual.getMonth() + 1)).slice(-2)}-${('0' + this.fechaActual.getDate()).slice(-2)}`;

  detallesPago: any = {
    Nombre: '',
    Apellido: '',
    Dni: '',
    Direccion: '',
    Email: '',
    Telefono: '',
    IdPreferencia: '',
  }

  personas: number = 1;
  subtotal: number = 0;
  preferenciaDePago = {
    Titulo: '',
    Total: 0,
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.parametros = navigation?.extras.state || JSON.parse(sessionStorage.getItem('reservaParametros') || '{}');
  
    if (Object.keys(this.parametros).length === 0) {
      console.error('No se encontraron parámetros');
      this.router.navigate(['/hospedajes']);
    } else {
      console.log('Parámetros recibidos:', this.parametros);
      this.subtotal = this.parametros.Total;
    }
  }

  pagar() {
    if (this.validarDatos()) {
      console.log('Datos válidos. Iniciando pago...');

      // Preparar preferencia de pago
      if(this.parametros.TipoReserva == 'Hospedaje'){
        this.preferenciaDePago.Titulo = this.parametros.TituloHospedaje;
        this.preferenciaDePago.Total = this.parametros.Total;
      }else{
        this.preferenciaDePago.Titulo = this.parametros.Titulo;
        this.preferenciaDePago.Total = this.parametros.Total*this.personas;
      }
      
      const preferenceData = {
        title: this.preferenciaDePago.Titulo,
        quantity: 1,
        unit_price: this.preferenciaDePago.Total,
      }

      this.mercadopagoService.createPreference(preferenceData).subscribe({
        next: (response) => {
          console.log('Preferencia creada:', response);
          const mp = new (window as any).MercadoPago('APP_USR-71c14563-f746-4164-a5c7-2543a2b5d6d0', {
            locale: 'es-AR',
          });

          mp.checkout({
            preference: {
              id: response.preference_id, // ID de la preferencia generada
            },
            autoOpen: true,
          });

          this.detallesPago.IdPreferencia = response.id_pago;

          if(this.parametros.TipoReserva == 'Hospedaje'){
            const datosReserva = {
              ...this.parametros,
              ...this.detallesPago
            }
            this.reservaService.reservarHospedaje(datosReserva).subscribe(
              (response)=>{
                console.log('Creado con exito', response)
              },
              (error) => {
                console.error('Error al crear la reserva:', error);
              }
            )
          }else if(this.parametros.TipoReserva == 'Actividad'){
            const datosReserva = {
              ...this.parametros,
              ...this.detallesPago
            }
            this.reservaService.reservarActividad(datosReserva).subscribe(
              (response)=>{
                console.log('Creado con exito', response)
              },
              (error) => {
                console.error('Error al crear la reserva:', error);
              }
            )
          }

          // Verificar pago para cerrar la pestana
          this.verificarPagoPeriodicamente(this.detallesPago.IdPreferencia);
      
        },
        error: (error) => {
          console.error('Error al crear la preferencia:', error);
        },
      });
    }
  }

  intervalId: any; // Variable para almacenar el intervalo

  verificarPagoPeriodicamente(IdPreferencia: string) {
    this.intervalId = setInterval(() => {
      this.reservaService.verificarPago(IdPreferencia).subscribe(
        (response) => {
          console.log('Verificado con éxito', response);
          if (response.estado === 'Aprobado') {
            console.log('Pago confirmado, redirigiendo...');
            clearInterval(this.intervalId); // Detiene el intervalo
            this.router.navigate(['']);
          }
        },
        (error) => { 
          console.error('Error al verificar pago:', error);
        }
      );
    }, 5000); // Se ejecuta cada 5 segundos
  }

  validarDatos(): boolean {
    const mensajesError = [];

    if (!this.detallesPago.Nombre.trim()) mensajesError.push('El campo "Nombre" es obligatorio.');
    if (!this.detallesPago.Apellido.trim()) mensajesError.push('El campo "Apellido" es obligatorio.');
    if (!this.detallesPago.Dni.trim() || isNaN(Number(this.detallesPago.Dni))) mensajesError.push('El campo "DNI" debe ser numérico y no puede estar vacío.');
    if (!this.detallesPago.Direccion.trim()) mensajesError.push('El campo "Dirección" es obligatorio.');
    if (!this.detallesPago.Email.trim() || !this.validarEmail(this.detallesPago.Email)) mensajesError.push('El campo "Email" no es válido.');
    if (!this.detallesPago.Telefono.trim() || isNaN(Number(this.detallesPago.Telefono))) mensajesError.push('El campo "Teléfono" debe ser numérico y no puede estar vacío.');

    if (mensajesError.length > 0) {
      alert('Errores en el formulario:\n\n' + mensajesError.join('\n'));
      return false;
    }

    return true;
  }
  // Validar formato de email
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  calcularTotal(){
    this.parametros.Total = this.subtotal * this.parametros.Personas;
  }
}
