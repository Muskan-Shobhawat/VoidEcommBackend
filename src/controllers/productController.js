import products from '../data/products.js';
import { HttpError } from '../middleware/error.js';

const SORTS = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || b.reviews - a.reviews,
  newest: (a, b) => Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export function listProducts(req, res) {
  const {
    gender,
    category,
    search,
    sort = 'featured',
    minPrice,
    maxPrice,
    featured,
    isNew,
    tag,
    page = 1,
    limit = 24,
  } = req.query;

  let items = [...products];

  if (gender && gender !== 'all') items = items.filter((p) => p.gender === gender);
  if (category && category !== 'all') {
    const cats = String(category).split(',');
    items = items.filter((p) => cats.includes(p.category));
  }
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));
  if (featured === 'true') items = items.filter((p) => p.featured);
  if (isNew === 'true') items = items.filter((p) => p.isNew);
  if (tag) items = items.filter((p) => p.tags.includes(tag));

  items.sort(SORTS[sort] || SORTS.featured);

  const total = items.length;
  const pageNum = Math.max(1, Number(page));
  const perPage = Math.min(100, Math.max(1, Number(limit)));
  const start = (pageNum - 1) * perPage;
  const data = items.slice(start, start + perPage);

  res.json({
    data,
    meta: { total, page: pageNum, limit: perPage, pages: Math.ceil(total / perPage) },
  });
}

export function getProduct(req, res) {
  const product = products.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!product) throw new HttpError(404, 'Product not found');
  res.json(product);
}

export function getRelated(req, res) {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) throw new HttpError(404, 'Product not found');
  const related = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1))
    .slice(0, 4);
  res.json(related);
}
