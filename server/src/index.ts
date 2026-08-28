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
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for academic workstation access
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/literature', literatureRoutes);
app.use('/api', literatureRoutes);
app.use('/api', roadmapRoutes);
app.use('/api', driveRoutes);
app.use('/api', auditRoutes);
app.use('/api', venueRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Researcher Campus Express API operational' });
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`⚡ Researcher Campus Express Server running on port ${PORT}`);
  });
});
