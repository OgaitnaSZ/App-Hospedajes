export interface User {
    idUsuario: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: Rol;
}

export enum Rol {
  Admin = 'administrador',
  Huesped = 'huesped'
}
