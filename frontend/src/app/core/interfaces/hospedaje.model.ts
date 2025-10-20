import { Habitacion } from "./habitacion.model";

export interface Hospedaje {
    idHospedaje: string;
    titulo: string;
    descripcion: string;
    servicios: number[];
    estrellas: number;
    telefono: string;
    ciudad: string;
    direccion: string;
    coordenadas: string;
    imagen: string;
    destacado: boolean;
}
export interface HospedajeListado {
    idHospedaje: string;
    titulo: string;
    descripcion: string;
    servicios: ServiciosHospedaje[];
    estrellas: number;
    telefono: string;
    ciudad: string;
    direccion: string;
    coordenadas: string;
    imagen: string;
    destacado: boolean;
    precioMinimo: number;
    habitaciones: Habitacion[];
}
export interface HospedajeDetalles {
    idHospedaje: string;
    titulo: string;
    descripcion: string;
    servicios: ServiciosHospedaje[];
    estrellas: number;
    telefono: string;
    ciudad: string;
    direccion: string;
    coordenadas: string;
    fotos: string[];
    destacado: boolean;
    precioMinimo: number;
    habitaciones: Habitacion[];
    calificacionPromedio: number;
}
interface ServiciosHospedaje {
    nombre: string;
    descripcion: string;
}