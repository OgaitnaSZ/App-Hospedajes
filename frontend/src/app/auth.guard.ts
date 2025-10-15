// auth.guard.ts (para rutas que requieren cualquier usuario logueado)
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './core/services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  return true;
};