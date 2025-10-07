import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../services/login.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private loginService: LoginService, private router: Router) {
    // Escucha cambios en la ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Cambia isHome según la ruta actual
        this.isHome = event.url === '/' || event.url.startsWith('/#');
      }
    });
  }

  isScrolled = false;
  isMenuOpen: boolean = false;
  isHome: boolean = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  // Función para verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  isAdmin(): boolean {
    const rol = this.loginService.getRol();
    return rol === 'administrador';
  }

}
