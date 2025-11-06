"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservarHospedaje = reservarHospedaje;
exports.cancelarReserva = cancelarReserva;
exports.obtenerReserva = obtenerReserva;
exports.obtenerReservasUsuario = obtenerReservasUsuario;
exports.obtenerFechasOcupadas = obtenerFechasOcupadas;
exports.reservarActividad = reservarActividad;
exports.verificarPagoHospedaje = verificarPagoHospedaje;
exports.verificarPagoActividad = verificarPagoActividad;
const prisma_1 = require("../generated/prisma");
const express_validator_1 = require("express-validator");
const handleError_1 = require("../utils/handleError");
const prisma = new prisma_1.PrismaClient();
const nodemailer_1 = __importDefault(require("nodemailer"));
function reservarHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataReserva = (0, express_validator_1.matchedData)(req);
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Crear reserva
                const nuevaReserva = yield tx.reservas_hospedajes.create({
                    data: {
                        idUsuario: String(dataReserva.idUsuario),
                        idHospedaje: String(dataReserva.idHospedaje),
                        idHabitacion: String(dataReserva.idHabitacion),
                        fechaInicio: new Date(dataReserva.fechaInicio),
                        fechaFin: new Date(dataReserva.fechaFin),
                        personas: Number(dataReserva.personas),
                        precioTotal: Number(dataReserva.precioTotal),
                        estado: "pendiente"
                    }
                });
                const nuevoPago = yield tx.pagos_hospedajes.create({
                    data: {
                        nombre: dataReserva.nombre,
                        apellido: dataReserva.apellido,
                        dni: dataReserva.dni,
                        direccion: dataReserva.direccion,
                        email: dataReserva.email,
                        telefono: dataReserva.telefono,
                        monto: Number(dataReserva.precioTotal),
                        idPreferencia: dataReserva.idPreferencia,
                        estado: prisma_1.pagos_hospedajes_estado.pendiente,
                        reservas_hospedajes: { connect: { idReserva: nuevaReserva.idReserva } },
                        usuario: { connect: { idUsuario: dataReserva.idUsuario } }
                    }
                });
                return { nuevaReserva, nuevoPago };
            }));
            return res.status(201).json(result);
        }
        catch (error) {
            console.log(error);
            return (0, handleError_1.handleHttpError)(res, "Error al reservar", 500);
        }
    });
}
function cancelarReserva(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (0, express_validator_1.matchedData)(req);
            let reservaCancelada = undefined;
            if (data.tipo == 'hospedaje') {
                const reservaExistente = yield prisma.reservas_hospedajes.findUnique({
                    where: { idReserva: String(data.id) }
                });
                if (!reservaExistente) {
                    return (0, handleError_1.handleHttpError)(res, "ID de reserva no encontrada", 404);
                }
                reservaCancelada = yield prisma.reservas_hospedajes.update({
                    where: {
                        idReserva: String(data.id),
                        idUsuario: req.user.idUsuario
                    },
                    data: {
                        estado: prisma_1.reservas_hospedajes_estado.pendiente_de_cancelacion,
                    }
                });
            }
            else {
                const reservaExistente = yield prisma.reservas_actividades.findUnique({
                    where: {
                        idReserva: String(data.id),
                    }
                });
                if (!reservaExistente) {
                    return (0, handleError_1.handleHttpError)(res, "ID de reserva no encontrada", 404);
                }
                reservaCancelada = yield prisma.reservas_actividades.update({
                    where: {
                        idReserva: String(data.id),
                        idUsuario: req.user.idUsuario
                    },
                    data: {
                        estado: prisma_1.reservas_actividades_estado.pendiente_de_cancelacion,
                    }
                });
            }
            if (!reservaCancelada) {
                return (0, handleError_1.handleHttpError)(res, "No puedes cancelar la reserva de otro usuario", 401);
            }
            res.status(200).json(reservaCancelada);
        }
        catch (error) {
            return (0, handleError_1.handleHttpError)(res, "Error al solicitar cancelacion", 500);
        }
    });
}
function obtenerReserva(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (0, express_validator_1.matchedData)(req);
            let reserva = undefined;
            if (data.tipo == 'hospedaje') {
                const reservaExistente = yield prisma.reservas_hospedajes.findUnique({
                    where: { idReserva: String(data.id) }
                });
                if (!reservaExistente) {
                    return (0, handleError_1.handleHttpError)(res, "ID de reserva no encontrada", 404);
                }
                reserva = yield prisma.reservas_hospedajes.findUnique({
                    where: { idReserva: String(data.id) }
                });
            }
            else {
                const reservaExistente = yield prisma.reservas_actividades.findUnique({
                    where: { idReserva: String(data.id) }
                });
                if (!reservaExistente) {
                    return (0, handleError_1.handleHttpError)(res, "ID de reserva no encontrada", 404);
                }
                reserva = yield prisma.reservas_actividades.findUnique({
                    where: { idReserva: String(data.id) }
                });
            }
            res.status(200).json(reserva);
        }
        catch (error) {
            return (0, handleError_1.handleHttpError)(res, "Error al obtener reserva", 500);
        }
    });
}
function obtenerReservasUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (0, express_validator_1.matchedData)(req);
            let reservasUsuario = undefined;
            if (req.user.idUsuario !== data.id) {
                (0, handleError_1.handleHttpError)(res, "No tienes permiso para ver esta reserva", 401);
                return;
            }
            if (data.tipo == 'hospedaje') {
                reservasUsuario = yield prisma.reservas_hospedajes.findMany({
                    where: {
                        idUsuario: "7ddf98bc-a317-11f0-85e5-9c6b0080d542"
                    },
                    include: {
                        hospedaje: {
                            select: {
                                titulo: true,
                                descripcion: true,
                                ciudad: true,
                                fotos: {
                                    orderBy: { sort: "asc" },
                                    take: 1
                                }
                            }
                        },
                        habitaciones: {
                            select: {
                                numero: true,
                                tipo: true,
                                capacidad: true,
                                precio: true
                            }
                        }
                    }
                });
            }
            else {
                reservasUsuario = yield prisma.reservas_actividades.findMany({
                    where: {
                        idUsuario: data.id,
                    },
                    include: {
                        actividades: {
                            select: {
                                nombre: true,
                                descripcion: true,
                                ciudad: true,
                                imagen: true,
                                precio: true
                            },
                        },
                    },
                });
            }
            res.status(200).json(reservasUsuario);
        }
        catch (error) {
            console.log(error);
            return (0, handleError_1.handleHttpError)(res, "Error al obtener reservas", 500);
        }
    });
}
function obtenerFechasOcupadas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = (0, express_validator_1.matchedData)(req);
            let fechasOcupadas = undefined;
            if (data.tipo == 'hospedaje') {
                fechasOcupadas = yield prisma.reservas_hospedajes.findMany({
                    where: {
                        idHospedaje: data.id,
                    },
                    select: {
                        fechaInicio: true,
                        fechaFin: true,
                    },
                });
            }
            else {
                fechasOcupadas = yield prisma.reservas_actividades.findMany({
                    where: {
                        idActividad: data.id,
                    },
                    select: {
                        fecha: true,
                    },
                });
            }
            if (!fechasOcupadas || fechasOcupadas.length === 0) {
                res.status(404).json({ error: 'No hay reservas para este hospedaje' });
                return;
            }
            res.status(200).json(fechasOcupadas);
        }
        catch (error) {
            return (0, handleError_1.handleHttpError)(res, "Error al obtener reservas del hospedaje", 500);
        }
    });
}
function reservarActividad(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataReserva = (0, express_validator_1.matchedData)(req);
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Crear reserva
                const nuevaReserva = yield tx.reservas_actividades.create({
                    data: {
                        idUsuario: String(dataReserva.idUsuario),
                        idActividad: String(dataReserva.idActividad),
                        fecha: new Date(dataReserva.fecha),
                        personas: Number(dataReserva.personas),
                        precioTotal: Number(dataReserva.precioTotal),
                        estado: "pendiente"
                    }
                });
                const nuevoPago = yield tx.pagos_actividades.create({
                    data: {
                        idUsuario: dataReserva.idUsuario,
                        nombre: dataReserva.nombre,
                        apellido: dataReserva.apellido,
                        dni: dataReserva.dni,
                        direccion: dataReserva.direccion,
                        email: dataReserva.email,
                        telefono: dataReserva.telefono,
                        monto: Number(dataReserva.precioTotal),
                        idPreferencia: dataReserva.idPreferencia,
                        estado: prisma_1.pagos_actividades_estado.pendiente,
                        reservas_actividades: { connect: { idReserva: nuevaReserva.idReserva } }
                    }
                });
                return { nuevaReserva, nuevoPago };
            }));
            return res.status(201).json(result);
        }
        catch (error) {
            console.log(error);
            return (0, handleError_1.handleHttpError)(res, "Error al reservar actividad", 500);
        }
    });
}
function verificarPagoHospedaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { IdPreferencia } = req.body;
            // Verificar pago
            const pago = yield prisma.pagos_hospedajes.findFirst({
                where: { idPreferencia: IdPreferencia },
                select: { estado: true, idPago: true, idReserva: true, idUsuario: true },
            });
            if (!pago || pago.estado !== 'aprobado') {
                return res.status(404).json({ error: 'Pago no aprobado o no encontrado' });
            }
            // Detalles de la reserva
            const detalles = yield prisma.reservas_hospedajes.findMany({
                where: { idReserva: pago.idReserva },
                include: {
                    usuario: { select: { nombre: true, apellido: true } },
                    hospedaje: { select: { titulo: true } },
                    habitaciones: { select: { numero: true, tipo: true } },
                },
            });
            if (!detalles.length)
                return res.status(404).json({ error: 'Detalles no encontrados' });
            //enviarNotificacion(detalles);
            res.status(200).json({ estado: 'aprobado', detalles });
        }
        catch (error) {
            console.log(error);
            return (0, handleError_1.handleHttpError)(res, "Error al reservar actividad", 500);
        }
    });
}
function verificarPagoActividad(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { IdPreferencia } = req.body;
            // Verificar pago
            const pago = yield prisma.pagos_actividades.findFirst({
                where: { idPreferencia: IdPreferencia },
                select: { estado: true, idPago: true, idReserva: true, idUsuario: true },
            });
            if (!pago || pago.estado !== 'aprobado') {
                return res.status(404).json({ error: 'Pago no aprobado o no encontrado' });
            }
            // Detalles de la reserva
            const detalles = yield prisma.reservas_actividades.findMany({
                where: { idReserva: pago.idReserva },
                include: {
                    usuario: { select: { nombre: true, apellido: true } },
                    actividades: { select: { nombre: true } },
                },
            });
            if (!detalles.length)
                return res.status(404).json({ error: 'Detalles no encontrados' });
            //enviarNotificacion(detalles);
            res.json({ estado: 'aprobado', detalles });
        }
        catch (error) {
            console.log(error);
            return (0, handleError_1.handleHttpError)(res, "Error al reservar actividad", 500);
        }
    });
}
// Extras
function enviarNotificacion(datosRecibidos) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!datosRecibidos.length)
            return;
        const datos = datosRecibidos[0];
        if (datos == undefined)
            return;
        const subject = `Nueva Reserva de ${datos.TipoReserva} recibida | Id: ${datos.IdPago}`;
        const detalleReserva = datos.TipoReserva === "Hospedaje"
            ? `<p><strong>Nombre:</strong> ${datos.NombreUsuario} ${datos.ApellidoUsuario}</p>
       <p><strong>Hospedaje:</strong> ${datos.NombreHospedaje}</p>
       <p><strong>Habitación:</strong> ${datos.NroHabitacion} - (${datos.TipoHabitacion})</p>
       <p><strong>Personas:</strong> ${datos.Personas}</p>
       <p><strong>Fecha de Ingreso:</strong> ${datos.FechaInicio}</p>
       <p><strong>Fecha de Salida:</strong> ${datos.FechaFin}</p>`
            : `<p><strong>Nombre:</strong> ${datos.NombreUsuario} ${datos.ApellidoUsuario}</p>
       <p><strong>Actividad:</strong> ${datos.NombreActividad}</p>
       <p><strong>Fecha:</strong> ${datos.FechaActividad}</p>
       <p><strong>Personas:</strong> ${datos.Personas}</p>`;
        const detallesPago = `
    <p><strong>Nombre completo:</strong> ${datos.Nombre} ${datos.Apellido}</p>
    <p><strong>DNI:</strong> ${datos.Dni}</p>
    <p><strong>Dirección:</strong> ${datos.Direccion}</p>
    <p><strong>Email:</strong> ${datos.Email}</p>
    <p><strong>Teléfono:</strong> ${datos.Telefono}</p>
    <p><strong>Monto:</strong> ${datos.Monto}</p>
    <p><strong>Fecha de Pago:</strong> ${(_a = datos.FechaPago) !== null && _a !== void 0 ? _a : "No especificada"}</p>
  `;
        const message = `
    <html>
    <head>
      <style>
        body {font-family: Arial, sans-serif; background-color: #f4f7fa; margin:0; padding:0;}
        .email-container {width:100%; max-width:600px; margin:20px auto; background:#fff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;}
        .header {background-color:#6CADE7; color:white; text-align:center; padding:20px;}
        .body {padding:20px; text-align:center;}
        .footer {background:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#777;}
        hr {margin: 20px 0;}
      </style>
    </head>
    <body>
      <div class='email-container'>
        <div class='header'>
          <img src='https://vamos.fullbusiness.io/assets/vamos-logo.png' alt='Vamos Logo' width='150'/>
        </div>
        <div class='body'>
          <h2>Detalles de la Reserva</h2>
          ${detalleReserva}
          <hr>
          <h2>Detalles del pago</h2>
          ${detallesPago}
        </div>
        <div class='footer'>
          <p>Reserva Exitosa</p>
        </div>
      </div>
    </body>
    </html>
  `;
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        yield transporter.sendMail({
            from: '"Soporte Vamos" <no-reply@vamos.fullbusiness.io>',
            to: "rivenpiola22@gmail.com",
            subject,
            html: message,
        });
    });
}
//# sourceMappingURL=reserva.js.map