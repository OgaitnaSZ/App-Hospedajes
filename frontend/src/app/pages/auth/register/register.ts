import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { User, UserRegister } from '../../../core/interfaces/user.model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // Campos del formulario
  nombre = '';
  apellido = '';
  email = '';
  telefono = '';
  pass = '';
  error = '';

  // Servicios
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  usuario: UserRegister = {
    nombre: this.nombre,
    apellido: this.apellido,
    email: this.email,
    telefono: this.telefono,
    password: this.pass
  }

  async onRegister() {
    this.error = '';
    const ok = await this.auth.register(this.usuario);
    if (ok) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Datos incorrectos o error de conexión.';
    }
  }

}
