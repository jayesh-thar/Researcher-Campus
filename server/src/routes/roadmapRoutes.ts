import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { generateDynamicRoadmap, chatWithAiAssistant } from '../services/geminiService';

const router = Router();

// GET /api/project/:id/roadmap
router.get('/project/:id/roadmap', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Auto-generate dynamic roadmap if not initialized or has generic placeholder
    if (!project.roadmap?.datasets || project.roadmap.datasets.length === 0) {
      const dynamic = await generateDynamicRoadmap(
        project.academicTitle || project.title || 'Research Project',
        project.methodologyOverview || 'Proposed Methodology'
      );

      const checklist = dynamic.milestones.flatMap((m) =>
        m.tasks.map((taskStr, idx) => ({
          id: `t-${m.phase.toLowerCase()}-${idx + 1}`,
          phase: m.phase,
          task: taskStr,
          isCompleted: false
        }))
      );

      project.roadmap = {
        datasets: dynamic.datasets,
        tools: dynamic.tools,
        checklist
      };
      project.markModified('roadmap');
      await project.save();
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

    // Action B: AI Generated Tasks via Gemini Assistant
    if (action === 'GENERATE_AI' && prompt) {
      const assistant = await chatWithAiAssistant(prompt, {
        projectTitle: project.academicTitle || project.title,
        methodology: project.methodologyOverview || '',
        currentStage: 4,
        existingTasks: project.roadmap.checklist.map((t: any) => t.task)
      });

      const newTasks = (assistant.suggestedTasks || [prompt]).map((tStr) => ({
        id: `t-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        phase: (phase || 'DEVELOPMENT') as 'ENVIRONMENT' | 'DEVELOPMENT' | 'EVALUATION' | 'SYNTHESIS',
        task: tStr,
        isCompleted: false
      }));

      newTasks.forEach((t) => project.roadmap.checklist.push(t));

      project.markModified('roadmap');
      await project.save();
      return res.json({
        roadmap: project.roadmap,
        readinessPercent: calculateReadiness(project.roadmap.checklist),
        aiReply: assistant.reply
      });
    }

    return res.status(400).json({ error: 'Invalid action or missing parameters' });
  } catch (error) {
    console.error('Add roadmap task error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/project/:id/roadmap/task/:taskId - Delete or undo task
router.delete('/project/:id/roadmap/task/:taskId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, taskId } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.roadmap.checklist = project.roadmap.checklist.filter((t: any) => t.id !== taskId);
    project.markModified('roadmap');
    await project.save();

    return res.json({
      roadmap: project.roadmap,
      readinessPercent: calculateReadiness(project.roadmap.checklist)
    });
  } catch (error) {
    console.error('Delete roadmap task error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

function calculateReadiness(checklist: Array<{ isCompleted: boolean }>): number {
  if (!checklist || checklist.length === 0) return 0;
  const completed = checklist.filter((t) => t.isCompleted).length;
  return Math.round((completed / checklist.length) * 100);
}

export default router;
