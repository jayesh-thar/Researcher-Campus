import { Router, Request, Response } from 'express';
import { executeMultiEngineLiteratureScan } from '../services/literatureService.js';
import { Project } from '../models/Project.js';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const router = Router();

// POST /api/literature/scan
router.post('/scan', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, academicTitle, problemStatement, methodologyOverview } = req.body;

    if (!academicTitle || !methodologyOverview) {
      return res.status(400).json({ error: 'academicTitle and methodologyOverview are required' });
    }

    const gateScan = await executeMultiEngineLiteratureScan(
      academicTitle,
      problemStatement || '',
      methodologyOverview
    );

    // If projectId is passed, update the project in MongoDB
    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        project.gateResult = {
          status: gateScan.status,
          noveltyScore: gateScan.noveltyScore,
          maxOverlapPercent: gateScan.maxOverlapPercent,
          whitespaceStatement: gateScan.whitespaceStatement,
          remediationAngle: gateScan.remediationAngle
        };
        project.literature = gateScan.literature;
        project.currentStage = Math.max(project.currentStage || 1, 2);
        await project.save();
      }
    }

    return res.json({ gateScan });
  } catch (error) {
    console.error('Literature scan route error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/project/create
router.post('/project/create', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const {
      title,
      rawInput,
      academicTitle,
      problemStatement,
      methodologyOverview,
      domain
    } = req.body;

    if (!title || !rawInput) {
      return res.status(400).json({ error: 'Title and rawInput are required' });
    }

    // Automatically trigger Gate literature scan
    const gateScan = await executeMultiEngineLiteratureScan(
      academicTitle || title,
      problemStatement || '',
      methodologyOverview || rawInput
    );

    const project = await Project.create({
      userId,
      title,
      rawInput,
      academicTitle: academicTitle || title,
      problemStatement: problemStatement || '',
      methodologyOverview: methodologyOverview || '',
      domain: domain || '💻 Software & Distributed Systems',
      currentStage: 2,
      gateResult: {
        status: gateScan.status,
        noveltyScore: gateScan.noveltyScore,
        maxOverlapPercent: gateScan.maxOverlapPercent,
        whitespaceStatement: gateScan.whitespaceStatement,
        remediationAngle: gateScan.remediationAngle
      },
      literature: gateScan.literature,
      roadmap: {
        recommendedDatasets: [
          { title: 'StudentTaskBench (Kaggle)', url: 'https://kaggle.com', description: '12,000 anonymized student scheduling traces' },
          { title: 'AcademicWorkload-v2 (HuggingFace)', url: 'https://huggingface.co', description: 'Multi-modal workload benchmark dataset' }
        ],
        recommendedTools: [
          { name: 'PyTorch / FastAPI', url: 'https://pytorch.org', category: 'Backend Engine' },
          { name: 'TipTap / KaTeX', url: 'https://tiptap.dev', category: 'Paper Drafting Canvas' }
        ],
        checklist: [
          { id: 't-1', phase: 'ENVIRONMENT', task: 'Initialize repository and pre-process dataset', isCompleted: true },
          { id: 't-2', phase: 'DEVELOPMENT', task: 'Build constraint scheduling algorithm', isCompleted: false },
          { id: 't-3', phase: 'EVALUATION', task: 'Run latency and memory overhead benchmarks', isCompleted: false },
          { id: 't-4', phase: 'SYNTHESIS', task: 'Draft paper empirical results section', isCompleted: false }
        ]
      },
      document: {
        template: 'IEEE',
        contentMarkdown: `# ${academicTitle || title}\n\n## Abstract\n${problemStatement || ''}\n\n## 1. Introduction\n...`,
        contentHtml: `<h1>${academicTitle || title}</h1><h2>Abstract</h2><p>${problemStatement || ''}</p>`,
        contentLatex: `\\title{${academicTitle || title}}\n\\begin{abstract}\n${problemStatement || ''}\n\\end{abstract}`
      },
      audit: {
        isPassed: false,
        overallScore: 0,
        citationIntegrity: false,
        anonymityCheck: false,
        formattingCompliance: false,
        academicToneScore: 0,
        issuesFound: []
      },
      targetVenues: [
        {
          name: 'IEEE International Conference on Software Engineering',
          acronym: 'IEEE ICSE 2026',
          deadlineDate: '2026-11-01',
          location: 'Rio de Janeiro, Brazil',
          mode: 'HYBRID',
          acceptanceRate: '19.4%',
          rank: 'A*',
          url: 'https://conf.researchr.org/home/icse-2026'
        }
      ]
    });

    return res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/project/:id
router.get('/project/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ project });
  } catch (error) {
    console.error('Fetch project error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
