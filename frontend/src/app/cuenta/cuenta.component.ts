import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './cuenta.component.html',
})
export class CuentaComponent {
  estadoPago: string = '';
  noHayNotificacion: boolean = true;
  mensaje: string = '';
  simbolo: string = '';
  color: string = '';

  constructor(private loginService: LoginService,
              private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('pagoVentanaAbierta')) {
      localStorage.removeItem('pagoVentanaAbierta'); // Eliminar la marca
      window.close(); // Intentar cerrar la pestaña original
    }
    // Acceder a los parámetros GET de la URL
    this.route.queryParams.subscribe(params => {
      this.estadoPago = params['status'];
      console.log(this.estadoPago);
    });
    switch(this.estadoPago){
      case 'approved':
        this.noHayNotificacion = false;
        this.mensaje = 'Tu pago ha sido aprobado. Gracias por confiar en nosotros.';
        this.simbolo = 'sentiment_satisfied';
        this.color = 'text-success';

        break;
      case 'pending':
        this.noHayNotificacion = false;
        this.mensaje = 'Tu pago está pendiente. Por favor, verifica tu pago.';
        this.simbolo = 'schedule';
        this.color = 'text-warning';
        break;

      case 'rejected':
        this.noHayNotificacion = false;
        this.mensaje = 'Tu pago ha sido rechazado. Por favor, intenta de nuevo.';
        this.simbolo = 'sentiment_dissatisfied';
        this.color = 'text-danger';
        break;

      default:
        this.noHayNotificacion = true;
        break;
    }
  }

  cerrarSession(){
    this.loginService.logout();
  }
}