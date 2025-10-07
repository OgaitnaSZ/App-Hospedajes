import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contrasena.component.html',
})
export class ContrasenaComponent {
  constructor(private userService: UsuariosService, private login: LoginService) {}
  
  IdUsuario = this.login.getUserId();
  Password = '';
  OldPassword = '';
  NewPassword = '';
  ConfirmPassword = '';
  mensajeError = '';
  estilo = '';

  guardarDatos(): void {
    if (this.NewPassword !== this.ConfirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    this.mensajeError = ''; 
  
    const data = {
      IdUsuario: this.IdUsuario,
      OldPassword: this.OldPassword,
      Password: this.NewPassword
    };
  
    this.userService.actualizarPassword(data).subscribe(
      (response) => {
        alert(response.success);
        this.mensajeError = 'Contraseña actualizada correctamente';
        this.estilo = 'text-success';
      },
      (error) => {
        console.log(error);
        this.mensajeError = 'Error al actualizar contraseña.';
        this.estilo = 'text-danger'
      }
    );
  }
  
}
