export interface Habitacion {
    idHabitacion: string;
    idHospedaje: string;
    numero: string;
    tipo: string;
    precio: number;
    capacidad: number;
    servicios: string;
}

export interface HabitacionDetalle {
    idHabitacion: string;
    idHospedaje: string;
    numero: string;
    tipo: string;
    precio: number;
    capacidad: number;
    servicios: ServiciosHabitacion[];
}

interface ServiciosHabitacion {
    nombre: string;
    descripcion: string;
}