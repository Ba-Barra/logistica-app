import { Router } from 'express';
import { getRoutes, createRoute, getRouteById, addDelivery, updateDeliveryStatus } from '../controllers/routeController';

const router = Router();

router.get('/', getRoutes);
router.post('/', createRoute);
router.get('/:id', getRouteById);
router.post('/:id/deliveries', addDelivery);
router.patch('/deliveries/:id', updateDeliveryStatus);

export default router;