import { Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { authGuard } from './auth.guard';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Admin } from './pages/admin/admin';
import { Cuenta } from './pages/cuenta/cuenta';
import { Error } from './layout/error/error';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login},
    { path: 'registro', component: Register},
    { path: 'cuenta', component: Cuenta, canActivate: [authGuard],  
      children: [
        // Proximamente
      ]
    },
    { path: 'administrador', component: Admin, canActivate: [adminGuard],
      children: [
        // Proximamente
      ]
     },
    { path: '**', component:Error },
];
