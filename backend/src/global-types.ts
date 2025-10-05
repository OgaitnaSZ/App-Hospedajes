import { usuario } from './generated/prisma';

// Extiende el namespace de Express
declare global {
  namespace Express {
    interface Request {
      user?: usuario | null;
    }
  }
}