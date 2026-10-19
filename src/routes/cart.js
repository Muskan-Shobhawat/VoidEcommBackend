import { Router } from 'express';
import { postCart } from '../controllers/cartController.js';

const router = Router();
router.post('/', postCart);
export default router;
