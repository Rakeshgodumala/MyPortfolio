import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to backend/.env (see .env.example).');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
