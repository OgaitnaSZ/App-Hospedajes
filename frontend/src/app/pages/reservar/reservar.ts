import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from '../../core/services/reserva';
import { MercadopagoService } from '../../core/services/mercadopago';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-reservar',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reservar.html',
  styleUrl: './reservar.css'
})
export class Reservar {
  // Inject
  private router = inject(Router);
  private reservaService = inject(ReservaService);
  private mercadopago = inject(MercadopagoService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  // Form
  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dni: ['', Validators.required],
    direccion: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
  });

  formActividad = this.fb.nonNullable.group({
    fecha: ['', Validators.required],
    personas: ['', Validators.required]
  })

  // Variables
  parametros: any;
  fechaActual = new Date();
  minDate: string = `${this.fechaActual.getFullYear()}-${('0' + (this.fechaActual.getMonth() + 1)).slice(-2)}-${('0' + this.fechaActual.getDate()).slice(-2)}`;
  personas: number = 1;
  subtotal: number = 0;
  preferenciaDePago = { titulo: '', total: 0, }

  preferencia = this.mercadopago.preferenciaMP;
  reservaExitosa = signal<boolean>(false);
  detallesPago = signal({
    ...this.form.getRawValue(),
    idPreferencia: '',
  });

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.parametros = navigation?.extras.state || JSON.parse(sessionStorage.getItem('reservaParametros') || '{}');
  
    if (Object.keys(this.parametros).length === 0) {
      console.error('No se encontraron parámetros');
      this.router.navigate(['/hospedajes']);
    } else {
      console.log('Parámetros recibidos:', this.parametros);
      this.subtotal = this.parametros.precioTotal;
    }
  }

  pagar() {
    if (!this.validarDatos()) console.log('Datos incorrectos');
  
    console.log('Datos válidos. Iniciando pago...');
  
    // Preparar preferencia
    if (this.parametros.tipoReserva == 'hospedaje') {
      this.preferenciaDePago.titulo = this.parametros.tituloHospedaje;
      this.preferenciaDePago.total = this.parametros.precioTotal;
    } else {
      this.preferenciaDePago.titulo = this.parametros.titulo;
      this.preferenciaDePago.total = this.parametros.precioTotal * this.personas;
    }
  
    const preferenceData = {
      title: this.preferenciaDePago.titulo,
      quantity: 1,
      unit_price: this.preferenciaDePago.total,
    };
  
    try {
      // Obtener preferencia de pago sin subscribe
      this.mercadopago.createPreference(preferenceData);
      console.log('Preferencia creada:', this.preferencia);
      
      const mp = new (window as any).MercadoPago('APP_USR-89f48669-7c37-472c-b938-81f0ea476d6b', {
        locale: 'es-AR',
      });
  
      mp.checkout({
        preference: { id: this.mercadopago.preferenciaMP()?.preference_id },
        autoOpen: false,  // Desactivar autoOpen
        onSubmit: (event: any) => {
          console.log('Pago enviado', event);
        },
        onClose: () => {
          console.log('El usuario cerró la ventana de pago');
        },
      });
  
      // Actualizar signal con ID de preferencia
      this.detallesPago.update(p => ({
        ...p,
        idPreferencia: <string>this.mercadopago.preferenciaMP()?.id_pago,
      }));
  
      const idUsuario = this.auth.currentUser()?.idUsuario;
      this.parametros.idUsuario = idUsuario;
      const datosReserva = {
        ...this.parametros,
        ...this.detallesPago(),
      };
  
      // Llamar a la reserva sin subscribe
      let reservaResponse: any;
  
      if (this.parametros.tipoReserva === 'hospedaje') {
        reservaResponse = this.reservaService.reservarHospedaje(datosReserva);
      } else if (this.parametros.tipoReserva === 'actividad') {
        reservaResponse = this.reservaService.reservarActividad(datosReserva);
      }else{
        return console.log('Error al reservar');
      }
  
      console.log('Reserva creada con éxito:', reservaResponse);
      this.reservaExitosa.set(true);
  
      this.verificarPagoPeriodicamente(this.detallesPago().idPreferencia);
  
    } catch (error) {
      console.error('Error en el proceso de pago o reserva:', error);
    }
  }

  verificarPagoPeriodicamente(IdPreferencia: string) {
    this.mercadopago.verificarPago(IdPreferencia);
  }

  validarDatos(): boolean {
    const mensajesError = [];

    if (!this.detallesPago().nombre.trim()) mensajesError.push('El campo "Nombre" es obligatorio.');
    if (!this.detallesPago().apellido.trim()) mensajesError.push('El campo "Apellido" es obligatorio.');
    if (!this.detallesPago().dni.trim() || isNaN(Number(this.detallesPago().dni))) mensajesError.push('El campo "DNI" debe ser numérico y no puede estar vacío.');
    if (!this.detallesPago().direccion.trim()) mensajesError.push('El campo "Dirección" es obligatorio.');
    if (!this.detallesPago().email.trim() || !this.validarEmail(this.detallesPago().email)) mensajesError.push('El campo "Email" no es válido.');
    if (!this.detallesPago().telefono.trim()) mensajesError.push('El campo "Teléfono" debe ser numérico y no puede estar vacío.');

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
    this.parametros.total = this.subtotal * this.parametros.personas;
  }
}
