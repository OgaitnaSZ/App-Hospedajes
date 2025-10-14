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
