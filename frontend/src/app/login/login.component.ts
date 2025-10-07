import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  pass = '';
  error = '';
  recuperar:boolean = false;
  emailRec = '';
  
  constructor(private login: LoginService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Verifica si se quiere recuperar la contraseña
    this.route.queryParamMap.subscribe(params => {
      if (params.get('recuperar') == 'si') {
        this.recuperar = true;
      }
    });
  }

  onLogin() {
    this.login.login(this.email, this.pass).subscribe(
      (res) => {
        // Verifica si se recibe el token
        console.log(res);
        if (res.token) {
          this.login.setToken(res.token);  // Guarda el token
          this.login.setUserId(res.idUsuario);
          this.login.setRol(res.rol);
          this.router.navigate(['/hospedajes']);  // Redirige al usuario
        } else {
          this.error = 'Token no recibido';
        }
      },
      (err) => {
        // Muestra el error si las credenciales son incorrectas
        this.error = 'Datos incorrectos.'
        console.error(err);  // Muestra el error en la consola para depuración
      }
    );
  }

  recuperarPassword() {
    this.login.recuperarPassword(this.emailRec).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.error = 'Te enviamos un correo de recuperación a tu email.';
          this.router.navigate(['/login']);  // Redirige al usuario
        } else {
          console.log(response.message);
          this.error = response.message;
        }
      },
      (error) => {
        console.error('Error en la solicitud: ', error);  // Muestra el error en la consola para depuración
        this.error = error.message;
      }
    );
  }
}
