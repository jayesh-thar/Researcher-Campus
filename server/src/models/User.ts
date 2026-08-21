import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  avatarUrl?: string;
  persona: 'STUDENT' | 'PHD' | 'PROFESSOR' | 'INDUSTRY' | 'INDEPENDENT';
  primaryDomain: string;
  targetVenuePreference?: string;
  techStack?: string[];
  isCompletedOnboarding: boolean;
  subscription: {
    plan: 'FREE' | 'PRO' | 'INSTITUTION';
    monthlyQuota: number;
    usedThisMonth: number;
    resetDate: Date;
  };
  googleDrive: {
    isConnected: boolean;
    encryptedRefreshToken?: string;
    folderId?: string;
    lastSyncedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String },
    avatarUrl: { type: String },
    persona: {
      type: String,
      enum: ['STUDENT', 'PHD', 'PROFESSOR', 'INDUSTRY', 'INDEPENDENT'],
      default: 'STUDENT'
    },
    primaryDomain: {
      type: String,
      default: '💻 Software & Distributed Systems'
    },
    targetVenuePreference: { type: String, default: 'IEEE Conference' },
    techStack: [{ type: String }],
    isCompletedOnboarding: { type: Boolean, default: false },
    subscription: {
      plan: { type: String, enum: ['FREE', 'PRO', 'INSTITUTION'], default: 'FREE' },
      monthlyQuota: { type: Number, default: 100 },
      usedThisMonth: { type: Number, default: 0 },
      resetDate: { type: Date, default: Date.now }
    },
    googleDrive: {
      isConnected: { type: Boolean, default: false },
      encryptedRefreshToken: { type: String },
      folderId: { type: String },
      lastSyncedAt: { type: Date }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
