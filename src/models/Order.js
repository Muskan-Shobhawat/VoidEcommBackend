import mongoose from 'mongoose';

const LineSchema = new mongoose.Schema(
  {
    productId: String,
    slug: String,
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
    lineTotal: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['confirmed', 'shipped', 'delivered', 'cancelled'], default: 'confirmed' },
    customer: { name: String, email: String, phone: String },
    shippingAddress: { line1: String, line2: String, city: String, state: String, postalCode: String, country: String },
    lines: [LineSchema],
    summary: { subtotal: Number, shipping: Number, tax: Number, total: Number, currency: String, itemCount: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
