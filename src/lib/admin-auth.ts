import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vanyshe-founder-2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'vanyshe_secure_admin_secret_key_8f72a9103c';
const COOKIE_NAME = 'vanyshe_admin_session';

export function signToken(data: string): string {
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('hex');
  return `${data}.${hmac}`;
}

export function verifyToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  const [data, signature] = token.split('.');
  const expectedHmac = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('hex');
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac))) {
    const timestamp = parseInt(data, 10);
    // 12 hour expiry
    return Date.now() - timestamp < 12 * 60 * 60 * 1000;
  }
  return false;
}

export function validatePassword(password: string): boolean {
  if (!password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createAdminSession(): Promise<string> {
  const token = signToken(`${Date.now()}`);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 12 * 60 * 60, // 12 hours
  });
  return token;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return false;
  }
  return verifyToken(sessionCookie.value);
}
