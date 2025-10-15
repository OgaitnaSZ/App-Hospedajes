// admin.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './core/services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si está logueado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  // 2. Verificar si es administrador
  const user = authService.currentUser();
  if (user?.rol !== 'administrador') {
    // Redirigir a home si no es admin
    router.navigate(['/']);
    return false;
  }

  // 3. Permitir acceso solo si es admin
  return true;
};