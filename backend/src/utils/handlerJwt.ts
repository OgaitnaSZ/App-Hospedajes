import { usuario } from "../generated/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en el archivo .env");
}

/**
*Pasar el objeto usuario
* @param {*} usuario
*/
const tokenSign = async (usuario: usuario)=>{

    return await jwt.sign(
        {
            idUsuario: usuario.idUsuario,
            nombre: usuario.nombre
        },
        JWT_SECRET,
        {
            expiresIn: "12h"
        }
    )
}

/**
 * Pasar token de session
 * @param {*} tokenJwt
 * @returns
 */
const verifyToken = async (tokenJwt: string): Promise<any> => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET as string);
    } catch (error) {
        return null;
    }
};


export { tokenSign, verifyToken }