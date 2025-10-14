export interface Pago {
    idPago: string;
    idReserva: string;
    nombre: string;
    apellido: string;
    dni: string;
    direccion: string;
    email: string;
    telefono: string;
    monto: number;
    idPreferencia: string;
    estado: string;
}

export enum EstadoPago {
  Pendiente = 'pendiente',
  Aprobado = 'aprobado',
  Rechazado = 'rechazado'
}