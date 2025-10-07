import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './administrador.component.html',
})
export class AdministradorComponent {
  constructor(private loginService: LoginService) {}
  isAdmin(): boolean {
    return this.loginService.getRol() === 'administrador';
  }
  cerrarSession(){
    this.loginService.logout();
  }
}
