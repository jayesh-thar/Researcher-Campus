import mongoose, { Schema, Document } from 'mongoose';

export interface ILiteratureItem {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  doiUrl: string;
  similarity: number;
  keyTakeaway: string;
  category: 'BASELINE' | 'COMPETITOR' | 'REFERENCE';
  bibtex: string;
}

export interface IRoadmapTask {
  id: string;
  phase: 'ENVIRONMENT' | 'DEVELOPMENT' | 'EVALUATION' | 'SYNTHESIS';
  task: string;
  isCompleted: boolean;
  userNotes?: string;
}

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  rawInput: string;
  academicTitle: string;
  problemStatement: string;
  methodologyOverview: string;
  domain: string;
  gateResult: {
    status: 'PASS' | 'SOFT_WARNING' | 'HARD_STOP';
    noveltyScore: number;
    maxOverlapPercent: number;
    whitespaceStatement: string;
    remediationAngle?: string;
  };
  literature: ILiteratureItem[];
  roadmap: {
    recommendedDatasets: Array<{ title: string; url: string; description: string }>;
    recommendedTools: Array<{ name: string; url: string; category: string }>;
    checklist: IRoadmapTask[];
  };
  document: {
    template: 'IEEE' | 'ACM' | 'SPRINGER' | 'NATURE' | 'ARXIV';
    contentMarkdown: string;
    contentHtml: string;
    contentLatex: string;
    lastSyncedToDriveAt?: Date;
    driveFileId?: string;
  };
  audit: {
    isPassed: boolean;
    overallScore: number;
    citationIntegrity: boolean;
    anonymityCheck: boolean;
    formattingCompliance: boolean;
    academicToneScore: number;
    issuesFound: string[];
  };
  targetVenues: Array<{
    name: string;
    acronym: string;
    deadlineDate: string;
    location: string;
    mode: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
    acceptanceRate?: string;
    rank?: string;
    url: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  rawInput: { type: String, required: true },
  academicTitle: { type: String, default: '' },
  problemStatement: { type: String, default: '' },
  methodologyOverview: { type: String, default: '' },
  domain: { type: String, default: '' },
  gateResult: {
    status: { type: String, enum: ['PASS', 'SOFT_WARNING', 'HARD_STOP'], default: 'PASS' },
    noveltyScore: { type: Number, default: 100 },
    maxOverlapPercent: { type: Number, default: 0 },
    whitespaceStatement: { type: String, default: '' },
    remediationAngle: { type: String }
  },
  literature: [{
    id: String,
    title: String,
    authors: [String],
    year: Number,
    venue: String,
    doiUrl: String,
    similarity: Number,
    keyTakeaway: String,
    category: { type: String, enum: ['BASELINE', 'COMPETITOR', 'REFERENCE'], default: 'BASELINE' },
    bibtex: String
  }],
  roadmap: {
    recommendedDatasets: [{ title: String, url: String, description: String }],
    recommendedTools: [{ name: String, url: String, category: String }],
    checklist: [{
      id: String,
      phase: { type: String, enum: ['ENVIRONMENT', 'DEVELOPMENT', 'EVALUATION', 'SYNTHESIS'] },
      task: String,
      isCompleted: { type: Boolean, default: false },
      userNotes: String
    }]
  },
  document: {
    template: { type: String, enum: ['IEEE', 'ACM', 'SPRINGER', 'NATURE', 'ARXIV'], default: 'IEEE' },
    contentMarkdown: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    contentLatex: { type: String, default: '' },
    lastSyncedToDriveAt: Date,
    driveFileId: String
  },
  audit: {
    isPassed: { type: Boolean, default: false },
    overallScore: { type: Number, default: 0 },
    citationIntegrity: { type: Boolean, default: false },
    anonymityCheck: { type: Boolean, default: false },
    formattingCompliance: { type: Boolean, default: false },
    academicToneScore: { type: Number, default: 0 },
    issuesFound: [String]
  },
  targetVenues: [{
    name: String,
    acronym: String,
    deadlineDate: String,
    location: String,
    mode: { type: String, enum: ['IN_PERSON', 'ONLINE', 'HYBRID'] },
    acceptanceRate: String,
    rank: String,
    url: String
  }]
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
