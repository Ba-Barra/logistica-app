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

// 3. Obtener UNA ruta por su ID (Para la pantalla de detalles)
export const getRouteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Capturamos el número de la URL (ej: /api/routes/5)
    
const route = await prisma.route.findUnique({
      where: { id: Number(id) },
      include: {
        driver: true,
        vehicle: true,
        deliveries: {        // <--- NUEVO BLOQUE
          include: {
            client: true     // <--- Traer nombre y dirección del cliente
          }
        }
      }
    });

    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la ruta' });
  }
};

// 4. Agregar una entrega a la ruta
export const addDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID de la Ruta (viene de la URL)
    const { clientId } = req.body; // ID del Cliente (viene del formulario)

    const newDelivery = await prisma.delivery.create({
      data: {
        routeId: Number(id),
        clientId: Number(clientId),
        status: 'PENDING' // Estado inicial: Pendiente
      },
      include: {
        client: true // Devolvemos el dato completo para actualizar la pantalla al instante
      }
    });

    res.json(newDelivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar la entrega' });
  }
};

// 5. Actualizar el estado de una entrega (De PENDING a DELIVERED)
export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID de la ENTREGA (no de la ruta)
    const { status } = req.body; // Nuevo estado

    const updatedDelivery = await prisma.delivery.update({
      where: { id: Number(id) },
      data: { status: status },
      include: { client: true } // Devolvemos el cliente para actualizar la UI
    });

    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};