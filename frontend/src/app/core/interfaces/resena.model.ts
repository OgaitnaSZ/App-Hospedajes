export interface Resena {
    idResena?: string;
    idUsuario: string;
    idHospedaje: string;
    idHabitacion: string;
    calificacion: number;
    comentario: string;
}

export interface ResenaHome {
    idHospedaje: string;
    calificacion: number;
    comentario: string;
    usuario: string;
}