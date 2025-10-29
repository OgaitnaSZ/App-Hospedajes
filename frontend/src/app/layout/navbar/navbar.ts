import { Component, signal, computed, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth'; // tu servicio con signals

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
// Signals del componente
  isScrolled = signal(false);
  isMenuOpen = signal(false);
  currentUrl = signal('/');

  // Inyectar auth primero (para evitar error de inicialización)
  constructor(private router: Router, private auth: AuthService) {
    // Reaccionar a cambios de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }

  // Computed signals
  isHome = computed(() => this.currentUrl() === '/');
  isLoggedIn = computed(() => !!this.auth.currentUser());
  isAdmin = computed(() => this.auth.currentUser()?.rol === 'administrador');

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 0);
  }

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  logout() {
    this.auth.logout();
    this.isMenuOpen.set(false);
  }
}
