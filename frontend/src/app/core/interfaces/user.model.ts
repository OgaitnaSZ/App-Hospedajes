export interface User {
    idUsuario: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: Rol;
    password?: string
}

export enum Rol {
  Admin = 'administrador',
  Huesped = 'huesped'
}

export interface UserRegister {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    password: string;
}