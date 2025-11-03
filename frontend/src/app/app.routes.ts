import { Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { authGuard } from './auth.guard';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Admin } from './pages/admin/admin';
import { Cuenta } from './pages/cuenta/cuenta';
import { Soporte } from './pages/soporte/soporte';
import { Error } from './layout/error/error';
import { Hospedajes } from './pages/hospedajes/hospedajes';
import { Actividades } from './pages/actividades/actividades';
import { Datepicker } from './layout/shared/date-picker/date-picker';
import { Hospedaje } from './pages/hospedajes/hospedaje/hospedaje';
import { Reservar } from './pages/reservar/reservar';
import { HospedajesAdmin } from './pages/admin/hospedajes/hospedajes';
import { HospedajeAdmin } from './pages/admin/hospedajes/hospedaje/hospedaje';
import { ActividadesAdmin } from './pages/admin/actividades/actividades';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login},
    { path: 'registro', component: Register},
    { path: 'hospedajes', component: Hospedajes},
    { path: 'hospedaje/:id', component: Hospedaje },
    { path: 'actividades', component: Actividades },
    { path: 'date', component: Datepicker},
    { path: 'soporte', component: Soporte},
    { path: 'cuenta', component: Cuenta, canActivate: [authGuard],  
      children: [
        // Proximamente
      ]
    },
    { path: 'reservar', component: Reservar, canActivate: [authGuard]},
    { path: 'administrador', component: Admin, canActivate: [adminGuard],
      children: [
        { path: 'hospedajes', component: HospedajesAdmin},
        { path: 'hospedajes/agregar', component: HospedajeAdmin},
        { path: 'hospedajes/editar/:id', component: HospedajeAdmin},
        { path: 'actividades', component: ActividadesAdmin}
      ]
     },
    { path: '**', component:Error },
];
