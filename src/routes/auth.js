import { Router } from 'express';
import { login, logout, me, signup } from '../controllers/authController.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireUser, me);
router.post('/logout', requireUser, logout);
export default router;
