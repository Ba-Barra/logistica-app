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
    // 1. Extraemos también phone, latitude y longitude
    const { companyName, address, phone, latitude, longitude } = req.body;

    if (!companyName || !address) {
      return res.status(400).json({ error: 'Faltan nombre de empresa o dirección' });
    }

    const newClient = await prisma.client.create({
      data: { 
        companyName, 
        address,
        phone, // Guardamos el teléfono
        // 2. Convertimos las coordenadas a números decimales (Float)
        // Si no vienen, usamos el valor por defecto de Santiago
        latitude: latitude ? parseFloat(latitude) : -33.4489,
        longitude: longitude ? parseFloat(longitude) : -70.6693
      }
    });
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error); // Agregamos esto para ver errores en la terminal si ocurren
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};