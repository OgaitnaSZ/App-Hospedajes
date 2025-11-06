import { usuario } from "../generated/prisma";
/**
*Pasar el objeto usuario
* @param {*} usuario
*/
export declare const tokenSign: (usuario: usuario) => Promise<string>;
/**
 * Pasar token de session
 * @param {*} tokenJwt
 * @returns
 */
export declare const verifyToken: (tokenJwt: string) => Promise<any>;
//# sourceMappingURL=handlerJwt.d.ts.map