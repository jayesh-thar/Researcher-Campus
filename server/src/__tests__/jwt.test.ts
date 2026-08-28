import { describe, it, expect } from 'vitest';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';

describe('Dual-Token JWT Authentication Subsystem', () => {
  const userPayload = {
    userId: 'user_67890_academic_id',
    email: 'researcher@ox.ac.uk',
    tier: 'FREE' as const
  };

  it('should sign and verify short-lived Access Tokens', () => {
    const accessToken = signAccessToken(userPayload);
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe('string');

    const decoded = verifyAccessToken(accessToken);
    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe(userPayload.userId);
    expect(decoded?.email).toBe(userPayload.email);
  });

  it('should sign and verify long-lived Refresh Tokens', () => {
    const refreshToken = signRefreshToken(userPayload);
    expect(refreshToken).toBeDefined();
    expect(typeof refreshToken).toBe('string');

    const decoded = verifyRefreshToken(refreshToken);
    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe(userPayload.userId);
    expect(decoded?.email).toBe(userPayload.email);
  });

  it('should reject invalid or forged token strings', () => {
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake_signature';
    expect(verifyAccessToken(forgedToken)).toBeNull();
    expect(verifyRefreshToken(forgedToken)).toBeNull();
  });
});
