import { Actividad } from "./actividad.model";
import { EstadoReserva } from "./reservaHospedaje.model";

export interface ReservaActividad {
    idReserva: string;
    idUsuario: string;
    idActividad: string;
    fecha: string;
    personas: number;
    precioTotal: number;
    estado: EstadoReserva
}

export interface ReservaActividadDetalle {
  idUsuario: string;
  idReserva: string;
  idActividad: string;
  fecha: string;
  estado: EstadoReserva;
  personas: string;
  imagen: string;
  precioTotal: string;
  actividades: Actividad;
}
