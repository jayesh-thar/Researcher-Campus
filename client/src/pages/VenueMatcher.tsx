import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, Clock, ExternalLink, Download, CheckCircle2, 
  MapPin, Globe, Sparkles, FolderArchive, ArrowRight
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../services/api';

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

export function VenueMatcher() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('v-1');
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);
  const [venues, setVenues] = useState<VenueItem[]>([]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockVenues: VenueItem[] = [
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

      setVenues(mockVenues);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load venue database:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [id]);

  const handleSelectTargetVenue = async (venueId: string) => {
    setSelectedTargetId(venueId);
    try {
      await api.post(`/project/${id || 'demo'}/venues/target`, { venueId });
    } catch (err) {
      console.error('Failed to set target venue:', err);
    }
  };

  const handleDownloadSubmissionPackage = () => {
    setDownloadingZip(true);
    setTimeout(() => {
      setDownloadingZip(false);
      alert('📦 Final Conference Submission Package (.zip) generated! Contains manuscript.pdf, manuscript.tex, references.bib, and anonymized benchmark artifacts.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Bar */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 7 OF 7</span>
              <span>•</span>
              <span>TARGET VENUE MATCHER & FINAL SUBMISSION PORTAL</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Target Publication Venues & Submission Package</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleDownloadSubmissionPackage}
              isLoading={downloadingZip}
              leftIcon={<FolderArchive className="w-4 h-4 text-amber-300" />}
            >
              Export Submission Package (.zip)
            </Button>

            <Link to="/dashboard">
              <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        )}

        {!loading && (
          <>
            {/* Active Selected Target Venue Header */}
            {venues.find((v) => v.id === selectedTargetId) && (
              <Card className="bg-navy-800 text-white border-navy-900 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-300 font-mono">
                      Active Target Venue Selected
                    </span>
                  </div>
                  <Badge variant="pass">CORE Rank {venues.find((v) => v.id === selectedTargetId)?.rank}</Badge>
                </div>

                <h2 className="text-xl font-extrabold tracking-tight">
                  {venues.find((v) => v.id === selectedTargetId)?.name} ({venues.find((v) => v.id === selectedTargetId)?.acronym})
                </h2>

                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-200 font-mono pt-1">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>Deadline: {venues.find((v) => v.id === selectedTargetId)?.deadlineDate} (42 Days Left)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-slate-300" />
                    <span>{venues.find((v) => v.id === selectedTargetId)?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{venues.find((v) => v.id === selectedTargetId)?.acceptanceRate} Acceptance Rate</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Target Venue Directory Grid */}
            <div className="space-y-3">
              <span className="font-bold text-slate-700 text-sm block">Top Recommended Publication Venues</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venues.map((venue) => {
                  const isSelected = venue.id === selectedTargetId;
                  return (
                    <Card
                      key={venue.id}
                      className={`flex flex-col justify-between transition-colors ${
                        isSelected ? 'border-navy-800 ring-2 ring-navy-800/10' : 'hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {venue.domain}
                          </span>
                          <Badge variant="info">CORE Rank {venue.rank}</Badge>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {venue.acronym} — {venue.name}
                        </h3>

                        <div className="space-y-1 text-xs text-slate-600 font-mono">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Deadline: {venue.deadlineDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{venue.location} ({venue.mode})</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs mt-4">
                        <a
                          href={venue.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-navy-800 hover:underline font-mono inline-flex items-center"
                        >
                          Official Portal <ExternalLink className="w-3 h-3 ml-1" />
                        </a>

                        {isSelected ? (
                          <Badge variant="pass" size="sm">✓ Active Target Venue</Badge>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSelectTargetVenue(venue.id)}
                          >
                            Set as Target
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
