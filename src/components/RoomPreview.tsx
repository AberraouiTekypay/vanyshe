'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  ShieldCheck,
  PhoneOff,
  Copy,
  Check,
  Wifi,
  Lock,
  Radio,
  Zap,
} from 'lucide-react';

export default function RoomPreview() {
  const { t } = useI18n();
  const [micMuted, setMicMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(3280); // ~54 mins

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('https://vanyshe.com/r/vny-9kx2-7mqa');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-5xl group">
      {/* Outer ambient glow behind preview */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-950/95 backdrop-blur-xl p-3 sm:p-5 shadow-2xl overflow-hidden transition-all">
        {/* Window Chrome Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 border-b border-zinc-800/80 mb-4 text-xs">
          {/* Left: Window dots & Live security indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
            </div>
            <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-emerald-400 font-medium tracking-wide text-[11px] sm:text-xs">
                {t.preview.privateSession}
              </span>
            </div>
          </div>

          {/* Right: Room ID with copy button & Time remaining */}
          <div className="flex items-center gap-2 sm:gap-3 text-zinc-400 font-mono text-[11px] sm:text-xs">
            <button
              onClick={handleCopyLink}
              title="Copy demo room link"
              className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/60 hover:border-zinc-600 text-zinc-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>vny-9kx2-7mqa</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-400">
              <span className="text-zinc-500">{formatTimer(seconds)}</span>
              <span className="text-[10px] text-zinc-600 uppercase">left</span>
            </div>
          </div>
        </div>

        {/* Video Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[280px] sm:min-h-[360px]">
          {/* Remote Participant Tile */}
          <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border border-zinc-800/80 flex flex-col items-center justify-center overflow-hidden p-6 shadow-inner">
            {/* Ambient inner glow for active speaker */}
            <div className="absolute inset-0 bg-radial from-emerald-500/5 to-transparent pointer-events-none" />

            {/* Avatar with speaking wave ring */}
            <div className="relative mb-3.5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-700 to-zinc-600 border-2 border-emerald-500/50 flex items-center justify-center text-white font-semibold text-2xl shadow-xl">
                B
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>

            <span className="text-sm font-semibold text-zinc-200 tracking-tight">Guest Participant</span>

            {/* Audio waveform simulation */}
            <div className="flex items-center gap-1 mt-2.5 h-5 px-3 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-800">
              <span className="w-1 bg-emerald-400 rounded-full animate-sound-1" />
              <span className="w-1 bg-emerald-400 rounded-full animate-sound-2" />
              <span className="w-1 bg-emerald-400 rounded-full animate-sound-3" />
              <span className="w-1 bg-emerald-400 rounded-full animate-sound-4" />
              <span className="w-1 bg-emerald-400 rounded-full animate-sound-2" />
              <span className="text-[10px] font-mono text-zinc-400 ml-1.5">Speaking</span>
            </div>

            {/* Top specs badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-xs border border-zinc-800 px-2 py-1 rounded-md text-[10px] sm:text-[11px] text-zinc-400 font-mono">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>1080p • 16ms</span>
            </div>

            {/* Bottom status badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>P2P Direct</span>
            </div>
          </div>

          {/* Local Participant Tile */}
          <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border border-zinc-800/80 flex flex-col items-center justify-center overflow-hidden p-6 shadow-inner">
            {!videoDisabled ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-3.5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-700 to-zinc-600 border-2 border-zinc-600 flex items-center justify-center text-white font-semibold text-xl sm:text-2xl shadow-xl">
                    You
                  </div>
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-200 tracking-tight">Room Creator (You)</span>
                <span className="text-xs text-emerald-400/90 mt-1 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Encrypted media active
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-400 p-6">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                  <VideoOff className="w-7 h-7 text-zinc-500" />
                </div>
                <span className="text-sm font-medium text-zinc-300">Camera Paused</span>
                <span className="text-xs text-zinc-500 font-mono mt-0.5">Video stream muted by user</span>
              </div>
            )}

            {/* Screen sharing indicator overlay */}
            {sharingScreen && (
              <div className="absolute inset-x-3 top-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg py-1 px-2.5 flex items-center justify-between text-xs text-emerald-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 animate-pulse" />
                  Broadcasting screen
                </span>
                <span className="text-[10px] opacity-80">1920x1080</span>
              </div>
            )}

            {/* Local mic status badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-xs border border-zinc-800 px-2.5 py-1 rounded-md text-[11px]">
              {micMuted ? (
                <span className="text-red-400 flex items-center gap-1.5 font-medium">
                  <MicOff className="w-3 h-3" /> Muted
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Mic className="w-3 h-3" /> Live
                </span>
              )}
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-3 right-3 text-[11px] text-zinc-500 font-mono">
              <span>Local feed</span>
            </div>
          </div>
        </div>

        {/* Interactive Floating Control Dock */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Left subtle telemetry badge */}
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>DTLS 1.3 End-to-End Encrypted</span>
          </div>

          {/* Center: Interactive action controls */}
          <div className="flex items-center gap-2 sm:gap-3 mx-auto md:mx-0">
            {/* Mic Toggle Button */}
            <button
              onClick={() => setMicMuted(!micMuted)}
              className={`p-3 rounded-xl transition-all duration-200 cursor-pointer text-xs flex items-center gap-2 shadow-xs ${
                micMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                  : 'bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700/90 border border-zinc-700/60 hover:text-white'
              }`}
              title={t.preview.micLabel}
              aria-label={t.preview.micLabel}
            >
              {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Cam Toggle Button */}
            <button
              onClick={() => setVideoDisabled(!videoDisabled)}
              className={`p-3 rounded-xl transition-all duration-200 cursor-pointer text-xs flex items-center gap-2 shadow-xs ${
                videoDisabled
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                  : 'bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700/90 border border-zinc-700/60 hover:text-white'
              }`}
              title={t.preview.camLabel}
              aria-label={t.preview.camLabel}
            >
              {videoDisabled ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            {/* Screen Share Button */}
            <button
              onClick={() => setSharingScreen(!sharingScreen)}
              className={`p-3 rounded-xl transition-all duration-200 cursor-pointer text-xs flex items-center gap-2 shadow-xs ${
                sharingScreen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700/90 border border-zinc-700/60 hover:text-white'
              }`}
              title={t.preview.screenLabel}
              aria-label={t.preview.screenLabel}
            >
              <Monitor className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-zinc-800 mx-1" />

            {/* End Room CTA */}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-red-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>{t.preview.endLabel}</span>
            </button>
          </div>

          {/* Right: Security Guarantee Pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Zero server recording</span>
          </div>
        </div>
      </div>

      {/* Reassurance strip underneath preview */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span>RAM-Only State</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>0 Bytes On Disk</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>DTLS-SRTP v1.3</span>
        </div>
      </div>
    </div>
  );
}
