# VOID. — demo e-commerce backend

Node + Express API serving an in-memory sample catalogue (men's & women's clothing).
Product `images` are paths served by the frontend (`/products/<slug>-3d.jpg`, a still render of the product's 3D model).
Every product has a `model` object (`src`, `tint`, `credit`) for its 3D viewer; `model.src` is served by the frontend from `/models/`.
MongoDB is **optional**: set `MONGODB_URI` in `.env` later and run `npm run seed` to migrate to a real DB.

## Run

```bash
npm install
npm run dev        # http://localhost:5001  (5000 is used by macOS AirPlay)
```

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | liveness |
| GET | `/api/products` | `?gender=men|women&category=tees,hoodies&search=&sort=featured|newest|price-asc|price-desc|rating&minPrice=&maxPrice=&featured=true&isNew=true&tag=&page=&limit=` |
| GET | `/api/products/:slug` | single product |
| GET | `/api/products/:slug/related` | 4 related products |
| GET | `/api/categories?gender=` | categories with counts |
| GET | `/api/categories/collections` | men / women collections |
| GET | `/api/lookbook` | editorial tiles for the home page |
| POST | `/api/cart` | `{ items: [{ productId, quantity, size, color }] }` → priced lines + totals |
| POST | `/api/orders` | `{ items, customer: { name, email }, shippingAddress }` → order (in memory); with a bearer token it is saved to that account |
| GET | `/api/orders` | 🔒 the signed-in user's order history, newest first |
| GET | `/api/orders/:id` | fetch an order (account orders only for their owner) |
| POST | `/api/auth/signup` | `{ name, email, password }` → `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | 🔒 current user |
| POST | `/api/auth/logout` | 🔒 ends the session |
| POST | `/api/newsletter` | `{ email }` |

🔒 = needs `Authorization: Bearer <token>`. Accounts and sessions live in memory (passwords hashed with scrypt) and reset on restart.
A demo account is seeded on start with two past orders: **demo@void.shop / void1234**.
`CLIENT_ORIGIN` must include the frontend's origin (e.g. `http://localhost:3001`) for browser calls such as login.

## Deploy (Render)

1. Render → **New + → Blueprint** → connect `VoidEcommBackend`. `render.yaml` sets up a free Node web service (`npm ci` / `npm start`, health check `/api/health`).
2. When asked, set `CLIENT_ORIGIN` to the Vercel URL(s), e.g. `https://void-ecomm-frontend.vercel.app,https://void-ecomm-frontend-*.vercel.app`. Leave `MONGODB_URI` empty for the demo data.
3. The API is then at `https://<service>.onrender.com/api` — use that as the frontend's `NEXT_PUBLIC_API_URL`.

Free instances sleep after ~15 min idle and take ~30–60 s to wake; the in-memory accounts and orders reset whenever it sleeps or redeploys (the demo account is recreated). The frontend pings `/api/health` on load to start waking it and falls back to its bundled data meanwhile.
