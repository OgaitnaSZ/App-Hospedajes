import e, { Request, Response } from "express";
export declare function reservarHospedaje(req: Request, res: Response): Promise<e.Response<any, Record<string, any>>>;
export declare function cancelarReserva(req: Request, res: Response): Promise<e.Response<any, Record<string, any>> | undefined>;
export declare function obtenerReserva(req: Request, res: Response): Promise<e.Response<any, Record<string, any>> | undefined>;
export declare function obtenerReservasUsuario(req: Request, res: Response): Promise<e.Response<any, Record<string, any>> | undefined>;
export declare function obtenerFechasOcupadas(req: Request, res: Response): Promise<e.Response<any, Record<string, any>> | undefined>;
export declare function reservarActividad(req: Request, res: Response): Promise<e.Response<any, Record<string, any>>>;
export declare function verificarPagoHospedaje(req: Request, res: Response): Promise<e.Response<any, Record<string, any>> | undefined>;
export declare function verificarPagoActividad(req: Request, res: Response): Promise<e.Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=reserva.d.ts.map