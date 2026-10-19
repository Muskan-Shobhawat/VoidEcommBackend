import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import products from '../data/products.js';

/** Seeds the sample catalogue into MongoDB. Requires MONGODB_URI. */
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set. Add it to .env to seed a database.');
  process.exit(1);
}
await mongoose.connect(uri);
await Product.deleteMany({});
await Product.insertMany(products.map(({ id, ...rest }) => rest));
console.log(`Seeded ${products.length} products into ${mongoose.connection.name}`);
await mongoose.disconnect();
