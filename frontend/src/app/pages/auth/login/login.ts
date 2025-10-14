import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
})
export class Login {
  // Campos del formulario
  email = '';
  pass = '';
  error = '';
  recuperar = false;
  emailRec = '';

  // Servicios
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Detecta si el usuario desea recuperar el password
    this.route.queryParamMap.subscribe(params => {
      this.recuperar = params.get('recuperar') === 'si';
    });
  }

  async onLogin() {
    this.error = '';
    const ok = await this.auth.login(this.email, this.pass);
    if (ok) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Datos incorrectos o error de conexión.';
    }
  }

  async recuperarPassword() {
    this.error = '';
    try {
      const res = await this.auth.recuperarPassword(this.emailRec);
      if (res?.status === 200) {
        this.error = 'Te enviamos un correo de recuperación.';
        this.router.navigate(['/login']);
      } else {
        this.error = res?.message || 'No se pudo enviar el correo.';
      }
    } catch (err: any) {
      console.error('Error en la solicitud:', err);
      this.error = err.message || 'Error desconocido.';
    }
  }
}
