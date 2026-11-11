import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { generateDynamicVenues } from '../services/geminiService';
import { buildZipBuffer } from '../utils/zipBuilder';

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

// GET /api/project/:id/venues  — generate once, cache in project.targetVenues
router.get('/project/:id/venues', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // HYDRATION FIRST: if venues already cached return instantly
    if (project.targetVenues && project.targetVenues.length > 0) {
      const cached: VenueItem[] = project.targetVenues.map((v: any, idx: number) => ({
        id: `v-${idx + 1}`,
        name: v.name,
        acronym: v.acronym,
        domain: project.domain || 'Computer Science & AI',
        deadlineDate: v.deadlineDate,
        location: v.location || 'Hybrid / International',
        mode: (v.mode || 'HYBRID') as 'HYBRID' | 'IN_PERSON' | 'VIRTUAL',
        acceptanceRate: v.acceptanceRate || '25%',
        rank: (v.rank || 'A') as 'A*' | 'A' | 'B',
        url: v.url || 'https://core.edu.au/',
        relevanceReason: undefined
      }));
      return res.json({ venues: cached, submissionPackageReady: true });
    }

    // Generate with AI and persist into project.targetVenues
    const dynamic = await generateDynamicVenues(
      project.academicTitle || project.title || 'Research Paper',
      project.methodologyOverview || ''
    );

    const venues: VenueItem[] = dynamic.venues.map((v: any, idx: number) => ({
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

    // Cache in DB so next visit is instant, and advance stage to 7
    await Project.findByIdAndUpdate(id, {
      $set: {
        targetVenues: venues.map((v) => ({
          name: v.name,
          acronym: v.acronym,
          deadlineDate: v.deadlineDate,
          location: v.location,
          mode: v.mode,
          acceptanceRate: v.acceptanceRate,
          rank: v.rank,
          url: v.url
        }))
      },
      $max: { currentStage: 7 }
    });

    return res.json({ venues, submissionPackageReady: true });
  } catch (error) {
    console.error('Fetch venues error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/project/:id/venues/download-package — streams real zip bytes to browser
router.get('/project/:id/venues/download-package', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const title = (project.academicTitle || project.title || 'manuscript').replace(/[^a-z0-9]/gi, '_');

    // --- Build each file's text content ---
    const manuscriptMd = project.document?.contentMarkdown ||
      `# ${project.academicTitle || project.title}\n\n## Abstract\n${project.problemStatement || ''}\n\n## 1. Introduction\n${project.methodologyOverview || ''}`;

    const latexContent = `\\documentclass[conference]{IEEEtran}
\\title{${project.academicTitle || project.title}}
\\author{\\IEEEauthorblockN{Academic Researcher}\\IEEEauthorblockA{Researcher Campus}}
\\begin{document}
\\maketitle
\\begin{abstract}
${(project.problemStatement || '').slice(0, 400)}
\\end{abstract}
\\section{Introduction}
${(project.methodologyOverview || '').slice(0, 600)}
\\end{document}`;

    const bibContent = (project.literature || [])
      .map((l: any) => l.bibtex || '')
      .filter(Boolean)
      .join('\n\n') || `@article{placeholder2024,
  title={${project.academicTitle || project.title}},
  author={Academic Researcher},
  year={2024}
}`;

    const auditJson = JSON.stringify({
      projectTitle: project.academicTitle || project.title,
      projectId: project._id,
      auditResult: project.audit || {},
      exportedAt: new Date().toISOString(),
      noveltyScore: project.gateResult?.noveltyScore,
      gateStatus: project.gateResult?.status
    }, null, 2);

    const manifestJson = JSON.stringify({
      projectTitle: project.academicTitle || project.title,
      files: ['manuscript.md', 'manuscript.tex', 'references.bib', 'audit_report.json'],
      targetVenue: project.targetVenues?.[0]?.acronym || 'TBD',
      exportedAt: new Date().toISOString(),
      researcherCampusVersion: '2.0'
    }, null, 2);

    // --- Build a minimal .zip using raw bytes (no external library needed) ---
    const zipBuffer = buildZipBuffer([
      { name: 'manuscript.md',       content: manuscriptMd },
      { name: 'manuscript.tex',       content: latexContent },
      { name: 'references.bib',       content: bibContent },
      { name: 'audit_report.json',    content: auditJson },
      { name: 'MANIFEST.json',        content: manifestJson }
    ]);

    // Advance stage to 7
    await Project.findByIdAndUpdate(id, { $max: { currentStage: 7 } });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${title}_submission_package.zip"`);
    res.setHeader('Content-Length', zipBuffer.length);
    return res.end(zipBuffer);
  } catch (error) {
    console.error('Download package error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/project/:id/venues/export-package — legacy, now redirects to GET download
router.post('/project/:id/venues/export-package', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    downloadUrl: `/api/project/${req.params.id}/venues/download-package`
  });
});

export default router;
