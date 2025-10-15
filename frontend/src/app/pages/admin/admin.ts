import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  auth = inject(AuthService);
  
  // Computed property para reactividad
  isAdmin = computed(() => {
    return this.auth.currentUser()?.rol === 'administrador';
  });

  // Computed para datos del usuario
  currentUser = computed(() => this.auth.currentUser());

  cerrarSesion() {
    this.auth.logout();
  }
}