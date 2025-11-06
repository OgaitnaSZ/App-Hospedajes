import { Request, Response, NextFunction } from "express";
import { usuario_rol } from '../generated/prisma';
export declare const checkRol: (allowedRoles: usuario_rol[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=rol.d.ts.map