import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Obtener todas las rutas (con datos de chofer y camión)
export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany({
      include: {
        driver: true,  // <--- ¡MAGIA! Trae los datos del chofer
        vehicle: true, // <--- ¡MAGIA! Trae los datos del camión
        deliveries: true // También las entregas si las hubiera
      },
      orderBy: {
        scheduledDate: 'desc' // Las más recientes primero
      }
    });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las rutas' });
  }
};

// 2. Crear una nueva ruta
export const createRoute = async (req: Request, res: Response) => {
  try {
    const { driverId, vehicleId, scheduledDate } = req.body;

    // Validaciones básicas
    if (!driverId || !vehicleId || !scheduledDate) {
      return res.status(400).json({ error: 'Faltan datos (chofer, vehículo o fecha)' });
    }

    const newRoute = await prisma.route.create({
      data: {
        driverId: Number(driverId),
        vehicleId: Number(vehicleId),
        scheduledDate: new Date(scheduledDate), // Convertimos texto a fecha real
        status: 'PLANNING'
      },
      include: {
        driver: true,
        vehicle: true
      }
    });

    res.status(201).json(newRoute);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la ruta' });
  }
};