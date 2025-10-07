import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [LoginService],
  templateUrl: './crear-usuario.component.html',
})
export class CrearUsuarioComponent {
  nombre = '';
  apellido = '';
  telefono = '';
  email = '';
  pass = '';
  confirmPass = '';

  mensajesError: string[] = [];

  constructor(private http: HttpClient, private router: Router, private login: LoginService) {}

  onRegister() {
    if (this.validarDatos()){
      if (this.pass !== this.confirmPass) {
        alert('Las contraseñas no coinciden');
        this.mensajesError.push("El correo ya se encuentra registrado.");
        return;
      }
      const userData = {nombre: this.nombre, apellido: this.apellido, email: this.email, telefono: this.telefono, pass: this.pass };
      this.login.crearUsuario(userData).subscribe(
        (response) => {
          console.log('Usuario creado', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error al registrar usuario', error);
          this.mensajesError.push("El correo ya se encuentra registrado.");
        }
      );
    }
  }

  validarDatos(): boolean {
    this.mensajesError = []; // Reiniciar errores antes de validar
    if (!this.nombre.trim()) this.mensajesError.push('El campo "Nombre" es obligatorio.');
    if (!this.apellido.trim()) this.mensajesError.push('El campo "Apellido" es obligatorio.');
    if (!this.email.trim() || !this.validarEmail(this.email)) this.mensajesError.push('El campo "Email" no es válido.');
    if (!this.telefono.trim() || isNaN(Number(this.telefono))) this.mensajesError.push('El campo "Teléfono" debe ser numérico y no puede estar vacío.');
  
    return this.mensajesError.length === 0;
  }
  
  // Validar formato de email
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
  
}
