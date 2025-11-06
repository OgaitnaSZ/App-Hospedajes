import { Request, Response } from "express";
export declare function getHospedajes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getHospedaje(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function agregarHospedaje(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function modificarHospedaje(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function toggleEstadoHospedaje(req: Request, res: Response): Promise<void>;
export declare function eliminarHospedaje(req: Request, res: Response): Promise<void>;
export declare function getHabitaciones(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function agregarHabitacion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function modificarHabitacion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function eliminarHabitacion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getActividades(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function agregarActividad(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function modificarActividad(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function eliminarActividad(req: Request, res: Response): Promise<void>;
export declare function subirFotos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function actualizarOrden(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function eliminarFoto(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=admin.d.ts.map