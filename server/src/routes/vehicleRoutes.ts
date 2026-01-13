import { Router } from 'express';
import { getVehicles, createVehicle } from '../controllers/vehicleController';

const router = Router();

// GET http://localhost:3001/api/vehicles
router.get('/', getVehicles);

// POST http://localhost:3001/api/vehicles
router.post('/', createVehicle);

export default router;