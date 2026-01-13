import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener choferes' });
  }
};

export const createDriver = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, license, phone } = req.body;
    
    // Validación simple
    if (!firstName || !lastName || !license) {
      return res.status(400).json({ error: 'Faltan nombre, apellido o licencia' });
    }

    const newDriver = await prisma.driver.create({
      data: { firstName, lastName, license, phone }
    });
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear chofer (¿Licencia duplicada?)' });
  }
};