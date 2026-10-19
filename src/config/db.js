import mongoose from 'mongoose';

/**
 * Connects to MongoDB only when MONGODB_URI is set.
 * In demo mode (no URI) the API serves the in-memory sample data in src/data.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return 'in-memory sample data (set MONGODB_URI to use MongoDB)';
  try {
    await mongoose.connect(uri);
    return `MongoDB (${mongoose.connection.name})`;
  } catch (err) {
    console.error('MongoDB connection failed, falling back to sample data:', err.message);
    return 'in-memory sample data (MongoDB connection failed)';
  }
}

export const usingMongo = () => mongoose.connection.readyState === 1;
