import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-cuenta',
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css'
})
export class Cuenta {
  auth = inject(AuthService);

  // Computed property para reactividad
  isLoggedIn = computed(() => {
    return this.auth.isLoggedIn()
  });

  cerrarSesion() {
    this.auth.logout();
  }
}
