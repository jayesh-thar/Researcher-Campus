import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// GET /api/project/:id/roadmap
router.get('/project/:id/roadmap', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({
      roadmap: project.roadmap,
      readinessPercent: calculateReadiness(project.roadmap?.checklist || [])
    });
  } catch (error) {
    console.error('Fetch roadmap error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/project/:id/roadmap/checklist
router.patch('/project/:id/roadmap/checklist', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { taskId, isCompleted, userNotes } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const taskIndex = project.roadmap.checklist.findIndex((t: any) => t.id === taskId);
    if (taskIndex !== -1) {
      if (typeof isCompleted === 'boolean') {
        project.roadmap.checklist[taskIndex].isCompleted = isCompleted;
      }
      if (userNotes !== undefined) {
        project.roadmap.checklist[taskIndex].userNotes = userNotes;
      }
      project.markModified('roadmap');
      await project.save();
    }

    return res.json({
      roadmap: project.roadmap,
      readinessPercent: calculateReadiness(project.roadmap.checklist)
    });
  } catch (error) {
    console.error('Update checklist error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/project/:id/roadmap/task
router.post('/project/:id/roadmap/task', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { action, taskText, phase, prompt } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Action A: Add Custom Task Manually
    if (action === 'ADD_MANUAL' && taskText) {
      project.roadmap.checklist.push({
        id: `t-${Date.now()}`,
        phase: phase || 'DEVELOPMENT',
        task: taskText,
        isCompleted: false
      });
      project.markModified('roadmap');
      await project.save();
      return res.json({ roadmap: project.roadmap, readinessPercent: calculateReadiness(project.roadmap.checklist) });
    }

    // Action B: AI Generated Tasks via Gemini
    if (action === 'GENERATE_AI' && prompt) {
      let aiGeneratedTasks: Array<{ phase: 'ENVIRONMENT' | 'DEVELOPMENT' | 'EVALUATION' | 'SYNTHESIS'; task: string }> = [];

      if (genAI && apiKey && apiKey !== 'your_gemini_api_key_here') {
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
          const aiPrompt = `
You are a research workflow assistant. Generate 3 specific, actionable technical checklist tasks for a researcher working on:
Project: "${project.title}"
Instruction: "${prompt}"

Return strictly in JSON array format:
[
  { "phase": "DEVELOPMENT", "task": "Task description 1" },
  { "phase": "EVALUATION", "task": "Task description 2" },
  { "phase": "SYNTHESIS", "task": "Task description 3" }
]
`;
          const result = await model.generateContent(aiPrompt);
          const text = result.response.text();
          const match = text.match(/\[[\s\S]*\]/);
          if (match) {
            aiGeneratedTasks = JSON.parse(match[0]);
          }
        } catch (e) {
          console.error('Gemini task generation error:', e);
        }
      }

      // Fallback if AI fails or key not provided
      if (aiGeneratedTasks.length === 0) {
        aiGeneratedTasks = [
          { phase: 'DEVELOPMENT', task: `Execute security & input sanitization audit based on "${prompt}"` },
          { phase: 'EVALUATION', task: `Benchmark latency & peak RAM memory usage for "${prompt}"` },
          { phase: 'SYNTHESIS', task: `Document findings and trade-offs for "${prompt}"` }
        ];
      }

      aiGeneratedTasks.forEach((t) => {
        project.roadmap.checklist.push({
          id: `t-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          phase: t.phase,
          task: t.task,
          isCompleted: false
        });
      });

      project.markModified('roadmap');
      await project.save();
      return res.json({ roadmap: project.roadmap, readinessPercent: calculateReadiness(project.roadmap.checklist) });
    }

    return res.status(400).json({ error: 'Invalid action or missing parameters' });
  } catch (error) {
    console.error('Add roadmap task error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

function calculateReadiness(checklist: Array<{ isCompleted: boolean }>): number {
  if (!checklist || checklist.length === 0) return 0;
  const completed = checklist.filter((t) => t.isCompleted).length;
  return Math.round((completed / checklist.length) * 100);
}

export default router;
