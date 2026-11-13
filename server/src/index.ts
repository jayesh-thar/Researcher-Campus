import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import literatureRoutes from './routes/literatureRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import driveRoutes from './routes/driveRoutes';
import auditRoutes from './routes/auditRoutes';
import venueRoutes from './routes/venueRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Dynamic CORS Origin Resolver (Supports local dev, Vercel preview domains, and custom domains)
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('Blocked by CORS policy: Unauthorized Origin.'));
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Lightweight zero-dependency cookie parser middleware for secure sessions
app.use((req, _res, next) => {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts[0]?.trim();
      if (name) {
        list[name] = decodeURIComponent(parts.slice(1).join('=').trim());
      }
    });
  }
  (req as any).cookies = list;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', literatureRoutes);
app.use('/api', roadmapRoutes);
app.use('/api', driveRoutes);
app.use('/api', auditRoutes);
app.use('/api', venueRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Researcher Campus Express API operational' });
});

// 404 Catch-All for Unmatched API Routes
app.all('/api/*', (req, res) => {
  return res.status(404).json({
    error: 'API Endpoint Not Found',
    message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist on Researcher Campus server.`,
    timestamp: new Date().toISOString()
  });
});

// 404 Catch-All for Non-API Routes
app.use('*', (req, res) => {
  return res.status(404).json({
    error: 'Not Found',
    message: `Route '${req.originalUrl}' not recognized.`,
    timestamp: new Date().toISOString()
  });
});

// Centralized Production Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(`[Unhandled Server Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose Malformed ID Error
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid Identifier Format',
      message: `Invalid format for parameter '${err.path}'`
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  // JWT / Auth Errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid or expired token credentials'
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`⚡ Researcher Campus Express Server running on port ${PORT}`);
  });
});
