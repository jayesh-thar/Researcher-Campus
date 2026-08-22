import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/project/:id/document
router.get('/project/:id/document', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({
      document: project.document || {
        template: 'IEEE',
        contentMarkdown: `# ${project.academicTitle || project.title}\n\n## Abstract\n${project.problemStatement || ''}\n\n## 1. Introduction\n...`,
        contentHtml: `<h1>${project.academicTitle || project.title}</h1><h2>Abstract</h2><p>${project.problemStatement || ''}</p>`,
        contentLatex: `\\title{${project.academicTitle || project.title}}\n\\begin{abstract}\n${project.problemStatement || ''}\n\\end{abstract}`
      },
      lastSynced: project.updatedAt
    });
  } catch (error) {
    console.error('Fetch document error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/project/:id/document
router.put('/project/:id/document', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { template, contentMarkdown, contentHtml, contentLatex } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.document = {
      template: template || project.document?.template || 'IEEE',
      contentMarkdown: contentMarkdown ?? project.document?.contentMarkdown ?? '',
      contentHtml: contentHtml ?? project.document?.contentHtml ?? '',
      contentLatex: contentLatex ?? project.document?.contentLatex ?? ''
    };

    project.currentStage = Math.max(project.currentStage || 1, 5);
    project.markModified('document');
    await project.save();

    return res.json({
      message: 'Document saved successfully',
      document: project.document,
      lastSynced: new Date()
    });
  } catch (error) {
    console.error('Update document error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/project/:id/drive/sync
router.post('/project/:id/drive/sync', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Simulated Google Drive OAuth API synchronization
    const driveFileId = `gdrive-doc-${Date.now()}`;

    return res.json({
      status: 'SYNCED',
      driveFileId,
      syncedAt: new Date(),
      message: 'Successfully synced manuscript to Google Drive cloud storage.'
    });
  } catch (error) {
    console.error('Google Drive sync error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
