import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UserRegister } from '../../../core/interfaces/user.model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // Campos del formulario
  nombre = signal('');
  apellido = signal('');
  email = signal('');
  telefono = signal('');
  pass = signal('');
  error = signal('');
  isLoading = signal(false);

  // Computed properties (reactivos)
  canRegister = computed(() => {
    return this.nombre().trim().length > 0 && 
           this.apellido().trim().length > 0 && 
           this.email().trim().length > 0 && 
           this.telefono().trim().length > 0 && 
           this.pass().trim().length > 0 && 
           !this.isLoading();
  });

  canRecover = computed(() => {
    const email = this.email().trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValidEmail && !this.isLoading();
  });

  // Servicios
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  async onRegister() {
    if (!this.canRegister()) return;
    
    this.isLoading.set(true);
    this.error.set('');
    
    const usuario: UserRegister = {
      nombre: this.nombre(),
      apellido: this.apellido(),
      email: this.email(),
      telefono: this.telefono(),
      password: this.pass()
    }

    try {
      const ok = await this.auth.register(usuario);
      if (ok) {
        this.router.navigate(['/']);
      } else {
        this.error.set('Datos incorrectos o error de conexión.');
      }
    } catch (err: any) {
      this.error.set(err.message || 'Error desconocido al registrarse.');
    } finally {
      this.isLoading.set(false);
    }
  }

}
