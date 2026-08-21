import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import literatureRoutes from './routes/literatureRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middlewares
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', system: 'Researcher Campus Express API Server', timestamp: new Date() });
});

// Mounting Routers
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/literature', literatureRoutes);
app.use('/api/project', literatureRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/project', roadmapRoutes);

// Bootstrap Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Express API Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
