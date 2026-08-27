import { Router, Request, Response } from 'express';
import { reformulateIdea, chatWithAiAssistant, auditPaperWithHumanization } from '../services/geminiService';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';

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

// POST /api/ai/chat - Interactive AI Research Assistant Co-Pilot
router.post('/chat', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { instruction, context } = req.body;

    if (!instruction) {
      return res.status(400).json({ error: 'instruction is required' });
    }

    const result = await chatWithAiAssistant(instruction, context || {
      projectTitle: 'Research Project',
      methodology: 'Proposed Methodology',
      currentStage: 4
    });

    return res.json(result);
  } catch (error) {
    console.error('AI chat route error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/ai/audit - Full Pre-Flight Audit with Humanization
router.post('/audit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { markdownContent, academicTitle } = req.body;

    if (!markdownContent) {
      return res.status(400).json({ error: 'markdownContent is required' });
    }

    const auditResult = await auditPaperWithHumanization(
      markdownContent,
      academicTitle || 'Academic Manuscript'
    );

    return res.json({ audit: auditResult });
  } catch (error) {
    console.error('AI audit route error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
