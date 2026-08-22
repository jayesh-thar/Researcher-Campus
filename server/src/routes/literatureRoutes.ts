import { Router, Request, Response } from 'express';
import { executeMultiEngineLiteratureScan } from '../services/literatureService';
import { Project, ILiteratureItem } from '../models/Project';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/projects - List all projects for authenticated user
router.get('/projects', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
    return res.json({ projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

// POST /api/project/:id/literature/import
router.post('/project/:id/literature/import', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { bibtexText } = req.body;

    if (!bibtexText || typeof bibtexText !== 'string') {
      return res.status(400).json({ error: 'bibtexText string is required' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Parse BibTeX entry title and authors
    const titleMatch = bibtexText.match(/title\s*=\s*[\{"]([^"\}]+)["\}]/i);
    const authorMatch = bibtexText.match(/author\s*=\s*[\{"]([^"\}]+)["\}]/i);
    const yearMatch = bibtexText.match(/year\s*=\s*[\{"]?(\d{4})["\}]?/i);
    const journalMatch = bibtexText.match(/(?:journal|booktitle)\s*=\s*[\{"]([^"\}]+)["\}]/i);

    const newItem: ILiteratureItem = {
      id: `lit-imported-${Date.now()}`,
      title: titleMatch ? titleMatch[1] : 'Imported Academic Citation',
      authors: authorMatch ? authorMatch[1].split(' and ') : ['External Author'],
      year: yearMatch ? parseInt(yearMatch[1], 10) : 2025,
      venue: journalMatch ? journalMatch[1] : 'Peer-Reviewed Conference / Journal',
      doiUrl: 'https://doi.org/10.1145/imported.ref',
      similarity: 10,
      keyTakeaway: 'Imported reference added via BibTeX manager.',
      category: 'REFERENCE',
      bibtex: bibtexText
    };

    project.literature.push(newItem);
    project.markModified('literature');
    await project.save();

    return res.json({
      message: 'BibTeX reference imported successfully',
      importedItem: newItem,
      literature: project.literature
    });
  } catch (error) {
    console.error('BibTeX import error:', error);
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
