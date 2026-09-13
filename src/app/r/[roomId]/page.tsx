'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics-client';
import { hashRoomId } from '@/lib/crypto';
import { RoomStatus, SignalMessage } from '@/lib/types';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
  ],
  iceCandidatePoolSize: 4,
};

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const router = useRouter();

  // Lifecycle states: 'LOADING' | 'WAITING_ROOM' | 'CONNECTED' | 'DESTROYED' | 'EXPIRED' | 'ERROR'
  const [uiState, setUiState] = useState<'LOADING' | 'WAITING_ROOM' | 'CONNECTED' | 'DESTROYED' | 'EXPIRED' | 'ERROR'>('LOADING');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [creatorToken, setCreatorToken] = useState<string | null>(null);

  // Participant state
  const [peerId] = useState(() => `peer_${Math.random().toString(36).slice(2, 9)}`);
  const [copiedLink, setCopiedLink] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'connecting' | 'connected' | 'reconnecting'>('connecting');

  // Media Controls
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remotePeerConnected, setRemotePeerConnected] = useState(false);
  const [remotePeerMuted, setRemotePeerMuted] = useState(false);

  // References
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSignalTimestampRef = useRef<number>(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitiatorRef = useRef<boolean>(false);

  // Check initial room status & creator token
  useEffect(() => {
    if (!roomId) return;

    // Check if current user holds creator token in sessionStorage
    const token = typeof window !== 'undefined' ? sessionStorage.getItem(`vanyshe_creator_${roomId}`) : null;
    if (token) {
      setIsCreator(true);
      setCreatorToken(token);
      isInitiatorRef.current = true;
    }

    async function checkRoom() {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (res.status === 404 || res.status === 410) {
          const data = await res.json();
          if (data.status === 'DESTROYED') {
            setUiState('DESTROYED');
          } else {
            setUiState('EXPIRED');
          }
          return;
        }

        const data = await res.json();
        if (data.status === 'DESTROYED') {
          setUiState('DESTROYED');
        } else if (data.status === 'EXPIRED') {
          setUiState('EXPIRED');
        } else {
          setUiState('WAITING_ROOM');
          initLocalPreview();
        }
      } catch (err) {
        setErrorMessage('Failed to connect to Vanyshe room server.');
        setUiState('ERROR');
      }
    }

    checkRoom();

    return () => {
      stopAllMedia();
    };
  }, [roomId]);

  // Call duration counter
  useEffect(() => {
    if (uiState === 'CONNECTED') {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [uiState]);

  // Initialize preview in Waiting Room
  const initLocalPreview = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Your browser does not support WebRTC audio/video.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      localStreamRef.current = stream;
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera/Mic permission warning:', err);
      // Fallback: try audio only if video failed
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = audioStream;
        setCamActive(false);
      } catch {
        setMicActive(false);
        setCamActive(false);
      }
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const newState = !camActive;
        videoTracks[0].enabled = newState;
        setCamActive(newState);
        trackEvent(newState ? 'camera_enabled' : 'camera_disabled');
      }
    }
  };

  // Toggle Microphone
  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const newState = !micActive;
        audioTracks[0].enabled = newState;
        setMicActive(newState);
        trackEvent(newState ? 'microphone_enabled' : 'microphone_disabled');

        // Notify peer via DataChannel
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
          dataChannelRef.current.send(JSON.stringify({ type: 'PEER_MUTED', muted: !newState }));
        }
      }
    }
  };

  // Screen Sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = screenStream;
        const screenVideoTrack = screenStream.getVideoTracks()[0];

        // Replace track in RTCPeerConnection
        if (peerConnectionRef.current) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenVideoTrack);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenVideoTrack.onended = () => {
          stopScreenSharing();
        };

        setIsScreenSharing(true);
        trackEvent('screen_share_started');
      } catch (err) {
        console.warn('Screen sharing cancelled or failed:', err);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    // Restore local camera track
    if (localStreamRef.current && peerConnectionRef.current) {
      const cameraVideoTrack = localStreamRef.current.getVideoTracks()[0];
      const senders = peerConnectionRef.current.getSenders();
      const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
      if (videoSender && cameraVideoTrack) {
        videoSender.replaceTrack(cameraVideoTrack);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }

    setIsScreenSharing(false);
    trackEvent('screen_share_ended');
  };

  // Copy Room Link
  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    trackEvent('room_link_copied');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Stop all media tracks
  const stopAllMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Join Call & Setup WebRTC
  const joinCall = async () => {
    setUiState('CONNECTED');
    trackEvent('room_connection_started');

    // Register participant in room
    try {
      await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          anonymousId: peerId,
        }),
      });
    } catch {
      // safe continue
    }

    // Attach local stream to in-call element
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    setupWebRTC();
  };

  // Setup WebRTC PeerConnection
  const setupWebRTC = async () => {
    const pc = new RTCPeerConnection(RTC_CONFIG);
    peerConnectionRef.current = pc;

    // Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote track arrival
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemotePeerConnected(true);
      }
    };

    // Handle ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        postSignal('candidate', event.candidate);
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setConnectionQuality('connected');
        setRemotePeerConnected(true);
        trackEvent('room_connection_established');
        trackEvent('call_started');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionQuality('reconnecting');
      }
    };

    // DataChannel for instant peer events
    if (isCreator) {
      const dc = pc.createDataChannel('vanyshe_control');
      setupDataChannel(dc);
      dataChannelRef.current = dc;
    } else {
      pc.ondatachannel = (event) => {
        setupDataChannel(event.channel);
        dataChannelRef.current = event.channel;
      };
    }

    // Notify room of arrival
    await postSignal('participant-joined', { peerId, isCreator });

    // Start signalling poll loop
    startSignallingPoll();

    // If creator, initiate SDP Offer
    if (isCreator) {
      createAndSendOffer();
    }
  };

  const setupDataChannel = (dc: RTCDataChannel) => {
    dc.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'ROOM_DESTROYED') {
          handleRemoteRoomDestroyed();
        } else if (msg.type === 'PEER_MUTED') {
          setRemotePeerMuted(msg.muted);
        }
      } catch {
        // ignore malformed
      }
    };
  };

  // Signalling Helpers
  const postSignal = async (type: string, payload: any) => {
    try {
      await fetch(`/api/rooms/${roomId}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: peerId,
          type,
          payload,
        }),
      });
    } catch (err) {
      console.warn('Signalling dispatch warning:', err);
    }
  };

  const createAndSendOffer = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await postSignal('offer', offer);
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const handleRemoteRoomDestroyed = () => {
    stopAllMedia();
    setUiState('DESTROYED');
  };

  // Poll for incoming WebRTC signals
  const startSignallingPoll = () => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/rooms/${roomId}/signal?since=${lastSignalTimestampRef.current}&senderId=${peerId}`
        );
        if (!res.ok) {
          if (res.status === 410) {
            handleRemoteRoomDestroyed();
          }
          return;
        }

        const data = await res.json();
        if (data.roomStatus === 'DESTROYED') {
          handleRemoteRoomDestroyed();
          return;
        }

        const signals: SignalMessage[] = data.signals || [];
        const pc = peerConnectionRef.current;

        for (const sig of signals) {
          if (sig.timestamp > lastSignalTimestampRef.current) {
            lastSignalTimestampRef.current = sig.timestamp;
          }

          if (sig.type === 'room-destroyed') {
            handleRemoteRoomDestroyed();
            return;
          }

          if (!pc) continue;

          if (sig.type === 'participant-joined' && isCreator) {
            // Guest joined! Create or re-send offer
            createAndSendOffer();
          } else if (sig.type === 'offer' && !isCreator) {
            await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await postSignal('answer', answer);
          } else if (sig.type === 'answer' && isCreator) {
            if (pc.signalingState !== 'stable') {
              await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
            }
          } else if (sig.type === 'candidate') {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(sig.payload));
            } catch {
              // Ignore candidate race condition
            }
          }
        }
      } catch {
        // network hiccup
      }
    }, 1000);
  };

  // Leave Call (for Guest)
  const leaveCall = async () => {
    trackEvent('call_ended', { durationSeconds: callDuration });
    stopAllMedia();

    try {
      await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave', anonymousId: peerId }),
      });
    } catch {
      // safe ignore
    }

    setUiState('WAITING_ROOM');
    router.push('/');
  };

  // End & Destroy Room (for Creator)
  const handleDestroyRoom = async () => {
    if (!creatorToken) return;

    trackEvent('room_destroyed', { durationSeconds: callDuration });

    // Send instant DataChannel broadcast
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      try {
        dataChannelRef.current.send(JSON.stringify({ type: 'ROOM_DESTROYED' }));
      } catch {
        // safe ignore
      }
    }

    // Signal server-side destruction
    try {
      await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'destroy',
          creatorToken,
          anonymousId: peerId,
        }),
      });
      await postSignal('room-destroyed', { destroyed: true });
    } catch {
      // safe continue
    }

    stopAllMedia();
    setUiState('DESTROYED');
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // RENDER: LOADING STATE
  if (uiState === 'LOADING') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm font-mono text-zinc-400">Connecting to private Vanyshe room...</p>
      </div>
    );
  }

  // RENDER: DESTROYED STATE
  if (uiState === 'DESTROYED') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
            <PhoneOff className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Conversation destroyed.</h1>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            This room, all signaling state, and ephemeral tokens have been permanently wiped. Vanyshe retains no conversation records.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all"
            >
              Start another conversation
            </Link>
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/60 text-sm transition-all"
            >
              Return to Vanyshe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: EXPIRED STATE
  if (uiState === 'EXPIRED') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Room expired.</h1>
          <p className="text-sm text-zinc-400 mb-6">
            This room exceeded its 60-minute ephemeral lifespan and is no longer available.
          </p>
          <Link
            href="/"
            className="inline-block w-full py-3 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all"
          >
            Create new private room
          </Link>
        </div>
      </div>
    );
  }

  // RENDER: WAITING ROOM STATE
  if (uiState === 'WAITING_ROOM') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-xl w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-xs font-mono text-emerald-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Room ready
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              You’re entering a private Vanyshe room.
            </h1>
            <p className="text-sm text-zinc-400">
              Check your camera and microphone before joining.
            </p>
          </div>

          {/* Camera Preview Box */}
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden aspect-video mb-6 flex items-center justify-center shadow-xl">
            <video
              ref={previewVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!camActive ? 'hidden' : ''}`}
            />
            {!camActive && (
              <div className="flex flex-col items-center text-zinc-500">
                <VideoOff className="w-12 h-12 mb-2 stroke-1" />
                <span className="text-xs font-mono">Camera preview disabled</span>
              </div>
            )}

            {/* In-preview quick toggles */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800">
              <button
                onClick={toggleMicrophone}
                className={`p-2.5 rounded-full transition-all ${
                  micActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
                title="Toggle Mic"
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-2.5 rounded-full transition-all ${
                  camActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
                title="Toggle Camera"
              >
                {camActive ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={joinCall}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <VideoIcon className="w-5 h-5 text-emerald-600" />
              <span>Join Conversation</span>
            </button>

            <button
              onClick={copyRoomLink}
              className="w-full py-3 px-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied to Clipboard' : 'Copy Room Link to Share'}</span>
            </button>
          </div>

          {/* Subtle privacy note */}
          <div className="mt-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted DTLS-SRTP — No call recording</span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: ACTIVE IN-CALL STATE
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-white select-none">
      {/* Top Bar */}
      <header className="h-14 border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-medium tracking-wide">
            Private session
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-xs font-mono text-zinc-400">{formatDuration(callDuration)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyRoomLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share Link'}</span>
          </button>
        </div>
      </header>

      {/* Main Video Viewport */}
      <main className="flex-1 p-3 sm:p-5 flex flex-col justify-center relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-w-7xl mx-auto w-full items-center">
          {/* Remote Video Tile */}
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 aspect-video md:aspect-auto md:h-[70vh] flex items-center justify-center overflow-hidden shadow-2xl">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${!remotePeerConnected ? 'hidden' : ''}`}
            />
            {!remotePeerConnected && (
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 mb-3 animate-pulse">
                  <VideoIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-medium text-zinc-300 mb-1">Waiting for guest to join...</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-4">
                  Send the room link to your conversation partner.
                </p>
                <button
                  onClick={copyRoomLink}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy room link</span>
                </button>
              </div>
            )}

            {/* Remote Peer Status Indicator */}
            {remotePeerConnected && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-zinc-950/70 backdrop-blur-xs px-2.5 py-1 rounded-md border border-zinc-800 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Guest</span>
                {remotePeerMuted && (
                  <span className="text-red-400 flex items-center gap-1">
                    <MicOff className="w-3 h-3" /> (Muted)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Local Video Tile */}
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 aspect-video md:aspect-auto md:h-[70vh] flex items-center justify-center overflow-hidden shadow-2xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!camActive ? 'hidden' : ''}`}
            />
            {!camActive && (
              <div className="flex flex-col items-center text-zinc-500">
                <VideoOff className="w-12 h-12 mb-2 stroke-1" />
                <span className="text-xs font-mono">Camera off</span>
              </div>
            )}

            {/* Local Status Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-zinc-950/70 backdrop-blur-xs px-2.5 py-1 rounded-md border border-zinc-800 text-xs font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>You {isCreator ? '(Creator)' : ''}</span>
              {!micActive && (
                <span className="text-red-400 flex items-center gap-1">
                  <MicOff className="w-3 h-3" /> Muted
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Control Bar at Bottom */}
      <footer className="h-20 border-t border-zinc-800/80 px-4 sm:px-6 flex items-center justify-center gap-3 sm:gap-5 bg-zinc-950/90 backdrop-blur-md z-20">
        {/* Microphone Toggle */}
        <button
          onClick={toggleMicrophone}
          className={`p-3.5 rounded-full transition-all ${
            micActive
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
          }`}
          title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={toggleCamera}
          className={`p-3.5 rounded-full transition-all ${
            camActive
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
          }`}
          title={camActive ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {camActive ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Sharing Toggle */}
        <button
          onClick={toggleScreenShare}
          className={`p-3.5 rounded-full transition-all ${
            isScreenSharing
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-zinc-800 text-white hover:bg-zinc-700'
          }`}
          title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
        >
          <Monitor className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-zinc-800 mx-2" />

        {/* End / Destroy Room CTA */}
        {isCreator ? (
          <button
            onClick={handleDestroyRoom}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wide transition-all shadow-lg cursor-pointer"
            title="End conversation and wipe ephemeral room"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End & Destroy Room</span>
          </button>
        ) : (
          <button
            onClick={leaveCall}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs tracking-wide transition-all cursor-pointer"
            title="Leave conversation"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave Conversation</span>
          </button>
        )}
      </footer>
    </div>
  );
}
