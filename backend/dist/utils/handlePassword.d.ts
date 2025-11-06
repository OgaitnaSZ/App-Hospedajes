/**
* Contraseña sin encripttar: hola.01
* @param {*} passwordPlain
*/
declare const encrypt: (passwordPlain: string) => Promise<string>;
/**
* Contraseña sin encripttar y encriptada
* @param {*} passwordPlain
* @param {*} hashPassword
*/
declare const compare: (passwordPlain: string, hashPassword: string) => Promise<boolean>;
export { encrypt, compare };
//# sourceMappingURL=handlePassword.d.ts.map