import mongoose from 'mongoose';

export async function connectDB(): Promise<typeof mongoose | null> {
  const primaryURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/researcher_campus';
  const fallbackURI = 'mongodb://127.0.0.1:27017/researcher_campus';

  const opts: mongoose.ConnectOptions = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  };

  try {
    const conn = await mongoose.connect(primaryURI, opts);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.warn(`[MongoDB] Primary database connection failed (${error?.message || error}). Attempting fallback connection...`);

    if (primaryURI !== fallbackURI) {
      try {
        const fallbackConn = await mongoose.connect(fallbackURI, opts);
        console.log(`[MongoDB] Connected successfully to fallback local database: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackErr: any) {
        console.warn(`[MongoDB] Fallback database connection failed (${fallbackErr?.message || fallbackErr}). API server running in in-memory mode.`);
        return null;
      }
    }

    console.warn('[MongoDB] Database connection omitted. API server running in standalone mode.');
    return null;
  }
}
