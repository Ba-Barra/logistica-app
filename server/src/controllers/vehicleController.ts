import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Obtener todos los vehículos
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
};

// 2. Crear un nuevo vehículo
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { plate, model, capacity } = req.body;

    // Validación básica
    if (!plate || !model || !capacity) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (patente, modelo, capacidad)' });
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        plate,
        model,
        capacity: Number(capacity), // Aseguramos que sea número
        status: 'ACTIVE'
      }
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    console.error(error); // Para ver el error en consola
    res.status(500).json({ error: 'Error al crear el vehículo (¿Quizás la patente ya existe?)' });
  }
};