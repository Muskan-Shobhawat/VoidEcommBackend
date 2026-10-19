import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import miscRoutes from './routes/misc.js';
import authRoutes from './routes/auth.js';
import { attachUser } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(attachUser);

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: 'ecomm-demo-backend', time: new Date().toISOString() })
);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', miscRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
