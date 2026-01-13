import { Router } from 'express';
import { getRoutes, createRoute } from '../controllers/routeController';

const router = Router();

router.get('/', getRoutes);
router.post('/', createRoute);

export default router;