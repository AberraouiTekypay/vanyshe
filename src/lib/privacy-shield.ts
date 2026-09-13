'use client';

import {
  CaptureDetectionEvent,
  CaptureEventType,
  CapturePolicy,
  ShieldSupportLevel,
} from './types';
import { getClientCaptureCapabilities, PlatformCaptureCapabilities } from './privacy-shield-matrix';

export type CaptureEventHandler = (event: CaptureDetectionEvent) => void;

/**
 * Vanyshe Privacy Shield Client Engine
 *
 * Core Responsibility:
 * 1. Monitors supported browser capture activity without aggressive polling.
 * 2. Distinguishes intentional Vanyshe screen-sharing from external capture.
 * 3. Never claims detection for unsupported OS/hardware capture.
 * 4. Labels attempted shortcuts strictly as "Possible screenshot shortcut detected".
 */
export class CaptureDetector {
  private policy: CapturePolicy;
  private onEvent: CaptureEventHandler;
  private isRunning: boolean = false;
  private isVanysheScreenSharing: boolean = false;
  private lastShortcutSequenceTime: number = 0;
  private lastSuspectedKey: string = '';
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundBlur: () => void;
  private boundVisibilityChange: () => void;

  constructor(policy: CapturePolicy = 'DETECT_ALERT', onEvent: CaptureEventHandler) {
    this.policy = policy;
    this.onEvent = onEvent;

    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.boundBlur = this.handleWindowBlur.bind(this);
    this.boundVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;

    if (this.policy === 'OFF') {
      return;
    }

    this.isRunning = true;
    window.addEventListener('keydown', this.boundKeyDown, true);
    window.addEventListener('keyup', this.boundKeyUp, true);
    window.addEventListener('blur', this.boundBlur);
    document.addEventListener('visibilitychange', this.boundVisibilityChange);

    this.emitEvent({
      type: 'capture_detection_started',
      timestamp: Date.now(),
      source: 'local',
      reliability: 'confirmed',
      details: 'Capture monitoring initialized according to room policy.',
    });
  }

  public stop(): void {
    if (!this.isRunning || typeof window === 'undefined') return;

    window.removeEventListener('keydown', this.boundKeyDown, true);
    window.removeEventListener('keyup', this.boundKeyUp, true);
    window.removeEventListener('blur', this.boundBlur);
    document.removeEventListener('visibilitychange', this.boundVisibilityChange);
    this.isRunning = false;

    this.emitEvent({
      type: 'capture_detection_stopped',
      timestamp: Date.now(),
      source: 'local',
      reliability: 'confirmed',
      details: 'Capture monitoring stopped.',
    });
  }

  public setPolicy(policy: CapturePolicy): void {
    this.policy = policy;
    if (policy === 'OFF' && this.isRunning) {
      this.stop();
    } else if (policy !== 'OFF' && !this.isRunning) {
      this.start();
    }
  }

  public setVanysheScreenSharing(active: boolean): void {
    this.isVanysheScreenSharing = active;
    if (active) {
      this.emitEvent({
        type: 'screen_share_detected',
        timestamp: Date.now(),
        source: 'local',
        reliability: 'confirmed',
        details: 'You are sharing your screen with the room.',
      });
    }
  }

  /**
   * Called when an unrecognized or external getDisplayMedia or tab capture is observed.
   */
  public reportExternalCapture(): void {
    if (this.isVanysheScreenSharing) return;

    this.emitEvent({
      type: 'screen_capture_detected',
      timestamp: Date.now(),
      source: 'local',
      reliability: 'confirmed',
      details: 'A supported capture mechanism may be active on this device.',
    });
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.policy === 'OFF') return;

    // 1. Windows / Linux Print Screen key
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
      this.emitEvent({
        type: 'print_screen_detected',
        timestamp: Date.now(),
        source: 'local',
        reliability: 'probable',
        details: 'Print Screen key was pressed on this device.',
      });
      return;
    }

    // 2. Windows Snipping Tool (Win + Shift + S) Heuristic
    // Note: Windows OS intercepts the Win key, but browser sees Shift + S with meta/ctrl
    if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
      this.lastShortcutSequenceTime = Date.now();
      this.lastSuspectedKey = e.key;

      if (e.key === 's' || e.key === 'S') {
        this.emitEvent({
          type: 'screenshot_attempt_detected',
          timestamp: Date.now(),
          source: 'local',
          reliability: 'possible',
          details: 'Possible screenshot shortcut detected (Shift + S shortcut sequence).',
        });
        return;
      }

      // 3. macOS Screenshot shortcuts (Cmd + Shift + 3 / 4 / 5)
      if (['3', '4', '5'].includes(e.key)) {
        this.emitEvent({
          type: 'screenshot_attempt_detected',
          timestamp: Date.now(),
          source: 'local',
          reliability: 'possible',
          details: `Possible screenshot shortcut detected (Cmd + Shift + ${e.key}).`,
        });
        return;
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
      this.emitEvent({
        type: 'print_screen_detected',
        timestamp: Date.now(),
        source: 'local',
        reliability: 'probable',
        details: 'Print Screen key was released on this device.',
      });
    }
  }

  private handleWindowBlur(): void {
    const now = Date.now();
    // If the window lost focus within 1200ms of a suspected shortcut modifier combination,
    // this strongly indicates an OS screenshot overlay or tool popped up (e.g. Snipping Tool).
    if (now - this.lastShortcutSequenceTime < 1200 && this.policy !== 'OFF') {
      this.emitEvent({
        type: 'screenshot_attempt_detected',
        timestamp: now,
        source: 'local',
        reliability: 'possible',
        details: 'Possible screenshot shortcut detected — window focus lost following capture key sequence.',
      });
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden && this.policy !== 'OFF') {
      const now = Date.now();
      if (now - this.lastShortcutSequenceTime < 1200) {
        this.emitEvent({
          type: 'browser_capture_state_changed',
          timestamp: now,
          source: 'local',
          reliability: 'possible',
          details: 'Document visibility changed immediately following capture key sequence.',
        });
      }
    }
  }

  private emitEvent(event: CaptureDetectionEvent): void {
    if (this.policy === 'OFF') return;
    this.onEvent(event);
  }
}

/**
 * Calculates current room shield status based on platform and room policy.
 */
export function calculateShieldStatus(
  policy: CapturePolicy,
  capabilities: PlatformCaptureCapabilities
): ShieldSupportLevel {
  if (policy === 'OFF') return 'OFF';
  if (capabilities.isMobile) return 'LIMITED';
  return capabilities.supportLevel;
}
