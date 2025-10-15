import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html'
})
export class Footer {
  email = signal('');
  mensaje = signal('');
  
  constructor(private usuarioApiService: UserService) {}
  
  subscribe() {
    if (this.email()) {
      this.usuarioApiService.suscribeEmail(this.email()).subscribe(() => {
        this.mensaje.set('Suscripción completa.');
        this.email.set('');
      });
    }
  }
}
