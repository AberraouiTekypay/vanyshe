'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Mic, MicOff, Video, VideoOff, Monitor, ShieldCheck, PhoneOff } from 'lucide-react';

export default function RoomPreview() {
  const { t } = useI18n();
  const [micMuted, setMicMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);

  return (
    <div className="relative mx-auto max-w-5xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-3 sm:p-5 shadow-2xl overflow-hidden">
      {/* Top Header inside preview */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-emerald-400 font-medium">{t.preview.privateSession}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400 font-mono">
          <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
            Room: vny-9Kx2-7mQa
          </span>
          <span className="text-zinc-500">25:40 remaining</span>
        </div>
      </div>

      {/* Video Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[300px] sm:min-h-[380px]">
        {/* Remote Participant Tile */}
        <div className="relative rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col items-center justify-center overflow-hidden p-6">
          <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-medium text-xl shadow-inner mb-3">
            B
          </div>
          <span className="text-sm font-medium text-zinc-300">Guest Participant</span>
          <span className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> DTLS-SRTP Direct P2P
          </span>

          <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-xs border border-zinc-800 px-2 py-1 rounded text-[11px] text-zinc-400 font-mono">
            1080p 30fps
          </div>
        </div>

        {/* Local Participant Tile */}
        <div className="relative rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col items-center justify-center overflow-hidden p-6">
          {!videoDisabled ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-medium text-xl shadow-inner mb-3">
                You
              </div>
              <span className="text-sm font-medium text-zinc-300">Room Creator (You)</span>
              <span className="text-xs text-emerald-400/80 mt-1 font-mono">Encrypted media active</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-zinc-500">
              <VideoOff className="w-10 h-10 mb-2 stroke-1" />
              <span className="text-xs font-mono">Camera off</span>
            </div>
          )}

          {/* Local Status badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-xs border border-zinc-800 px-2 py-0.5 rounded text-[11px] text-zinc-400">
            {micMuted ? (
              <span className="text-red-400 flex items-center gap-1">
                <MicOff className="w-3 h-3" /> Muted
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Mic className="w-3 h-3" /> Live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar inside Preview */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-3">
        <button
          onClick={() => setMicMuted(!micMuted)}
          className={`p-3 rounded-full transition-all text-xs flex items-center gap-2 ${
            micMuted
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
          }`}
          title={t.preview.micLabel}
        >
          {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setVideoDisabled(!videoDisabled)}
          className={`p-3 rounded-full transition-all text-xs flex items-center gap-2 ${
            videoDisabled
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
          }`}
          title={t.preview.camLabel}
        >
          {videoDisabled ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setSharingScreen(!sharingScreen)}
          className={`p-3 rounded-full transition-all text-xs flex items-center gap-2 ${
            sharingScreen
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
          }`}
          title={t.preview.screenLabel}
        >
          <Monitor className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-zinc-800 mx-1" />

        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full text-xs font-medium cursor-pointer shadow-xs">
          <PhoneOff className="w-3.5 h-3.5" />
          <span>{t.preview.endLabel}</span>
        </div>
      </div>
    </div>
  );
}
