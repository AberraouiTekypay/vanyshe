import { describe, it, expect } from 'vitest';
import { validatePassword, signToken, verifyToken } from '../src/lib/admin-auth';

describe('Admin Authentication & Security', () => {
  it('validates default admin password correctly', () => {
    expect(validatePassword('vanyshe-founder-2026')).toBe(true);
    expect(validatePassword('wrong-password')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });

  it('signs and verifies session tokens with HMAC signature', () => {
    const timestamp = `${Date.now()}`;
    const token = signToken(timestamp);

    expect(token).toContain('.');
    expect(verifyToken(token)).toBe(true);

    // Tampered token must fail
    const tampered = token.slice(0, -4) + 'abcd';
    expect(verifyToken(tampered)).toBe(false);

    // Invalid format must fail
    expect(verifyToken('invalid-token-without-dot')).toBe(false);
  });

  it('rejects expired tokens older than 12 hours', () => {
    const oldTimestamp = `${Date.now() - 13 * 60 * 60 * 1000}`;
    const expiredToken = signToken(oldTimestamp);

    expect(verifyToken(expiredToken)).toBe(false);
  });
});
