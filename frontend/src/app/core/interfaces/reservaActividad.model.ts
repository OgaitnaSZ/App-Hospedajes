import { EstadoReserva } from "./reservaHospedaje.model";

export interface ReservaHospedaje {
    idReserva: string;
    idUsuario: string;
    idActividad: string;
    fecha: string;
    personas: number;
    precioTotal: number;
    estado: EstadoReserva
}
