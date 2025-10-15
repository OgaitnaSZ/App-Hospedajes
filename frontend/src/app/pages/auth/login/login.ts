import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
export class Login implements OnInit {
  // Campos del formulario
  email = signal('');
  pass = signal('');
  error = signal('');
  recuperar = signal(false);
  emailRec = signal('');
  isLoading = signal(false);

  // Computed properties (reactivos)
  canLogin = computed(() => {
    return this.email().trim().length > 0 && 
           this.pass().trim().length > 0 && 
           !this.isLoading();
  });

  canRecover = computed(() => {
    const email = this.emailRec().trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValidEmail && !this.isLoading();
  });

  // Servicios
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Detecta si el usuario desea recuperar el password
    this.route.queryParamMap.subscribe(params => {
      this.recuperar.set(params.get('recuperar') === 'si');
    });
  }

  async onLogin() {
    if (!this.canLogin()) return;
    
    this.isLoading.set(true);
    this.error.set('');
    
    try {
      const ok = await this.auth.login(this.email(), this.pass());
      if (ok) {
        this.router.navigate(['/']);
      } else {
        this.error.set('Datos incorrectos o error de conexión.');
      }
    } catch (err: any) {
      this.error.set(err.message || 'Error desconocido al iniciar sesión.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async recuperarPassword() {
    if (!this.canRecover()) return;
    
    this.isLoading.set(true);
    this.error.set('');
    
    try {
      const res = await this.auth.recuperarPassword(this.emailRec());
      if (res?.status === 200) {
        this.error.set('✅ Te enviamos un correo de recuperación.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.error.set(res?.message || '❌ No se pudo enviar el correo.');
      }
    } catch (err: any) {
      console.error('Error en la solicitud:', err);
      this.error.set(err.message || '❌ Error desconocido.');
    } finally {
      this.isLoading.set(false);
    }
  }
}