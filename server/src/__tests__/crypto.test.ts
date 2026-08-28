import { describe, it, expect } from 'vitest';
import { encryptToken, decryptToken } from '../utils/crypto';

describe('AES-256-GCM Cryptographic Security Engine', () => {
  const sampleSecret = 'google_oauth_refresh_token_xyz_1234567890_academic_grant';

  it('should successfully encrypt a plaintext secret and return formatted iv:authTag:encrypted payload', () => {
    const encrypted = encryptToken(sampleSecret);
    expect(encrypted).toBeDefined();
    const parts = encrypted.split(':');
    expect(parts.length).toBe(3);
    expect(parts[0].length).toBe(32); // 16 bytes IV in hex
    expect(parts[1].length).toBe(32); // 16 bytes Auth Tag in hex
    expect(parts[2].length).toBeGreaterThan(0);
  });

  it('should successfully decrypt the ciphertext back to the original plaintext', () => {
    const encrypted = encryptToken(sampleSecret);
    const decrypted = decryptToken(encrypted);
    expect(decrypted).toBe(sampleSecret);
  });

  it('should generate unique IVs for consecutive encryptions of the same plaintext', () => {
    const enc1 = encryptToken(sampleSecret);
    const enc2 = encryptToken(sampleSecret);
    expect(enc1).not.toBe(enc2);
    expect(decryptToken(enc1)).toBe(sampleSecret);
    expect(decryptToken(enc2)).toBe(sampleSecret);
  });

  it('should throw an error if decrypting a corrupted or tampered ciphertext payload', () => {
    const encrypted = encryptToken(sampleSecret);
    const parts = encrypted.split(':');
    const tamperedCiphertext = `${parts[0]}:${parts[1]}:tampered_${parts[2]}`;
    expect(() => decryptToken(tamperedCiphertext)).toThrow();
  });
});
