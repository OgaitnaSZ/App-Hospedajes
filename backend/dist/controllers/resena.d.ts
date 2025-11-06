import { Request, Response } from "express";
export declare function crearResena(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function actualizarResena(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getResenasUsuario(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getResenasHospedaje(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getMejoresResenas(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function eliminarResena(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=resena.d.ts.map