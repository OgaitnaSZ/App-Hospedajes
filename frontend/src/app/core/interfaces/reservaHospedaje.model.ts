import { Habitacion } from "./habitacion.model";
import { hospedajeDetalleAdmin } from "./hospedaje.model";

export interface ReservaHospedaje {
    idReserva: string;
    idUsuario: string;
    idHospedaje: string;
    idHabitacion: string;
    fechaInicio: string;
    fechaFin: string;
    personas: number;
    precioTotal: number;
    estado: EstadoReserva
}

export interface ReservaHospedajeDetalle {
  idUsuario: string;
  idReserva: string;
  idHospedaje: string;
  idHabitacion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoReserva;
  personas: string;
  precioTotal: string;
  habitaciones: Habitacion;
  hospedaje: hospedajeDetalleAdmin;
}

export enum EstadoReserva {
  Pendiente = 'pendiente',
  Concretado = 'concretado',
  PendienteDeCancelacion = 'pendiente de cancelacion',
  Cancelado = 'cancelado'
}
