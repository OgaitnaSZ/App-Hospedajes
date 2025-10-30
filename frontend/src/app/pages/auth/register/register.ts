import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UserRegister } from '../../../core/interfaces/user.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // Servicios
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  // Campos del formulario
  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: ['', Validators.required],
    pass: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = this.auth.loading;
  error = this.auth.error;
  success = this.auth.success;

  async onRegister() {
    if (this.form.invalid) return this.error.set('Faltan datos.');
  
    const usuario: UserRegister = this.form.getRawValue(); 

    this.auth.register(usuario);

    if(this.success()){
        this.router.navigate(['/']);
    }else{
      this.error.set('Datos incorrectos o error de conexión.');
    }
  }
}
