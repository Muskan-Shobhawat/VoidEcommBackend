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

// Comma-separated origins; `*` is a wildcard, e.g. https://void-ecomm-*.vercel.app for Vercel preview deploys.
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
  .map((o) => (o.includes('*') ? new RegExp(`^${o.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[a-z0-9-]*')}$`) : o));

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(attachUser);

// The API lives under /api; the bare root just says so instead of returning a 404.
app.get('/', (_req, res) =>
  res.json({ service: 'VOID. demo API', status: 'ok', health: '/api/health', products: '/api/products' })
);

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
