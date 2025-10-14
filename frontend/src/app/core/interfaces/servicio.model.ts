export interface Servicio {
    idServicio: string;
    tipo: TipoServicio;
    nombre: string;
    descripcion: string;
}

export enum TipoServicio {
  Hospedaje = 'hospedaje',
  Habitacion = 'habitacion'
}
