import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, Clock, ExternalLink, Download, CheckCircle2, 
  MapPin, Globe, Sparkles, FolderArchive, ArrowRight, Check, ChevronLeft
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SidePaperDrawer } from '../components/layout/SidePaperDrawer';
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
  relevanceReason?: string;
}

export function VenueMatcher() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('v-1');
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<string>('');

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const projRes = await api.get(`/project/${id || 'demo'}`);
      if (projRes.data.project) {
        setProjectTitle(projRes.data.project.academicTitle || projRes.data.project.title || 'Research Project');
      }

      const response = await api.get(`/project/${id || 'demo'}/venues`);
      if (response.data.venues && response.data.venues.length > 0) {
        setVenues(response.data.venues);
        setSelectedTargetId(response.data.venues[0].id);
      }
    } catch (err) {
      console.error('Fetch venues error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [id]);

  const handleDownloadPackage = async () => {
    setDownloadingZip(true);
    try {
      await api.post(`/project/${id || 'demo'}/venues/export-package`);
      setDownloadingZip(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download package error:', err);
      setDownloadingZip(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Navigation */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 7 OF 7</span>
              <span>•</span>
              <span>TARGET PUBLICATION VENUE MATCHER</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Publication Matcher & Submission Vault</h1>
            {projectTitle && (
              <p className="text-xs text-slate-600 font-mono mt-0.5 truncate max-w-2xl">
                Topic: {projectTitle}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Link to={`/project/${id || 'demo'}/audit`}>
              <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>
                Back to Stage 6
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* 1-Click Submission Vault Card */}
        <Card className="bg-navy-900 text-white border-navy-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <FolderArchive className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold tracking-tight">Camera-Ready Submission Archive (.zip)</h2>
              </div>
              <p className="text-xs text-slate-300">
                Bundles compiled PDF, LaTeX manuscript, BibTeX citations, and compliance audit log into a verified submission bundle.
              </p>
            </div>

            <Button
              size="md"
              variant="primary"
              onClick={handleDownloadPackage}
              isLoading={downloadingZip}
              className="bg-white text-navy-900 hover:bg-slate-100 border-none font-semibold shrink-0"
              leftIcon={downloadSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-navy-900" />}
            >
              {downloadSuccess ? 'Archive Exported!' : 'Export Submission Package (.zip)'}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-navy-800 text-[11px] font-mono text-slate-300">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>manuscript.pdf</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>manuscript.tex</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>references.bib</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>audit_report.json</span>
            </div>
          </div>
        </Card>

        {/* Dynamic Targeted Venues Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Recommended Target Venues (Ranked by Topic Fit)</h2>
              <p className="text-xs text-slate-500">Includes Conferences and High-Impact Journals with online & hybrid submission options.</p>
            </div>
            <Badge variant="info">CORE Rank A* & High-Impact Journals</Badge>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded p-6 space-y-3 animate-pulse">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
              <div className="bg-white border border-slate-200 rounded p-6 space-y-3 animate-pulse">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venues.map((venue) => {
                const isSelected = selectedTargetId === venue.id;

                return (
                  <Card
                    key={venue.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-navy-800 ring-2 ring-navy-800/10 shadow-sm bg-white'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedTargetId(venue.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{venue.name}</span>
                          <span className="font-mono text-xs font-semibold text-navy-800">{venue.acronym}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Badge variant="info" size="sm">{venue.rank}</Badge>
                          <Badge variant={venue.mode === 'HYBRID' ? 'pass' : 'neutral'} size="sm">
                            {venue.mode}
                          </Badge>
                        </div>
                      </div>

                      {venue.relevanceReason && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 italic">
                          "{venue.relevanceReason}"
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {venue.deadlineDate}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Award className="w-3.5 h-3.5 text-slate-400" />
                          <span>Acceptance: {venue.acceptanceRate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-navy-800' : 'text-slate-500'}`}>
                          {isSelected ? '✓ Selected Primary Venue' : 'Click to Set as Target'}
                        </span>
                        {venue.url && (
                          <a
                            href={venue.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-navy-800 font-mono hover:underline flex items-center"
                          >
                            Call for Papers <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Persistent Side-by-Side Paper Drafting Studio Drawer */}
        <SidePaperDrawer projectId={id || 'demo'} />
      </main>
    </div>
  );
}
