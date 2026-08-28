import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { generateDynamicVenues } from '../services/geminiService';

const router = Router();

export interface VenueItem {
  id: string;
  name: string;
  acronym: string;
  domain: string;
  deadlineDate: string;
  location: string;
  mode: 'HYBRID' | 'IN_PERSON' | 'VIRTUAL';
  acceptanceRate: string;
  rank: 'A*' | 'A' | 'B';
  url: string;
  relevanceReason?: string;
}

// GET /api/project/:id/venues
router.get('/project/:id/venues', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const dynamic = await generateDynamicVenues(
      project.academicTitle || project.title || 'Research Paper',
      project.methodologyOverview || ''
    );

    const venues: VenueItem[] = dynamic.venues.map((v, idx) => ({
      id: `v-${idx + 1}`,
      name: v.name,
      acronym: v.acronym,
      domain: project.domain || 'Computer Science & AI',
      deadlineDate: v.deadline,
      location: v.location || 'Hybrid / International',
      mode: (v.mode || 'HYBRID') as 'HYBRID' | 'IN_PERSON' | 'VIRTUAL',
      acceptanceRate: v.acceptanceRate,
      rank: (v.coreRank && v.coreRank.includes('A*') ? 'A*' : v.coreRank && v.coreRank.includes('A') ? 'A' : 'B') as 'A*' | 'A' | 'B',
      url: v.url || 'https://core.edu.au/',
      relevanceReason: v.relevanceReason
    }));

    return res.json({
      venues,
      submissionPackageReady: true
    });
  } catch (error) {
    console.error('Fetch venues error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/project/:id/venues/export-package
router.post('/project/:id/venues/export-package', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const packageManifest = {
      projectTitle: project.academicTitle || project.title,
      manuscriptFile: 'manuscript.pdf',
      latexSource: 'manuscript.tex',
      bibliography: 'references.bib',
      complianceReport: 'audit_summary.json',
      targetVenue: project.targetVenues?.[0]?.acronym || 'Target Venue',
      exportedAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      downloadUrl: `/api/export/package/${project._id}.zip`,
      manifest: packageManifest
    });
  } catch (error) {
    console.error('Export submission package error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
