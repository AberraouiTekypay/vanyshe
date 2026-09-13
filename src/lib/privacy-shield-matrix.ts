import { ShieldSupportLevel } from './types';

/**
 * TECHNICAL AUDIT & PLATFORM COMPATIBILITY MATRIX
 *
 * Core Principle:
 * Vanyshe cannot guarantee that another person cannot record their screen.
 * It can, however, prevent Vanyshe itself from recording, detect certain supported
 * capture mechanisms, warn participants, and allow room policies to respond to detected capture.
 *
 * Never make claims that exceed browser/OS capabilities.
 */

export interface BrowserCapabilityEntry {
  platform: string;
  browser: string;
  printScreenDetection: boolean;
  shortcutAttemptDetection: boolean;
  inPageScreenShareDetection: boolean;
  osLevelRecorderDetection: boolean; // Strictly false for all web browsers (OS sandboxed)
  nativeScreenshotDetection: boolean; // Strictly false for all web browsers (no web API)
  supportLevel: ShieldSupportLevel;
  notes: string;
}

export const CAPTURE_COMPATIBILITY_MATRIX: BrowserCapabilityEntry[] = [
  {
    platform: 'Windows Desktop',
    browser: 'Chrome / Edge',
    printScreenDetection: true,
    shortcutAttemptDetection: true, // Detects Meta+Shift+S key sequence & window blur
    inPageScreenShareDetection: true,
    osLevelRecorderDetection: false, // Cannot detect OBS, Windows Game Bar, Snipping Tool without shortcut
    nativeScreenshotDetection: false,
    supportLevel: 'ACTIVE',
    notes: 'PrintScreen keyup/keydown and keyboard shortcuts detectable. External OS recorders cannot be detected.',
  },
  {
    platform: 'Windows Desktop',
    browser: 'Firefox',
    printScreenDetection: true,
    shortcutAttemptDetection: true,
    inPageScreenShareDetection: true,
    osLevelRecorderDetection: false,
    nativeScreenshotDetection: false,
    supportLevel: 'ACTIVE',
    notes: 'PrintScreen key event supported. Heuristic detection on shortcut sequences.',
  },
  {
    platform: 'macOS Desktop',
    browser: 'Chrome / Edge',
    printScreenDetection: false, // Mac keyboards do not have a PrintScreen key
    shortcutAttemptDetection: true, // Detects Cmd+Shift sequence followed by window blur
    inPageScreenShareDetection: true,
    osLevelRecorderDetection: false, // Cannot detect QuickTime, Screenflow, OBS
    nativeScreenshotDetection: false,
    supportLevel: 'ACTIVE',
    notes: 'Shortcuts (Cmd+Shift+3/4/5) trigger blur/visibility transitions. OS-level tools are undetectable.',
  },
  {
    platform: 'macOS Desktop',
    browser: 'Safari',
    printScreenDetection: false,
    shortcutAttemptDetection: true,
    inPageScreenShareDetection: true,
    osLevelRecorderDetection: false,
    nativeScreenshotDetection: false,
    supportLevel: 'ACTIVE',
    notes: 'In-page display capture detectable. Shortcut heuristics supported via window focus monitoring.',
  },
  {
    platform: 'Linux Desktop',
    browser: 'Chrome / Firefox',
    printScreenDetection: true,
    shortcutAttemptDetection: true,
    inPageScreenShareDetection: true,
    osLevelRecorderDetection: false,
    nativeScreenshotDetection: false,
    supportLevel: 'ACTIVE',
    notes: 'PrintScreen keys mapped by X11/Wayland. Desktop recorders (SimpleScreenRecorder, OBS) undetectable.',
  },
  {
    platform: 'iOS (iPhone / iPad)',
    browser: 'Safari / All WebKit',
    printScreenDetection: false,
    shortcutAttemptDetection: false,
    inPageScreenShareDetection: false, // Web getDisplayMedia restricted on mobile Safari
    osLevelRecorderDetection: false, // iOS Screen Recording is strictly UIKit native, not exposed to WebKit DOM
    nativeScreenshotDetection: false, // iOS screenshot notifications not exposed to Safari web pages
    supportLevel: 'LIMITED',
    notes: 'Vanyshe cannot reliably detect screenshots or recordings performed by the operating system on iOS.',
  },
  {
    platform: 'Android Mobile',
    browser: 'Chrome / Firefox / Samsung',
    printScreenDetection: false,
    shortcutAttemptDetection: false,
    inPageScreenShareDetection: false,
    osLevelRecorderDetection: false, // Android MediaProjection is native Java/Kotlin, not Web DOM
    nativeScreenshotDetection: false, // Android OS screenshots do not fire web events
    supportLevel: 'LIMITED',
    notes: 'Vanyshe cannot reliably detect screenshots or recordings performed by the operating system on Android.',
  },
];

export interface PlatformCaptureCapabilities {
  os: 'Windows' | 'macOS' | 'Linux' | 'iOS' | 'Android' | 'Unknown';
  browser: 'Chrome' | 'Edge' | 'Firefox' | 'Safari' | 'Unknown';
  isMobile: boolean;
  printScreenDetection: boolean;
  shortcutAttemptDetection: boolean;
  inPageScreenShareDetection: boolean;
  osLevelRecorderDetection: boolean;
  nativeScreenshotDetection: boolean;
  supportLevel: ShieldSupportLevel;
  disclosure: string;
}

/**
 * Evaluates the current client environment and returns the honest capabilities.
 */
export function getClientCaptureCapabilities(): PlatformCaptureCapabilities {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      os: 'Unknown',
      browser: 'Unknown',
      isMobile: false,
      printScreenDetection: false,
      shortcutAttemptDetection: false,
      inPageScreenShareDetection: false,
      osLevelRecorderDetection: false,
      nativeScreenshotDetection: false,
      supportLevel: 'UNSUPPORTED',
      disclosure: 'Environment detection unavailable in server-side context.',
    };
  }

  const ua = navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isMac = /Macintosh|Mac OS X/i.test(ua);
  const isWindows = /Windows NT/i.test(ua);
  const isLinux = /Linux/i.test(ua) && !isAndroid;

  let os: PlatformCaptureCapabilities['os'] = 'Unknown';
  if (isIOS) os = 'iOS';
  else if (isAndroid) os = 'Android';
  else if (isWindows) os = 'Windows';
  else if (isMac) os = 'macOS';
  else if (isLinux) os = 'Linux';

  let browser: PlatformCaptureCapabilities['browser'] = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';

  if (isMobile) {
    return {
      os,
      browser,
      isMobile: true,
      printScreenDetection: false,
      shortcutAttemptDetection: false,
      inPageScreenShareDetection: false,
      osLevelRecorderDetection: false,
      nativeScreenshotDetection: false,
      supportLevel: 'LIMITED',
      disclosure:
        'Vanyshe cannot reliably detect screenshots or recordings performed by the operating system on this mobile device.',
    };
  }

  return {
    os,
    browser,
    isMobile: false,
    printScreenDetection: isWindows || isLinux,
    shortcutAttemptDetection: true,
    inPageScreenShareDetection: typeof navigator.mediaDevices?.getDisplayMedia === 'function',
    osLevelRecorderDetection: false,
    nativeScreenshotDetection: false,
    supportLevel: 'ACTIVE',
    disclosure:
      'Capture detection is active where supported by this browser. External cameras, HDMI taps, and independent OS recording tools cannot be detected by any web browser.',
  };
}
