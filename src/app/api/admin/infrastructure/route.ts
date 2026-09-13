import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { computeInfrastructureMetrics } from '@/lib/infrastructure';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const infra = computeInfrastructureMetrics();
  return NextResponse.json(infra);
}
