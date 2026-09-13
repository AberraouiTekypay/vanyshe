import crypto from 'crypto';

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Generates a cryptographically strong, non-sequential, URL-safe room identifier.
 * Example: vny-7Kx9-2mQa-P8zt
 */
export function generateRoomId(): string {
  const bytes = crypto.randomBytes(16);
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  // format into clean groups: vny-xxxx-xxxx-xxxx
  return `vny-${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8, 12)}`;
}

/**
 * Generates a high-entropy secret token for the room creator.
 * Held only in client sessionStorage, validated for administrative room actions (like destroy).
 */
export function generateCreatorToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * Generates an anonymous product identifier (e.g. anon_8f72c1...)
 * Does not link to any email, IP or personal information.
 */
export function generateAnonymousId(): string {
  return `anon_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * One-way cryptographic hash of a roomId for product analytics.
 * Ensures the analytics pipeline only records an opaque, non-reversible reference,
 * never the actual room link or plain room ID.
 */
export function hashRoomId(roomId: string): string {
  return crypto
    .createHash('sha256')
    .update(`vanyshe_salt_${roomId.trim()}`)
    .digest('hex')
    .slice(0, 16);
}
