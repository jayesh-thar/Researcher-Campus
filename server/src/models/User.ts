import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  persona: 'STUDENT' | 'PHD' | 'PROFESSOR' | 'INDUSTRY' | 'INDEPENDENT';
  primaryDomain: string;
  targetVenue: 'IEEE' | 'ACM' | 'SPRINGER' | 'NATURE' | 'ARXIV';
  techStack: string[];
  subscription: {
    tier: 'FREE' | 'PRO' | 'LAB';
    monthlyQuota: number;
    usedThisMonth: number;
    resetAt: Date;
  };
  googleDrive: {
    isConnected: boolean;
    encryptedRefreshToken?: string;
    rootFolderId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  persona: {
    type: String,
    enum: ['STUDENT', 'PHD', 'PROFESSOR', 'INDUSTRY', 'INDEPENDENT'],
    default: 'STUDENT'
  },
  primaryDomain: { type: String, default: '💻 Software & Distributed Systems' },
  targetVenue: {
    type: String,
    enum: ['IEEE', 'ACM', 'SPRINGER', 'NATURE', 'ARXIV'],
    default: 'IEEE'
  },
  techStack: [{ type: String }],
  subscription: {
    tier: { type: String, enum: ['FREE', 'PRO', 'LAB'], default: 'FREE' },
    monthlyQuota: { type: Number, default: 100 },
    usedThisMonth: { type: Number, default: 0 },
    resetAt: { type: Date, default: Date.now }
  },
  googleDrive: {
    isConnected: { type: Boolean, default: false },
    encryptedRefreshToken: { type: String },
    rootFolderId: { type: String }
  }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
