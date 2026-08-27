import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, persona, primaryDomain } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      persona: persona || 'STUDENT',
      primaryDomain: primaryDomain || '💻 Software & Distributed Systems',
      isCompletedOnboarding: false
    });

    const accessToken = signAccessToken({ userId: user._id.toString(), email: user.email, tier: 'FREE' });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), email: user.email, tier: 'FREE' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SEVEN_DAYS_MS
    });

    return res.status(201).json({
      message: 'Registration successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        persona: user.persona,
        primaryDomain: user.primaryDomain,
        isCompletedOnboarding: user.isCompletedOnboarding,
        googleDriveConnected: user.googleDrive.isConnected
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({ userId: user._id.toString(), email: user.email, tier: 'FREE' });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), email: user.email, tier: 'FREE' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SEVEN_DAYS_MS
    });

    return res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        persona: user.persona,
        primaryDomain: user.primaryDomain,
        isCompletedOnboarding: user.isCompletedOnboarding,
        googleDriveConnected: user.googleDrive.isConnected
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { googleId, name, email, avatarUrl } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Google authentication data missing' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: googleId || `google-${Date.now()}`,
        avatarUrl,
        isCompletedOnboarding: false
      });
    } else {
      if (googleId && !user.googleId) user.googleId = googleId;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    }

    const accessToken = signAccessToken({ userId: user._id.toString(), email: user.email, tier: 'FREE' });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), email: user.email, tier: 'FREE' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SEVEN_DAYS_MS
    });

    return res.json({
      message: 'Google Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        persona: user.persona,
        primaryDomain: user.primaryDomain,
        isCompletedOnboarding: user.isCompletedOnboarding,
        googleDriveConnected: user.googleDrive.isConnected
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh Token Missing' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or Expired Refresh Token' });
    }
    const accessToken = signAccessToken({ userId: payload.userId, email: payload.email || '', tier: 'FREE' });
    return res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or Expired Refresh Token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
});

// GET /api/user/profile
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/user/onboarding
router.put('/onboarding', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { persona, primaryDomain, targetVenuePreference, techStack, connectDrive } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (persona) user.persona = persona;
    if (primaryDomain) user.primaryDomain = primaryDomain;
    if (targetVenuePreference) user.targetVenuePreference = targetVenuePreference;
    if (techStack) user.techStack = techStack;
    user.isCompletedOnboarding = true;

    if (connectDrive) {
      user.googleDrive = {
        isConnected: true,
        lastSyncedAt: new Date()
      };
    }

    await user.save();

    return res.json({
      message: 'Onboarding completed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        persona: user.persona,
        primaryDomain: user.primaryDomain,
        targetVenuePreference: user.targetVenuePreference,
        isCompletedOnboarding: user.isCompletedOnboarding,
        googleDriveConnected: user.googleDrive.isConnected
      }
    });
  } catch (error) {
    console.error('Onboarding update error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/user/settings
router.put('/settings', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, persona, primaryDomain, targetVenuePreference, disconnectDrive, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (persona) user.persona = persona;
    if (primaryDomain) user.primaryDomain = primaryDomain;
    if (targetVenuePreference) user.targetVenuePreference = targetVenuePreference;

    if (disconnectDrive) {
      user.googleDrive.isConnected = false;
      user.googleDrive.encryptedRefreshToken = undefined;
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return res.json({
      message: 'Profile settings updated successfully',
      user
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
