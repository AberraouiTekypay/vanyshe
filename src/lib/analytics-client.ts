import { EventName, SupportedLocale } from './types';

const ANON_KEY = 'vanyshe_anon_id';
const SESS_KEY = 'vanyshe_session_id';

export function getOrCreateAnonymousId(): string {
  if (typeof window === 'undefined') return 'anon_server';
  let anonId = localStorage.getItem(ANON_KEY);
  if (!anonId || !anonId.startsWith('anon_')) {
    anonId = `anon_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`;
    localStorage.setItem(ANON_KEY, anonId);
  }
  return anonId;
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'sess_server';
  let sessId = sessionStorage.getItem(SESS_KEY);
  if (!sessId) {
    sessId = `sess_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESS_KEY, sessId);
  }
  return sessId;
}

export function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function getBrowserCategory(): string {
  if (typeof window === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Other';
}

export function getReferrerCategory(): 'direct' | 'search' | 'referral' | 'shared_link' | 'social' {
  if (typeof window === 'undefined') return 'direct';
  const ref = document.referrer.toLowerCase();
  if (!ref) return 'direct';
  if (ref.includes('/r/')) return 'shared_link';
  if (ref.includes('google') || ref.includes('bing') || ref.includes('duckduckgo') || ref.includes('yahoo')) {
    return 'search';
  }
  if (ref.includes('t.co') || ref.includes('twitter') || ref.includes('x.com') || ref.includes('linkedin') || ref.includes('reddit')) {
    return 'social';
  }
  return 'referral';
}

/**
 * Tracks a privacy-preserving first-party product event.
 * Absolutely never includes conversation content, audio, video, transcripts, or messages.
 */
export function trackEvent(
  eventName: EventName,
  options: {
    roomSafeRef?: string;
    language?: SupportedLocale;
    durationSeconds?: number;
    errorCategory?: string;
  } = {}
) {
  if (typeof window === 'undefined') return;

  const payload = {
    eventName,
    anonymousId: getOrCreateAnonymousId(),
    sessionId: getOrCreateSessionId(),
    roomSafeRef: options.roomSafeRef,
    language: options.language || (document.documentElement.lang as SupportedLocale) || 'en',
    deviceCategory: getDeviceCategory(),
    browserCategory: getBrowserCategory(),
    referrerCategory: getReferrerCategory(),
    durationSeconds: options.durationSeconds,
    errorCategory: options.errorCategory,
  };

  try {
    const jsonStr = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/event', blob);
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Non-blocking telemetry
  }
}
