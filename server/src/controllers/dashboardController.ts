import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // <--- CAMBIO AQUÍ

const prisma = new PrismaClient(); // <--- CAMBIO AQUÍ

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [vehiclesCount, driversCount, routesCount, pendingDeliveries] = await Promise.all([
      prisma.vehicle.count(),
      prisma.driver.count(),
      prisma.route.count({ where: { status: 'PLANNING' } }), 
      prisma.delivery.count({ where: { status: 'PENDING' } }) 
    ]);

    res.json({
      vehicles: vehiclesCount,
      drivers: driversCount,
      activeRoutes: routesCount,
      pendingDeliveries: pendingDeliveries
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
};