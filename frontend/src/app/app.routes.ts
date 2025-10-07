import { Routes } from '@angular/router';
import { HospedajeComponent } from './hospedajes/hospedaje/hospedaje.component';
import { HospedajesComponent } from './hospedajes/hospedajes.component';
import { NgModule } from '@angular/core';
import { AgregarHospedajeComponent } from './administrador/administrar-hospedajes/agregar-hospedaje/agregar-hospedaje.component';
import { LoginComponent } from './login/login.component';
import { CrearUsuarioComponent } from './login/crear-usuario/crear-usuario.component';
import { authGuard } from './auth.guard';
import { CuentaComponent } from './cuenta/cuenta.component';
import { HistorialComponent } from './cuenta/historial/historial.component';
import { PerfilComponent } from './cuenta/perfil/perfil.component';
import { ContrasenaComponent } from './cuenta/contrasena/contrasena.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { AdministrarHospedajesComponent } from './administrador/administrar-hospedajes/administrar-hospedajes.component';
import { ModificarComponent } from './administrador/administrar-hospedajes/modificar/modificar.component';
import { HomeComponent } from './home/home.component';
import { ErrorPaginaComponent } from './error-pagina/error-pagina.component';
import { DetallesComponent } from './cuenta/historial/detalles/detalles.component';
import { ReservarComponent } from './reservar/reservar.component';
import { TemporadaComponent } from './temporada/temporada.component';
import { ActividadesAdminComponent } from './administrador/actividades/actividadesAdmin.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { SoporteComponent } from './soporte/soporte.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'hospedajes', component: HospedajesComponent},
    { path: 'hospedaje/:id', component: HospedajeComponent },
    { path: 'reservar', component: ReservarComponent, canActivate: [authGuard]},
    { path: 'registro', component: CrearUsuarioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'temporada', component: TemporadaComponent },
    { path: 'actividades', component: ActividadesComponent },
    { path: 'soporte', component: SoporteComponent },
    { path: 'cuenta', component: CuentaComponent, canActivate: [authGuard],  
        children: [
          { path: 'perfil', component: PerfilComponent},
          { path: 'historial', component: HistorialComponent,
            children: [
              { path: 'detalles', component: DetallesComponent, outlet:'ver'},
            ]
          },
          { path: 'cambiar-contrasena', component: ContrasenaComponent},
        ]
    },
    { path: 'administrador', component: AdministradorComponent, canActivate: [authGuard],
      children: [
        { path: 'hospedajes', component: AdministrarHospedajesComponent},
        { path: 'actividades', component: ActividadesAdminComponent},
        { path: 'perfil', component: PerfilComponent},
        { path: 'cambiar-contrasena', component: ContrasenaComponent},
        { path: 'agregar-hospedaje', component: AgregarHospedajeComponent},
        { path: 'editar/:id', component: ModificarComponent}
      ]
     },
    { path: '**', component:ErrorPaginaComponent },
];
