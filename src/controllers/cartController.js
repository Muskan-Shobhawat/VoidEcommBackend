import products from '../data/products.js';
import { HttpError } from '../middleware/error.js';

const FREE_SHIPPING_THRESHOLD = 2999;
const SHIPPING_FLAT = 149;
const TAX_RATE = 0.12; // GST on apparel

/**
 * Stateless cart pricing: the client sends line items, server validates
 * them against the catalogue and returns authoritative totals.
 */
export function priceCart(items = []) {
  if (!Array.isArray(items)) throw new HttpError(400, 'items must be an array');

  const lines = items.map((line) => {
    const product = products.find((p) => p.id === line.productId || p.slug === line.productId);
    if (!product) throw new HttpError(400, `Unknown product: ${line.productId}`);
    const qty = Math.max(1, Math.min(10, Number(line.quantity) || 1));
    if (line.size && !product.sizes.includes(line.size))
      throw new HttpError(400, `Size ${line.size} not available for ${product.name}`);
    const color = product.colors.find((c) => c.name === line.color) || product.colors[0];
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      palette: product.palette,
      price: product.price,
      quantity: qty,
      size: line.size || product.sizes[0],
      color: color.name,
      colorHex: color.hex,
      lineTotal: +(product.price * qty).toFixed(2),
    };
  });

  const subtotal = +lines.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = +(subtotal + shipping + tax).toFixed(2);

  return {
    lines,
    summary: {
      subtotal,
      shipping,
      tax,
      total,
      currency: 'INR',
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      itemCount: lines.reduce((s, l) => s + l.quantity, 0),
    },
  };
}

export function postCart(req, res) {
  res.json(priceCart(req.body.items));
}
