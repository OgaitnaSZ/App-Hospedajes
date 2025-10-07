import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  email: string = '';
  mensaje: string = '';

  constructor(private usuarioApiService: UsuariosService) {}

  subscribe() {
    if (this.email) {
      this.usuarioApiService.suscribirseEmail(this.email).subscribe(response => {
        this.mensaje = "Suscripcion completa."
        this.email = '';
      });
    }
  }

}
