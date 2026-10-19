import { Router } from 'express';
import { HttpError } from '../middleware/error.js';

const router = Router();
const subscribers = new Set();

router.post('/newsletter', (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new HttpError(400, 'Valid email required');
  subscribers.add(email.toLowerCase());
  res.status(201).json({ ok: true, message: 'You are on the list.' });
});

router.get('/lookbook', (_req, res) => {
  res.json([
    { id: 'lb-1', title: 'ZERO GRAVITY', subtitle: 'FW26 Outerwear', palette: ['#0b0b0f', '#6f7cff'], link: '/shop?category=jackets', images: ['/products/monolith-leather-jacket-3d.jpg', '/products/axis-moto-jacket-3d.jpg', '/products/rider-leather-jacket-3d.jpg'] },
    { id: 'lb-2', title: 'REFRACTION', subtitle: 'Women SS26', palette: ['#1b1030', '#9fe8ff'], link: '/shop?gender=women', images: ['/products/lilac-flare-dress-3d.jpg', '/products/aurora-slip-dress-3d.jpg', '/products/emerald-tea-dress-3d.jpg'] },
    { id: 'lb-3', title: 'HEAVYWEIGHT', subtitle: 'Core Basics', palette: ['#1b1b24', '#ff5a1f'], link: '/shop?category=tees', images: ['/products/eclipse-heavy-tee-3d.jpg', '/products/orbit-oversized-tee-3d.jpg', '/products/signal-boxy-tee-3d.jpg'] },
  ]);
});

export default router;
