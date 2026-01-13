import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { companyName, address } = req.body;

    if (!companyName || !address) {
      return res.status(400).json({ error: 'Faltan nombre de empresa o dirección' });
    }

    const newClient = await prisma.client.create({
      data: { companyName, address }
    });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};