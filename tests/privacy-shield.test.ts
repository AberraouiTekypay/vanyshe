import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CAPTURE_COMPATIBILITY_MATRIX,
  getClientCaptureCapabilities,
  BrowserCapabilityEntry,
} from '../src/lib/privacy-shield-matrix';
import {
  CaptureDetector,
  calculateShieldStatus,
} from '../src/lib/privacy-shield';
import {
  createRoom,
  getRoom,
  updateRoomPolicy,
  _resetStoreForTesting,
} from '../src/lib/rooms';
import {
  recordEvent,
  _resetEventsForTesting,
} from '../src/lib/analytics';
import { CaptureDetectionEvent } from '../src/lib/types';

describe('Vanyshe Privacy Shield & Capture Detection', () => {
  beforeEach(() => {
    _resetStoreForTesting();
    _resetEventsForTesting();
    vi.restoreAllMocks();
  });

  describe('1. Platform Compatibility Matrix & Technical Honesty', () => {
    it('contains platform entries for Windows, macOS, Linux, iOS, and Android', () => {
      const platforms = CAPTURE_COMPATIBILITY_MATRIX.map((c: BrowserCapabilityEntry) => c.platform);
      expect(platforms.some((p) => p.includes('Windows'))).toBe(true);
      expect(platforms.some((p) => p.includes('macOS'))).toBe(true);
      expect(platforms.some((p) => p.includes('Linux'))).toBe(true);
      expect(platforms.some((p) => p.includes('iOS'))).toBe(true);
      expect(platforms.some((p) => p.includes('Android'))).toBe(true);
    });

    it('NEVER claims detection for external OS-level recorders across any platform', () => {
      // Technical honesty invariant: OS process isolation prevents web pages from inspecting background apps (OBS, QuickTime, Game Bar)
      for (const entry of CAPTURE_COMPATIBILITY_MATRIX) {
        expect(entry.osLevelRecorderDetection).toBe(false);
      }
    });

    it('NEVER claims detection for mobile native hardware screenshot events', () => {
      // Technical honesty invariant: Native buttons bypass web DOM events on iOS and Android
      for (const entry of CAPTURE_COMPATIBILITY_MATRIX) {
        expect(entry.nativeScreenshotDetection).toBe(false);
      }
    });

    it('returns UNSUPPORTED with clear disclosure in SSR/Node environments', () => {
      const caps = getClientCaptureCapabilities();
      expect(caps.supportLevel).toBe('UNSUPPORTED');
      expect(caps.os).toBe('Unknown');
      expect(caps.browser).toBe('Unknown');
      expect(caps.disclosure).toContain('Environment detection unavailable');
    });

    it('calculates shield status correctly based on policy and mobile detection', () => {
      // Policy OFF always yields OFF
      expect(
        calculateShieldStatus('OFF', {
          os: 'Windows',
          browser: 'Chrome',
          isMobile: false,
          printScreenDetection: true,
          shortcutAttemptDetection: true,
          inPageScreenShareDetection: true,
          osLevelRecorderDetection: false,
          nativeScreenshotDetection: false,
          supportLevel: 'ACTIVE',
          disclosure: 'Active on desktop',
        })
      ).toBe('OFF');

      // Mobile devices yield LIMITED
      expect(
        calculateShieldStatus('DETECT_ALERT', {
          os: 'iOS',
          browser: 'Safari',
          isMobile: true,
          printScreenDetection: false,
          shortcutAttemptDetection: false,
          inPageScreenShareDetection: false,
          osLevelRecorderDetection: false,
          nativeScreenshotDetection: false,
          supportLevel: 'LIMITED',
          disclosure: 'Mobile limitation',
        })
      ).toBe('LIMITED');

      // Desktop with DETECT_ALERT yields ACTIVE
      expect(
        calculateShieldStatus('DETECT_ALERT', {
          os: 'Windows',
          browser: 'Chrome',
          isMobile: false,
          printScreenDetection: true,
          shortcutAttemptDetection: true,
          inPageScreenShareDetection: true,
          osLevelRecorderDetection: false,
          nativeScreenshotDetection: false,
          supportLevel: 'ACTIVE',
          disclosure: 'Desktop active',
        })
      ).toBe('ACTIVE');
    });
  });

  describe('2. CaptureDetector Engine & Event Heuristics', () => {
    it('does not emit events or attach listeners when policy is OFF', () => {
      const events: CaptureDetectionEvent[] = [];
      const detector = new CaptureDetector('OFF', (e) => events.push(e));

      detector.start();
      expect(events.length).toBe(0);

      // Triggering an external capture report should be ignored
      detector.reportExternalCapture();
      expect(events.length).toBe(0);
    });

    it('emits screen_share_detected when Vanyshe intentional screen sharing starts', () => {
      const events: CaptureDetectionEvent[] = [];
      const detector = new CaptureDetector('DETECT_ALERT', (e) => events.push(e));

      detector.setVanysheScreenSharing(true);

      const shareEvent = events.find((e) => e.type === 'screen_share_detected');
      expect(shareEvent).toBeDefined();
      expect(shareEvent?.details).toContain('You are sharing your screen with the room');
      expect(shareEvent?.reliability).toBe('confirmed');
    });

    it('distinguishes Vanyshe intentional sharing from external capture', () => {
      const events: CaptureDetectionEvent[] = [];
      const detector = new CaptureDetector('DETECT_ALERT', (e) => events.push(e));

      // Active Vanyshe share prevents spurious external capture alert
      detector.setVanysheScreenSharing(true);
      events.length = 0; // reset

      detector.reportExternalCapture();
      expect(events.length).toBe(0);

      // Inactive Vanyshe share allows external capture alert
      detector.setVanysheScreenSharing(false);
      detector.reportExternalCapture();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('screen_capture_detected');
    });

    it('labels keyboard shortcut attempts strictly as "Possible screenshot shortcut detected"', () => {
      // Simulate DOM keyboard event in simulated window environment
      const events: CaptureDetectionEvent[] = [];
      const detector = new CaptureDetector('DETECT_ALERT', (e) => events.push(e));

      // Invoke private handler directly via mock event
      const mockWinShiftS = {
        metaKey: true,
        shiftKey: true,
        ctrlKey: false,
        key: 's',
        code: 'KeyS',
      } as unknown as KeyboardEvent;

      (detector as any).handleKeyDown(mockWinShiftS);

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('screenshot_attempt_detected');
      expect(events[0].reliability).toBe('possible');
      expect(events[0].details).toContain('Possible screenshot shortcut detected');
      // Must NOT claim "Screenshot captured"
      expect(events[0].details).not.toContain('Screenshot captured');
    });

    it('detects PrintScreen keydown and keyup', () => {
      const events: CaptureDetectionEvent[] = [];
      const detector = new CaptureDetector('DETECT_ALERT', (e) => events.push(e));

      const mockPrintScreenDown = {
        key: 'PrintScreen',
        code: 'PrintScreen',
      } as unknown as KeyboardEvent;

      (detector as any).handleKeyDown(mockPrintScreenDown);

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('print_screen_detected');
      expect(events[0].reliability).toBe('probable');
      expect(events[0].details).toContain('Print Screen key was pressed');

      const mockPrintScreenUp = {
        key: 'PrintScreen',
        code: 'PrintScreen',
      } as unknown as KeyboardEvent;

      (detector as any).handleKeyUp(mockPrintScreenUp);

      expect(events.length).toBe(2);
      expect(events[1].type).toBe('print_screen_detected');
      expect(events[1].details).toContain('Print Screen key was released');
    });
  });

  describe('3. Room Policy Management & Persistence', () => {
    it('creates rooms with specified capture policy and watermark preferences', () => {
      const { room } = createRoom({
        capturePolicy: 'STRICT',
        watermarkEnabled: true,
      });

      expect(room.capturePolicy).toBe('STRICT');
      expect(room.watermarkEnabled).toBe(true);

      const fetched = getRoom(room.id);
      expect(fetched?.capturePolicy).toBe('STRICT');
      expect(fetched?.watermarkEnabled).toBe(true);
    });

    it('allows room creator to update capture policy and watermark settings', () => {
      const { room, creatorToken } = createRoom({
        capturePolicy: 'DETECT_ALERT',
        watermarkEnabled: false,
      });

      // Update to STRICT with watermark enabled
      const updateRes = updateRoomPolicy(room.id, creatorToken, 'STRICT', true);
      expect(updateRes.success).toBe(true);
      expect(updateRes.room?.capturePolicy).toBe('STRICT');
      expect(updateRes.room?.watermarkEnabled).toBe(true);

      const fetched = getRoom(room.id);
      expect(fetched?.capturePolicy).toBe('STRICT');
      expect(fetched?.watermarkEnabled).toBe(true);
    });

    it('rejects policy updates from unauthorized participants', () => {
      const { room } = createRoom({ capturePolicy: 'DETECT_ALERT' });

      const updateRes = updateRoomPolicy(room.id, 'unauthorized_token', 'OFF', false);
      expect(updateRes.success).toBe(false);
      expect(updateRes.error).toContain('Unauthorized');

      const fetched = getRoom(room.id);
      expect(fetched?.capturePolicy).toBe('DETECT_ALERT'); // Unchanged
    });
  });

  describe('4. Privacy-Preserving Analytics for Privacy Shield', () => {
    it('records Privacy Shield events with anonymous metadata only', () => {
      const res1 = recordEvent({
        eventName: 'privacy_shield_policy_set',
        anonymousId: 'anon_shield_user1',
        roomSafeRef: 'room_ref_abc',
        language: 'en',
      });
      expect(res1.success).toBe(true);

      const res2 = recordEvent({
        eventName: 'capture_event_detected',
        anonymousId: 'anon_shield_user1',
        roomSafeRef: 'room_ref_abc',
        errorCategory: 'print_screen_detected',
        language: 'en',
      });
      expect(res2.success).toBe(true);

      const res3 = recordEvent({
        eventName: 'privacy_shield_acknowledged',
        anonymousId: 'anon_shield_user2',
        roomSafeRef: 'room_ref_abc',
        language: 'en',
      });
      expect(res3.success).toBe(true);
    });

    it('rejects any attempt to attach personal data or media payloads to Privacy Shield events', () => {
      const leakResult = recordEvent({
        eventName: 'capture_event_detected',
        anonymousId: 'anon_shield_user1',
        name: 'Alice Victim', // Forbidden field!
      });
      expect(leakResult.success).toBe(false);
      expect(leakResult.error).toContain('Forbidden');

      const mediaResult = recordEvent({
        eventName: 'capture_event_detected',
        anonymousId: 'anon_shield_user1',
        video: 'screenshot_raw_bytes', // Forbidden field!
      });
      expect(mediaResult.success).toBe(false);
      expect(mediaResult.error).toContain('Forbidden field detected');
    });
  });
});
