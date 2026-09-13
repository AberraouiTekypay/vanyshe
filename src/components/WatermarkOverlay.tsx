'use client';

import React, { useState, useEffect } from 'react';

interface WatermarkOverlayProps {
  roomId: string;
  enabled?: boolean;
}

export default function WatermarkOverlay({ roomId, enabled = true }: WatermarkOverlayProps) {
  const [positionIndex, setPositionIndex] = useState(0);
  const [timeStr, setTimeStr] = useState('');

  // Update dynamic timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toTimeString().split(' ')[0] + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Slowly alternate watermark position every 35 seconds to deter casual capture without obstruction
  useEffect(() => {
    if (!enabled) return;
    const posInterval = setInterval(() => {
      setPositionIndex((prev) => (prev + 1) % 4);
    }, 35000);
    return () => clearInterval(posInterval);
  }, [enabled]);

  if (!enabled) return null;

  const positions = [
    'top-4 left-4 text-left',
    'top-4 right-4 text-right',
    'bottom-24 right-4 text-right',
    'bottom-24 left-4 text-left',
  ];

  const currentPos = positions[positionIndex] || positions[0];
  const shortId = roomId.length > 8 ? roomId.slice(0, 8) : roomId;

  return (
    <div
      aria-hidden="true"
      className={`absolute ${currentPos} pointer-events-none z-10 transition-all duration-1000 select-none`}
    >
      <div className="bg-black/30 backdrop-blur-[2px] border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-300/60 leading-tight shadow-xs">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-400/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
          <span>VANYshe PRIVATE ROOM</span>
        </div>
        <div className="text-[9px] text-zinc-400/60 mt-0.5 flex items-center gap-2">
          <span>ID: {shortId}</span>
          <span>•</span>
          <span>{timeStr || 'LIVE'}</span>
          <span>•</span>
          <span>NO LOGS</span>
        </div>
      </div>
    </div>
  );
}
