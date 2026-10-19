import { Router } from 'express';
import { listProducts, getProduct, getRelated } from '../controllers/productController.js';

const router = Router();
router.get('/', listProducts);
router.get('/:slug', getProduct);
router.get('/:slug/related', getRelated);
export default router;
