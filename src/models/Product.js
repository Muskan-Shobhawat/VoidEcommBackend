import mongoose from 'mongoose';

/** Mongoose schema — used once MONGODB_URI is configured and `npm run seed` has run. */
const ColorSchema = new mongoose.Schema({ name: String, hex: String }, { _id: false });

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    category: { type: String, required: true, index: true },
    images: [String],
    model: {
      src: String,
      tint: Boolean,
      colorway: String,
      credit: { title: String, author: String, url: String, license: String },
    },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    currency: { type: String, default: 'USD' },
    colors: [ColorSchema],
    palette: [String],
    sizes: [String],
    description: String,
    details: [String],
    tags: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
