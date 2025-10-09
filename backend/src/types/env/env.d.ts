import { usuario, usuario_rol } from "../../generated/prisma"; // Ajusta la ruta según tu proyecto

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      JWT_SECRET?: string;
      PUBLIC_URL?: string;
      NODE_ENV?: string;
    }
  }
}

export {};
