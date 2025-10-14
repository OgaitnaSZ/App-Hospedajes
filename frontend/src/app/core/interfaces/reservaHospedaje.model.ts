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

export enum EstadoReserva {
  Pendiente = 'pendiente',
  Concretado = 'concretado',
  PendienteDeCancelacion = 'pendiente de cancelacion',
  Cancelado = 'cancelado'
}
