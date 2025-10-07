import express from "express";
const router = express.Router();
import { Request, Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
const mpPayment = new Payment(client);

router.post("/webhook", async (req: Request, res:Response) => {
  const { data } = req.body;
  if (!data?.id) return res.sendStatus(400);

  try {
    const pago = await mpPayment.get({ id: data.id });
    const status = pago.status;
    const idReserva = pago.external_reference;

    if (status === "approved") {
      await prisma.reservas_hospedajes.update({
        where: { idReserva: String(idReserva) },
        data: { estado: "pendiente" },
      });
    }

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export { router };
