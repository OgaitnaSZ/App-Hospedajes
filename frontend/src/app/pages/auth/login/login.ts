import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  // Servicios
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  // Campos del formulario
  formLogin = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  formRec = this.fb.nonNullable.group({
    emailRec: ['', [Validators.required, Validators.email]],
  });

  recuperar = signal(false);

  loading = this.auth.loading;
  error = this.auth.error;
  success = this.auth.success;

  ngOnInit(): void {
    // Detecta si el usuario desea recuperar el password
    this.route.queryParamMap.subscribe(params => {
      this.recuperar.set(params.get('recuperar') === 'si');
    });
  }

  successEffect = effect(() => {
    const success = this.success();
    if (success) {
      console.log('✅ Login exitoso:', success);
      this.router.navigate(['/']);
    }
  });

  async onLogin() {
    if (this.formLogin.invalid) return this.error.set('Faltan datos.');
    const { email, password } = this.formLogin.getRawValue(); 
    this.auth.login(email, password);
  }

  async recuperarPassword() {
    if (this.formRec.invalid) return this.error.set('Faltan datos.');
    
    const { emailRec } = this.formRec.getRawValue(); 

    this.auth.recuperarPassword(emailRec);

    if (this.success()) {
      this.error.set('✅ Te enviamos un correo de recuperación.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.error.set('❌ No se pudo enviar el correo.');
    }
  }
}