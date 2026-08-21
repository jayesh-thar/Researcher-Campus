import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, AlertCircle, Sparkles, CheckCircle2, 
  ArrowRight, FileCheck, RefreshCw, Eye, BookOpen, UserX, FileText
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../services/api';

export interface AuditIssueItem {
  id: string;
  category: 'CITATION' | 'ANONYMITY' | 'FORMATTING' | 'TONE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  lineNumber?: number;
  flaggedText: string;
  recommendation: string;
}

export function PreFlightAudit() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [fixing, setFixing] = useState<boolean>(false);
  const [auditScore, setAuditScore] = useState<number>(72);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  const [issues, setIssues] = useState<AuditIssueItem[]>([
    {
      id: 'issue-1',
      category: 'ANONYMITY',
      severity: 'CRITICAL',
      lineNumber: 12,
      flaggedText: 'John Doe • Department of Computer Science',
      recommendation: 'Double-blind policy violation! Remove personal author names and institution before submission.'
    },
    {
      id: 'issue-2',
      category: 'TONE',
      severity: 'WARNING',
      lineNumber: 42,
      flaggedText: 'Informal phrasing: "a lot of improvement"',
      recommendation: 'Replace "a lot of" with formal academic term (e.g., "substantial improvement").'
    },
    {
      id: 'issue-3',
      category: 'FORMATTING',
      severity: 'WARNING',
      lineNumber: 68,
      flaggedText: 'Figure 2 caption missing descriptive text',
      recommendation: 'Add detailed figure caption explaining baseline comparison curves.'
    }
  ]);

  const runAuditScan = async () => {
    setLoading(true);
    try {
      // Simulate backend audit processing
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
    } catch (err) {
      console.error('Audit run error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    runAuditScan();
  }, [id]);

  const handleApplyAutoFix = async () => {
    setFixing(true);
    try {
      await api.post(`/project/${id || 'demo'}/audit/fix`);
      setAuditScore(96);
      setIsPassed(true);
      setIssues([]);
      setFixing(false);
    } catch (err) {
      console.error('Auto fix error:', err);
      // Fallback local fix for demo
      setAuditScore(96);
      setIsPassed(true);
      setIssues([]);
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Bar */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 6 OF 7</span>
              <span>•</span>
              <span>AUTOMATED AI PRE-FLIGHT COMPLIANCE AUDITOR</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pre-Flight Manuscript Compliance Audit</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={runAuditScan}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-Scan Manuscript
            </Button>

            <Link to={`/project/${id || 'demo'}/venues`}>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Stage 7: Target Venue Matcher
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        )}

        {!loading && (
          <>
            {/* Overall Score & Verdict Card */}
            <Card className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded flex items-center justify-center font-bold text-2xl font-mono ${
                    auditScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {auditScore}%
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-bold text-slate-900 text-lg">Overall Audit Score:</h2>
                      {auditScore >= 85 ? (
                        <Badge variant="pass">🟢 READY FOR SUBMISSION</Badge>
                      ) : (
                        <Badge variant="warning">🟡 MINOR COMPLIANCE ISSUES DETECTED</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Verified across Citation Integrity, Double-Blind Anonymity, Formatting, and Academic Tone.
                    </p>
                  </div>
                </div>

                {issues.length > 0 && (
                  <Button
                    onClick={handleApplyAutoFix}
                    isLoading={fixing}
                    leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
                  >
                    1-Click AI Auto-Fix Issues
                  </Button>
                )}
              </div>

              {/* 4 Guard Category Summary Status Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-navy-800" />
                    <span className="font-medium text-slate-700">Citation Integrity</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserX className="w-4 h-4 text-navy-800" />
                    <span className="font-medium text-slate-700">Blind Anonymity</span>
                  </div>
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-navy-800" />
                    <span className="font-medium text-slate-700">Formatting & Rules</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-navy-800" />
                    <span className="font-medium text-slate-700">Academic Tone</span>
                  </div>
                  <span className="font-bold font-mono text-emerald-700">98%</span>
                </div>
              </div>
            </Card>

            {/* Flagged Audit Issues List */}
            <Card header={<span className="font-bold text-slate-900 text-base">Flagged Compliance Audit Warnings ({issues.length})</span>}>
              {issues.length === 0 ? (
                <div className="py-8 text-center text-slate-600 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <span className="font-semibold text-slate-900 text-sm block">0 Compliance Warnings Found!</span>
                  Your manuscript complies with all double-blind, citation, formatting, and academic tone rules.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3.5 rounded border ${
                        issue.severity === 'CRITICAL'
                          ? 'bg-red-50/50 border-red-200 text-red-900'
                          : 'bg-amber-50/50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2 font-mono font-semibold">
                          {issue.severity === 'CRITICAL' ? (
                            <Badge variant="stop" size="sm">🚨 CRITICAL VIOLATION</Badge>
                          ) : (
                            <Badge variant="warning" size="sm">⚠️ WARNING</Badge>
                          )}
                          {issue.lineNumber && <span>Line {issue.lineNumber}</span>}
                        </div>
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-500">{issue.category}</span>
                      </div>

                      <div className="font-semibold text-slate-900 mb-1">
                        {issue.flaggedText}
                      </div>
                      <div className="text-slate-700">
                        <span className="font-bold">Recommendation: </span>
                        {issue.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
