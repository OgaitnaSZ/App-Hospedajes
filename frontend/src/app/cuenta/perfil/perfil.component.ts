import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent {
  userData: any;
  mensaje = '';

  constructor(private userService: UsuariosService,) {}

  ngOnInit(): void {
    this.userService.cargarDatos().subscribe(
      (data) => {
        this.userData = data;
      },
      (error) => {
        console.error('Error al cargar los datos del usuario', error);
      }
    );
  }

  guardarDatos(): void {
    console.log('Datos a actualizar:', this.userData);
    this.userService.actualizarDatos(this.userData).subscribe(
      (response) => {
        this.mensaje = 'Datos actualizados correctamente';
      },
      (error) => {
        console.error('Error al actualizar los datos', error);
        this.mensaje = 'Error al actualizar los datos';
      }
    );
  }
}
