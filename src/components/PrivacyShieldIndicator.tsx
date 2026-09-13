'use client';

import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  X,
  Lock,
  Check,
  AlertTriangle,
  Info,
  Radio,
  Eye,
  Camera,
  Server,
  Zap,
} from 'lucide-react';
import { CapturePolicy, ShieldSupportLevel } from '@/lib/types';
import { getClientCaptureCapabilities } from '@/lib/privacy-shield-matrix';

interface PrivacyShieldIndicatorProps {
  policy: CapturePolicy;
  supportLevel: ShieldSupportLevel;
  isCreator?: boolean;
  watermarkEnabled?: boolean;
  onPolicyChange?: (newPolicy: CapturePolicy) => void;
  onWatermarkToggle?: (enabled: boolean) => void;
  lang?: 'en' | 'fr' | 'ar';
}

export default function PrivacyShieldIndicator({
  policy,
  supportLevel,
  isCreator = false,
  watermarkEnabled = false,
  onPolicyChange,
  onWatermarkToggle,
  lang = 'en',
}: PrivacyShieldIndicatorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const capabilities = getClientCaptureCapabilities();

  // Status visual attributes
  const getStatusBadge = () => {
    if (policy === 'OFF') {
      return {
        label: 'Privacy Shield: Off',
        color: 'text-zinc-400 border-zinc-800 bg-zinc-900/60',
        dot: 'bg-zinc-500',
        icon: <ShieldX className="w-3.5 h-3.5 text-zinc-400" />,
      };
    }
    if (supportLevel === 'LIMITED') {
      return {
        label: 'Privacy Shield: Limited',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        dot: 'bg-amber-400',
        icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
      };
    }
    if (supportLevel === 'UNSUPPORTED') {
      return {
        label: 'Privacy Shield: Unsupported',
        color: 'text-zinc-400 border-zinc-800 bg-zinc-900/60',
        dot: 'bg-zinc-500',
        icon: <ShieldX className="w-3.5 h-3.5 text-zinc-400" />,
      };
    }
    return {
      label: 'Privacy Shield: Active',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      dot: 'bg-emerald-400',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    };
  };

  const badge = getStatusBadge();

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setModalOpen(true)}
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer hover:opacity-90 shadow-xs ${badge.color}`}
        title="Click to view Privacy Shield capabilities and policies"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
        <span>{badge.label}</span>
        {policy !== 'OFF' && (
          <span className="opacity-70 text-[10px] uppercase font-sans">
            ({policy === 'STRICT' ? 'Strict' : 'Alert'})
          </span>
        )}
      </button>

      {/* Inspector Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 text-white p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Vanyshe Privacy Shield</h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Detection Status: <span className="text-emerald-400">{badge.label}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Principle Callout */}
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 mb-6 text-xs text-zinc-300 leading-relaxed">
              <p className="font-semibold text-emerald-300 mb-1">
                This conversation is not recorded by Vanyshe.
              </p>
              <p className="text-zinc-400 text-[11px]">
                Vanyshe can detect certain browser-level capture activity, but no website can detect every possible form of recording or physical photography.
              </p>
            </div>

            {/* Section 1: Room Capture Policy */}
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Room Capture Policy
              </h3>

              {isCreator && onPolicyChange ? (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onPolicyChange('OFF')}
                    className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                      policy === 'OFF'
                        ? 'border-zinc-500 bg-zinc-800 text-white shadow-xs'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="font-bold">Off</div>
                    <div className="text-[10px] text-zinc-500 mt-1">No capture checks</div>
                  </button>

                  <button
                    onClick={() => onPolicyChange('DETECT_ALERT')}
                    className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                      policy === 'DETECT_ALERT'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-xs'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="font-bold">Detect & Alert</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Notify on capture</div>
                  </button>

                  <button
                    onClick={() => onPolicyChange('STRICT')}
                    className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                      policy === 'STRICT'
                        ? 'border-red-500 bg-red-500/10 text-red-300 shadow-xs'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="font-bold">Strict</div>
                    <div className="text-[10px] text-red-400/80 mt-1">Pause on capture</div>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between font-mono">
                  <span>Policy enforced:</span>
                  <span className="font-bold text-emerald-400">
                    {policy === 'STRICT' ? 'Strict Privacy (Pause Room)' : policy === 'OFF' ? 'Off' : 'Detect & Alert'}
                  </span>
                </div>
              )}

              {/* Watermark Toggle (Creator) */}
              {isCreator && onWatermarkToggle && (
                <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                  <div>
                    <span className="font-medium text-white block">Visible Watermark Deterrent</span>
                    <span className="text-[11px] text-zinc-500">
                      Displays shifting room ID & timestamp over video feeds to deter unauthorized sharing.
                    </span>
                  </div>
                  <button
                    onClick={() => onWatermarkToggle(!watermarkEnabled)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold cursor-pointer transition-all ${
                      watermarkEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {watermarkEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: What Vanyshe Protects */}
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> What Vanyshe Guarantees
              </h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span><strong>Zero Server Storage:</strong> Vanyshe never records, saves, or stores audio or video.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span><strong>No AI Ingestion:</strong> No transcription bots listen to or index your conversations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span><strong>Peer-to-Peer Encryption:</strong> Browser streams utilize DTLS-SRTP v1.3 standard keys.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span><strong>Instant RAM Purge:</strong> All session mailboxes are wiped the moment the call ends.</span>
                </li>
              </ul>
            </div>

            {/* Section 3: What Vanyshe Can Detect */}
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-zinc-400" /> What Vanyshe Can Detect (Supported APIs)
              </h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 shrink-0">•</span>
                  <span><strong>Print Screen Key:</strong> Detectable on desktop Windows and Linux keyboards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 shrink-0">•</span>
                  <span><strong>WebRTC Screen Sharing:</strong> Detects in-page display capture requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 shrink-0">•</span>
                  <span><strong>Attempted Shortcut Heuristics:</strong> Detects keyboard sequences (Win+Shift+S, Cmd+Shift).</span>
                </li>
              </ul>
            </div>

            {/* Section 4: What Vanyshe CANNOT Detect (Honesty) */}
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> What No Website Can Detect
              </h3>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0">✕</span>
                  <span><strong>External Cameras & Phones:</strong> Another device physically filming the display.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0">✕</span>
                  <span><strong>OS-Level Screen Recorders:</strong> Independent apps like OBS Studio or QuickTime running in isolated processes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0">✕</span>
                  <span><strong>Mobile OS Screenshots:</strong> iOS and Android sandboxes do not expose screenshot events to web pages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0">✕</span>
                  <span><strong>Hardware Video Taps:</strong> External HDMI / DisplayPort capture devices.</span>
                </li>
              </ul>
            </div>

            {/* Footer / Close */}
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold font-mono transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
