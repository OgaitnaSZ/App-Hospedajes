import express from "express";
const router = express.Router();
import { Request, Response } from "express";
import { mpPreference } from "../lib/mercadopago";
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()


router.post("/crear-preferencia", async (req: Request, res: Response) => {
  try {
    const { idReserva } = req.body;

    const reserva = await prisma.reservas_hospedajes.findUnique({
      where: { idReserva: String(idReserva) },
      include: {
        habitaciones: true,
      },
    });

    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

    const dias =
      (new Date(reserva.fechaFin).getTime() -
        new Date(reserva.fechaInicio).getTime()) /
      (1000 * 60 * 60 * 24);

    const total = dias * Number(reserva.habitaciones.precio);

    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: reserva.idReserva,
            title: `Reserva ${reserva.idHospedaje}`,
            quantity: 1,
            unit_price: total,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: "localhost:4001/cuenta?pago=completado",
          failure: "localhost:4001/cuenta?pago=fallido",
          pending: "localhost:4001/cuenta?pago=pendiente",
        },
        auto_return: "approved",
        external_reference: String(reserva.idReserva),
        notification_url: "localhost:4001/api/mercadopagoWebhook/webhook",
      },
    });

    res.json({
      preferenceId: preference.id,
      init_point: preference.init_point,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

export { router };