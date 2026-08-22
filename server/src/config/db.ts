import mongoose from 'mongoose';

export async function connectDB(): Promise<typeof mongoose | null> {
  const primaryURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/researcher_campus';
  const fallbackURI = 'mongodb://127.0.0.1:27017/researcher_campus';

  const opts: mongoose.ConnectOptions = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  };

  // If primary URI has placeholder credentials, directly use local MongoDB to avoid auth warning
  if (primaryURI.includes('xxxx') || primaryURI.includes('<password>')) {
    try {
      const conn = await mongoose.connect(fallbackURI, opts);
      console.log(`[MongoDB] Connected successfully to local database: ${conn.connection.host}`);
      return conn;
    } catch {
      console.log('[MongoDB] Running Express API server in standalone mode.');
      return null;
    }
  }

  try {
    const conn = await mongoose.connect(primaryURI, opts);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.log(`[MongoDB] Primary database notice: ${error?.message || 'Connecting to local database...'}`);

    if (primaryURI !== fallbackURI) {
      try {
        const fallbackConn = await mongoose.connect(fallbackURI, opts);
        console.log(`[MongoDB] Connected successfully to local database: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch {
        console.log('[MongoDB] API server running in standalone mode.');
        return null;
      }
    }

    return null;
  }
}
