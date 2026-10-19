import { priceCart } from './cartController.js';
import { createUser } from './authController.js';
import { HttpError } from '../middleware/error.js';

// In-memory order store for the demo.
const orders = new Map();

const genId = () => 'VD-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export function createOrder(req, res) {
  const { items, customer = {}, shippingAddress = {} } = req.body || {};
  if (!items?.length) throw new HttpError(400, 'Cart is empty');
  if (!customer.email) throw new HttpError(400, 'customer.email is required');

  const priced = priceCart(items);
  const order = {
    id: genId(),
    userId: req.user?.id ?? null, // signed-in orders show up in that account's history
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    customer,
    shippingAddress,
    ...priced,
    estimatedDelivery: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10),
  };
  orders.set(order.id, order);
  res.status(201).json(order);
}

export function getOrder(req, res) {
  const order = orders.get(req.params.id);
  // Account orders are private to their owner; guest orders are reachable by id (confirmation page).
  if (!order || (order.userId && order.userId !== req.user?.id)) throw new HttpError(404, 'Order not found');
  res.json(order);
}

/** Order history for the signed-in user (route requires auth). */
export function listOrders(req, res) {
  const mine = [...orders.values()].filter((o) => o.userId === req.user.id);
  res.json(mine.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

/* Demo account with a little history, so the account view has something to show out of the box. */
export const DEMO_ACCOUNT = { name: 'Demo Shopper', email: 'demo@void.shop', password: 'void1234' };

(function seedDemoAccount() {
  const user = createUser(DEMO_ACCOUNT);
  const address = { line1: '12 Orbit Lane', city: 'Brooklyn', state: 'NY', postalCode: '11201', country: 'United States' };
  const past = [
    { daysAgo: 24, status: 'delivered', items: [{ productId: 'p-002', quantity: 1, size: 'L' }, { productId: 'p-001', quantity: 2, size: 'M', color: 'Void Black' }] },
    { daysAgo: 3, status: 'shipped', items: [{ productId: 'p-007', quantity: 1, size: 'M' }] },
  ];
  for (const { daysAgo, status, items } of past) {
    const createdAt = new Date(Date.now() - daysAgo * 864e5);
    const order = {
      id: genId(),
      userId: user.id,
      status,
      createdAt: createdAt.toISOString(),
      customer: { name: user.name, email: user.email },
      shippingAddress: address,
      ...priceCart(items),
      estimatedDelivery: new Date(createdAt.getTime() + 5 * 864e5).toISOString().slice(0, 10),
    };
    orders.set(order.id, order);
  }
})();
