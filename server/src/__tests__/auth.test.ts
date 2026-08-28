import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

describe('User Authentication & Security Hashing', () => {
  const plainPassword = 'SuperSecureAcademicPassword2026!';

  it('should generate a valid bcrypt salt and hash the plaintext password', async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(plainPassword);
    expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
  });

  it('should correctly verify valid passwords against stored hash', async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    const isMatch = await bcrypt.compare(plainPassword, hash);
    expect(isMatch).toBe(true);
  });

  it('should reject incorrect password comparisons', async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    const isMatch = await bcrypt.compare('WrongPassword123!', hash);
    expect(isMatch).toBe(false);
  });
});
