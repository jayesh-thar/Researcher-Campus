import mongoose from 'mongoose';

export async function connectDB(): Promise<typeof mongoose> {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/researcher_campus';
  
  try {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };
    
    const conn = await mongoose.connect(mongoURI, opts);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Database connection error:', error);
    process.exit(1);
  }
}
