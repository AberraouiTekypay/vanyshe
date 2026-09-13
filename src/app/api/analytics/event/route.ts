import { NextResponse } from 'next/server';
import { recordEvent } from '@/lib/analytics';

const COUNTRY_NAMES: Record<string, string> = {
  MA: 'Morocco',
  FR: 'France',
  ES: 'Spain',
  AE: 'United Arab Emirates',
  US: 'United States',
  DE: 'Germany',
  GB: 'United Kingdom',
  CA: 'Canada',
  SA: 'Saudi Arabia',
  EG: 'Egypt',
  DZ: 'Algeria',
  TN: 'Tunisia',
  NL: 'Netherlands',
  BE: 'Belgium',
  CH: 'Switzerland',
  QA: 'Qatar',
  KW: 'Kuwait',
};

export async function POST(request: Request) {
  try {
    const raw = await request.json();

    // Extract coarse country from platform headers if not provided
    if (!raw.country || raw.country === 'Unknown') {
      const code =
        request.headers.get('x-vercel-ip-country') ||
        request.headers.get('cf-ipcountry') ||
        request.headers.get('x-country-code');

      if (code && COUNTRY_NAMES[code.toUpperCase()]) {
        raw.country = COUNTRY_NAMES[code.toUpperCase()];
      } else if (code) {
        raw.country = code.toUpperCase();
      }
    }

    const result = recordEvent(raw);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 400 });
  }
}
