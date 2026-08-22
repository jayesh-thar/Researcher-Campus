import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';

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
}

const VENUE_DATABASE: VenueItem[] = [
  {
    id: 'v-1',
    name: 'IEEE/ACM International Conference on Software Engineering',
    acronym: 'IEEE ICSE 2026',
    domain: '💻 Software & Distributed Systems',
    deadlineDate: '2026-11-01',
    location: 'Rio de Janeiro, Brazil',
    mode: 'HYBRID',
    acceptanceRate: '19.4%',
    rank: 'A*',
    url: 'https://conf.researchr.org/home/icse-2026'
  },
  {
    id: 'v-2',
    name: 'ACM CHI Conference on Human Factors in Computing Systems',
    acronym: 'ACM CHI 2026',
    domain: '🧠 Artificial Intelligence & ML',
    deadlineDate: '2026-12-01',
    location: 'Barcelona, Spain',
    mode: 'HYBRID',
    acceptanceRate: '24.1%',
    rank: 'A*',
    url: 'https://chi2026.acm.org'
  },
  {
    id: 'v-3',
    name: 'USENIX Security Symposium',
    acronym: 'USENIX Security 2026',
    domain: '🛡️ Cybersecurity & Privacy',
    deadlineDate: '2026-10-15',
    location: 'Boston, MA, USA',
    mode: 'IN_PERSON',
    acceptanceRate: '17.8%',
    rank: 'A*',
    url: 'https://www.usenix.org/conference/usenixsecurity26'
  },
  {
    id: 'v-4',
    name: 'International Symposium on Software Testing and Analysis',
    acronym: 'ISSTA 2026',
    domain: '💻 Software & Distributed Systems',
    deadlineDate: '2026-09-20',
    location: 'Seattle, WA, USA',
    mode: 'HYBRID',
    acceptanceRate: '21.0%',
    rank: 'A*',
    url: 'https://conf.researchr.org/home/issta-2026'
  }
];

// GET /api/venues/search
router.get('/venues/search', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { domain, query } = req.query;

    let filtered = VENUE_DATABASE;
    if (domain && typeof domain === 'string' && domain !== 'ALL') {
      filtered = filtered.filter((v) => v.domain.toLowerCase().includes(domain.toLowerCase()));
    }
    if (query && typeof query === 'string') {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query.toLowerCase()) ||
          v.acronym.toLowerCase().includes(query.toLowerCase())
      );
    }

    return res.json({ venues: filtered });
  } catch (error) {
    console.error('Search venues error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/project/:id/venues/target
router.post('/project/:id/venues/target', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { venueId } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const selectedVenue = VENUE_DATABASE.find((v) => v.id === venueId);
    if (selectedVenue) {
      project.targetVenues = [
        {
          name: selectedVenue.name,
          acronym: selectedVenue.acronym,
          deadlineDate: selectedVenue.deadlineDate,
          location: selectedVenue.location,
          mode: selectedVenue.mode,
          acceptanceRate: selectedVenue.acceptanceRate,
          rank: selectedVenue.rank,
          url: selectedVenue.url
        }
      ];
      project.currentStage = 7;
      project.markModified('targetVenues');
      await project.save();
    }

    return res.json({
      message: 'Target venue set successfully',
      targetVenues: project.targetVenues
    });
  } catch (error) {
    console.error('Set target venue error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
