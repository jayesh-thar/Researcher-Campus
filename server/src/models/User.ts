import mongoose, { Schema, Document } from 'mongoose';

export interface ITargetVenuePreference {
  venueType: string;
  state: string;
  cities: string[];
  includeOutsideState: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  avatarUrl?: string;
  persona: 'STUDENT' | 'PHD' | 'PROFESSOR' | 'INDUSTRY' | 'INDEPENDENT' | 'RESEARCHER';
  primaryDomain: string;
  targetVenuePreference?: ITargetVenuePreference | string;
  techStack?: string[];
  isCompletedOnboarding: boolean;
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
      enum: ['STUDENT', 'PHD', 'PROFESSOR', 'INDUSTRY', 'INDEPENDENT', 'RESEARCHER'],
      default: 'RESEARCHER'
    },
    primaryDomain: {
      type: String,
      default: '💻 Software & Distributed Systems'
    },
    targetVenuePreference: {
      type: Schema.Types.Mixed,
      default: () => ({
        venueType: 'Peer-Reviewed Conference',
        state: 'Any',
        cities: ['Any'],
        includeOutsideState: true
      })
    },
    techStack: [{ type: String, trim: true }],
    isCompletedOnboarding: { type: Boolean, default: false },
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
