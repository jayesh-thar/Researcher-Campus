import { Router, Request, Response } from 'express';
import { reformulateIdea } from '../services/geminiService.js';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const router = Router();

// POST /api/ai/reformulate
router.post('/reformulate', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rawInput, userProfile } = req.body;

    if (!rawInput || typeof rawInput !== 'string') {
      return res.status(400).json({ error: 'rawInput string is required' });
    }

    const reformulation = await reformulateIdea(rawInput, userProfile);
    return res.json({ reformulation });
  } catch (error) {
    console.error('Reformulate route error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
