import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { computeDashboardMetrics, generateMetricsCsv } from '@/lib/analytics';

export async function GET(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (format === 'csv') {
    const csv = generateMetricsCsv();
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="vanyshe-aggregate-metrics-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const metrics = computeDashboardMetrics();
  return NextResponse.json(metrics);
}
