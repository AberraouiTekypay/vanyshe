import { NextResponse } from 'next/server';
import { validatePassword, createAdminSession, clearAdminSession, isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, password } = body;

    if (action === 'login') {
      if (!password || !validatePassword(password)) {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }

      await createAdminSession();
      return NextResponse.json({ success: true, message: 'Authenticated successfully' });
    }

    if (action === 'logout') {
      await clearAdminSession();
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error during authentication' }, { status: 500 });
  }
}
