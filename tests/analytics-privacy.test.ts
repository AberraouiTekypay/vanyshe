import { describe, it, expect, beforeEach } from 'vitest';
import { recordEvent, computeDashboardMetrics, _resetEventsForTesting } from '../src/lib/analytics';
import { hashRoomId, generateAnonymousId } from '../src/lib/crypto';

describe('Analytics Privacy & Separation Tests', () => {
  beforeEach(() => {
    _resetEventsForTesting();
  });

  it('rejects events containing chat messages or text content', () => {
    const result = recordEvent({
      eventName: 'page_view',
      anonymousId: 'anon_12345678',
      chat: 'Hello, this is a secret chat message',
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Forbidden field detected');
  });

  it('rejects events containing audio or video payloads', () => {
    const audioResult = recordEvent({
      eventName: 'call_started',
      anonymousId: 'anon_12345678',
      audio: 'base64-encoded-audio-bytes',
    });
    expect(audioResult.success).toBe(false);
    expect(audioResult.error).toContain('Forbidden field detected');

    const videoResult = recordEvent({
      eventName: 'call_started',
      anonymousId: 'anon_12345678',
      video: 'raw-video-frame',
    });
    expect(videoResult.success).toBe(false);
    expect(videoResult.error).toContain('Forbidden field detected');
  });

  it('rejects events containing transcripts or screen-share payloads', () => {
    const transcriptResult = recordEvent({
      eventName: 'call_ended',
      anonymousId: 'anon_12345678',
      transcript: 'Automated speech-to-text content',
    });
    expect(transcriptResult.success).toBe(false);
    expect(transcriptResult.error).toContain('Forbidden field detected');

    const screenResult = recordEvent({
      eventName: 'screen_share_started',
      anonymousId: 'anon_12345678',
      payload: { image: 'screen-snapshot' },
    });
    expect(screenResult.success).toBe(false);
    expect(screenResult.error).toContain('Forbidden field detected');
  });

  it('rejects events containing passwords, tokens, emails, or names', () => {
    const pwdResult = recordEvent({
      eventName: 'page_view',
      password: 'secretPassword123',
    });
    expect(pwdResult.success).toBe(false);

    const emailResult = recordEvent({
      eventName: 'page_view',
      email: 'user@example.com',
    });
    expect(emailResult.success).toBe(false);

    const nameResult = recordEvent({
      eventName: 'page_view',
      name: 'John Doe',
    });
    expect(nameResult.success).toBe(false);
  });

  it('rejects invalid or unauthorized event names', () => {
    const result = recordEvent({
      eventName: 'unauthorized_hacker_event' as any,
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid event name');
  });

  it('hashes room IDs into non-reversible opaque tokens', () => {
    const roomId = 'vny-7Kx9-2mQa-P8zt';
    const hash = hashRoomId(roomId);

    expect(hash).not.toContain('vny-');
    expect(hash).not.toContain(roomId);
    expect(hash.length).toBe(16);

    // Consistency
    expect(hashRoomId(roomId)).toBe(hash);
  });

  it('generates random anonymous IDs starting with anon_', () => {
    const anon1 = generateAnonymousId();
    const anon2 = generateAnonymousId();

    expect(anon1).toMatch(/^anon_[a-f0-9]{24}$/);
    expect(anon2).toMatch(/^anon_[a-f0-9]{24}$/);
    expect(anon1).not.toBe(anon2);
  });

  it('records valid privacy-safe events and computes metrics', () => {
    const res = recordEvent({
      eventName: 'room_created',
      anonymousId: 'anon_test123',
      roomSafeRef: 'room_abc123',
      language: 'en',
      deviceCategory: 'desktop',
      browserCategory: 'Chrome',
      referrerCategory: 'direct',
    });

    expect(res.success).toBe(true);

    const metrics = computeDashboardMetrics();
    expect(metrics.kpis).toBeDefined();
    expect(metrics.funnel).toBeDefined();
    expect(metrics.technicalHealth).toBeDefined();
  });
});
