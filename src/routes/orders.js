import { Router } from 'express';
import { createOrder, getOrder, listOrders } from '../controllers/orderController.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();
router.get('/', requireUser, listOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
export default router;
