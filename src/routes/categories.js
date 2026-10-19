import { Router } from 'express';
import categories, { collections } from '../data/categories.js';
import products from '../data/products.js';

const router = Router();

router.get('/', (req, res) => {
  const { gender } = req.query;
  const list = categories
    .filter((c) => !gender || gender === 'all' || c.genders.includes(gender))
    .map((c) => ({
      ...c,
      count: products.filter((p) => p.category === c.slug && (!gender || gender === 'all' || p.gender === gender)).length,
    }));
  res.json(list);
});

router.get('/collections', (_req, res) => {
  res.json(
    collections.map((c) => ({
      ...c,
      count: products.filter((p) => p.gender === c.slug).length,
      featured: products.filter((p) => p.gender === c.slug && p.featured).slice(0, 3),
    }))
  );
});

export default router;
