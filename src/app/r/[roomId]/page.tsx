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
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Lock,
  AlertTriangle,
  X,
  Building2,
  Sliders,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics-client';
import { hashRoomId } from '@/lib/crypto';
import { RoomStatus, SignalMessage, CapturePolicy, CaptureDetectionEvent, ShieldSupportLevel } from '@/lib/types';
import PrivacyShieldIndicator from '@/components/PrivacyShieldIndicator';
import WatermarkOverlay from '@/components/WatermarkOverlay';
import { CaptureDetector } from '@/lib/privacy-shield';
import { getClientCaptureCapabilities } from '@/lib/privacy-shield-matrix';

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
  const [remotePeerCamOff, setRemotePeerCamOff] = useState(false);

  // Privacy Shield States
  const [capturePolicy, setCapturePolicy] = useState<CapturePolicy>('DETECT_ALERT');
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [activeCaptureAlert, setActiveCaptureAlert] = useState<CaptureDetectionEvent | null>(null);
  const [remoteCaptureAlert, setRemoteCaptureAlert] = useState<string | null>(null);
  const [isRoomPaused, setIsRoomPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [capabilities, setCapabilities] = useState(() => getClientCaptureCapabilities());

  // References
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSignalTimestampRef = useRef<number>(0);
  const iceCandidatesQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const seenSignalIdsRef = useRef<Set<string>>(new Set());
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitiatorRef = useRef<boolean>(false);
  const captureDetectorRef = useRef<CaptureDetector | null>(null);

  // Check initial room status & creator token
  useEffect(() => {
    if (!roomId) return;

    setCapabilities(getClientCaptureCapabilities());

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
          if (data.capturePolicy) {
            setCapturePolicy(data.capturePolicy);
          }
          if (typeof data.watermarkEnabled === 'boolean') {
            setWatermarkEnabled(data.watermarkEnabled);
          }
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
      if (captureDetectorRef.current) {
        captureDetectorRef.current.stop();
      }
    };
  }, [roomId]);

  // Synchronize media streams with video elements whenever uiState, camActive, or stream refs change
  useEffect(() => {
    if (uiState === 'CONNECTED') {
      if (localVideoRef.current && localStreamRef.current) {
        if (localVideoRef.current.srcObject !== localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
      }
      if (remoteVideoRef.current && remoteStreamRef.current) {
        if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }
        remoteVideoRef.current.play().catch(() => {});
      }
    } else if (uiState === 'WAITING_ROOM') {
      if (previewVideoRef.current && localStreamRef.current) {
        if (previewVideoRef.current.srcObject !== localStreamRef.current) {
          previewVideoRef.current.srcObject = localStreamRef.current;
        }
      }
    }
  }, [uiState, camActive, remotePeerConnected]);

  // Initialize and update CaptureDetector
  useEffect(() => {
    if (uiState === 'CONNECTED') {
      const detector = new CaptureDetector(capturePolicy, (event) => {
        handleCaptureEvent(event);
      });
      captureDetectorRef.current = detector;
      detector.start();

      return () => {
        detector.stop();
        captureDetectorRef.current = null;
      };
    }
  }, [uiState, capturePolicy]);

  // Call duration counter
  useEffect(() => {
    if (uiState === 'CONNECTED' && !isRoomPaused) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [uiState, isRoomPaused]);

  // Handle Capture Detection Event
  const handleCaptureEvent = (event: CaptureDetectionEvent) => {
    if (capturePolicy === 'OFF') return;

    trackEvent('capture_event_detected', {
      errorCategory: event.type,
    });

    if (capturePolicy === 'DETECT_ALERT') {
      setActiveCaptureAlert(event);
      // Broadcast to peer via DataChannel & Signal route
      sendPeerMessage({ type: 'PRIVACY_ALERT', eventType: event.type });
      postSignal('privacy-shield-alert', { eventType: event.type });
    } else if (capturePolicy === 'STRICT') {
      setIsRoomPaused(true);
      setPauseReason(event.details || 'A supported capture mechanism was detected on your device.');
      setActiveCaptureAlert(event);
      sendPeerMessage({ type: 'ROOM_PAUSED', reason: 'Capture activity detected' });
      postSignal('privacy-shield-alert', { eventType: event.type, strictPause: true });
    }
  };

  // Acknowledge and resume from pause
  const acknowledgeAndResume = () => {
    setIsRoomPaused(false);
    setActiveCaptureAlert(null);
    setRemoteCaptureAlert(null);
    trackEvent('privacy_shield_acknowledged');
    sendPeerMessage({ type: 'ROOM_RESUMED' });
    postSignal('privacy-shield-resume', { resumed: true });
  };

  // Update room capture policy (Creator action)
  const handlePolicyChange = async (newPolicy: CapturePolicy) => {
    setCapturePolicy(newPolicy);
    captureDetectorRef.current?.setPolicy(newPolicy);

    if (creatorToken) {
      try {
        await fetch(`/api/rooms/${roomId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-policy',
            creatorToken,
            capturePolicy: newPolicy,
            watermarkEnabled,
          }),
        });
        sendPeerMessage({ type: 'POLICY_CHANGED', policy: newPolicy });
        postSignal('privacy-shield-policy-change', { policy: newPolicy });
      } catch (err) {
        console.warn('Failed to update room policy:', err);
      }
    }
  };

  // Update watermark state (Creator action)
  const handleWatermarkToggle = async (enabled: boolean) => {
    setWatermarkEnabled(enabled);
    if (creatorToken) {
      try {
        await fetch(`/api/rooms/${roomId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-policy',
            creatorToken,
            capturePolicy,
            watermarkEnabled: enabled,
          }),
        });
      } catch (err) {
        console.warn('Failed to toggle watermark:', err);
      }
    }
  };

  // Helper to send DataChannel message
  const sendPeerMessage = (payload: any) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      try {
        dataChannelRef.current.send(JSON.stringify(payload));
      } catch {
        // safe ignore
      }
    }
  };

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
      setCamActive(true);
      setMicActive(true);
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
        setMicActive(true);
      } catch {
        setMicActive(false);
        setCamActive(false);
      }
    }
  };

  // Toggle Camera with dynamic acquisition & peer synchronization
  const toggleCamera = async () => {
    // Case 1: Camera is currently ON -> turn it OFF
    if (camActive) {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      setCamActive(false);
      trackEvent('camera_disabled');

      sendPeerMessage({ type: 'PEER_CAMERA', enabled: false });
      postSignal('peer-camera-changed', { enabled: false });
      return;
    }

    // Case 2: Camera is currently OFF -> turn it ON
    // Check if we already have a live video track in localStreamRef
    const existingVideoTrack = localStreamRef.current
      ?.getVideoTracks()
      .find((t) => t.readyState === 'live');

    if (existingVideoTrack) {
      existingVideoTrack.enabled = true;
      setCamActive(true);
      trackEvent('camera_enabled');

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = localStreamRef.current;
      }

      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(
          (s) => s.track?.kind === 'video' || (!s.track && (s as any).kind === 'video')
        );
        if (videoSender) {
          videoSender.replaceTrack(existingVideoTrack).catch(console.warn);
        }
      }

      sendPeerMessage({ type: 'PEER_CAMERA', enabled: true });
      postSignal('peer-camera-changed', { enabled: true });
      return;
    }

    // Case 3: No live video track exists -> request camera access now
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      const newVideoTrack = videoStream.getVideoTracks()[0];
      if (!newVideoTrack) return;

      if (localStreamRef.current) {
        // Stop & remove any old/ended video tracks
        localStreamRef.current.getVideoTracks().forEach((t) => {
          localStreamRef.current?.removeTrack(t);
          t.stop();
        });
        localStreamRef.current.addTrack(newVideoTrack);
      } else {
        localStreamRef.current = videoStream;
      }

      setCamActive(true);
      trackEvent('camera_enabled');

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = localStreamRef.current;
      }

      // Update WebRTC peer connection
      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(
          (s) => s.track?.kind === 'video' || (!s.track && (s as any).kind === 'video')
        );
        if (videoSender) {
          await videoSender.replaceTrack(newVideoTrack);
        } else {
          peerConnectionRef.current.addTrack(newVideoTrack, localStreamRef.current);
          if (isCreator) {
            createAndSendOffer();
          } else {
            postSignal('renegotiate-request', { peerId });
          }
        }
      }

      sendPeerMessage({ type: 'PEER_CAMERA', enabled: true });
      postSignal('peer-camera-changed', { enabled: true });
    } catch (err: any) {
      console.warn('Failed to enable camera upon toggle:', err);
      setErrorMessage('Camera access was denied or device is not available.');
    }
  };

  // Toggle Microphone with dynamic acquisition & peer synchronization
  const toggleMicrophone = async () => {
    if (micActive) {
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      setMicActive(false);
      trackEvent('microphone_disabled');
      sendPeerMessage({ type: 'PEER_MUTED', muted: true });
      postSignal('peer-mic-changed', { muted: true });
      return;
    }

    const existingAudioTrack = localStreamRef.current
      ?.getAudioTracks()
      .find((t) => t.readyState === 'live');

    if (existingAudioTrack) {
      existingAudioTrack.enabled = true;
      setMicActive(true);
      trackEvent('microphone_enabled');

      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        const audioSender = senders.find(
          (s) => s.track?.kind === 'audio' || (!s.track && (s as any).kind === 'audio')
        );
        if (audioSender) {
          audioSender.replaceTrack(existingAudioTrack).catch(console.warn);
        }
      }

      sendPeerMessage({ type: 'PEER_MUTED', muted: false });
      postSignal('peer-mic-changed', { muted: false });
      return;
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newAudioTrack = audioStream.getAudioTracks()[0];
      if (!newAudioTrack) return;

      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => {
          localStreamRef.current?.removeTrack(t);
          t.stop();
        });
        localStreamRef.current.addTrack(newAudioTrack);
      } else {
        localStreamRef.current = audioStream;
      }

      setMicActive(true);
      trackEvent('microphone_enabled');

      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        const audioSender = senders.find(
          (s) => s.track?.kind === 'audio' || (!s.track && (s as any).kind === 'audio')
        );
        if (audioSender) {
          await audioSender.replaceTrack(newAudioTrack);
        } else {
          peerConnectionRef.current.addTrack(newAudioTrack, localStreamRef.current);
          if (isCreator) {
            createAndSendOffer();
          } else {
            postSignal('renegotiate-request', { peerId });
          }
        }
      }

      sendPeerMessage({ type: 'PEER_MUTED', muted: false });
      postSignal('peer-mic-changed', { muted: false });
    } catch (err) {
      console.warn('Failed to access microphone:', err);
    }
  };

  // Screen Sharing with Privacy Shield Distinction
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = screenStream;
        const screenVideoTrack = screenStream.getVideoTracks()[0];

        // Notify Privacy Shield that screen sharing was intentionally triggered by Vanyshe
        captureDetectorRef.current?.setVanysheScreenSharing(true);

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

    // Inform detector that intentional share ended
    captureDetectorRef.current?.setVanysheScreenSharing(false);

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
    if (captureDetectorRef.current) {
      captureDetectorRef.current.stop();
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

    // Ensure transceivers for audio and video exist with direction 'sendrecv'
    // This guarantees both audio and video m-lines are negotiated in the initial SDP
    const senders = pc.getSenders();
    const hasAudioSender = senders.some((s) => s.track?.kind === 'audio' || (!s.track && (s as any).kind === 'audio'));
    const hasVideoSender = senders.some((s) => s.track?.kind === 'video' || (!s.track && (s as any).kind === 'video'));

    if (!hasAudioSender) {
      try {
        pc.addTransceiver('audio', { direction: 'sendrecv' });
      } catch (e) {
        console.warn('Could not pre-allocate audio transceiver:', e);
      }
    }
    if (!hasVideoSender) {
      try {
        pc.addTransceiver('video', { direction: 'sendrecv' });
      } catch (e) {
        console.warn('Could not pre-allocate video transceiver:', e);
      }
    }

    // Handle remote track arrival
    const remoteStream = remoteStreamRef.current || new MediaStream();
    remoteStreamRef.current = remoteStream;

    pc.ontrack = (event) => {
      console.log('Received remote WebRTC track:', event.track.kind);
      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach((track) => {
          if (!remoteStream.getTracks().some((t) => t.id === track.id)) {
            remoteStream.addTrack(track);
          }
        });
      } else if (event.track) {
        if (!remoteStream.getTracks().some((t) => t.id === event.track.id)) {
          remoteStream.addTrack(event.track);
        }
      }

      event.track.onunmute = () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.play().catch(() => {});
        }
      };

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(() => {});
      }
      setRemotePeerConnected(true);
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
        } else if (msg.type === 'PEER_CAMERA') {
          setRemotePeerCamOff(!msg.enabled);
        } else if (msg.type === 'PRIVACY_ALERT') {
          setRemoteCaptureAlert('A supported capture mechanism was detected on another participant’s device.');
        } else if (msg.type === 'ROOM_PAUSED') {
          setIsRoomPaused(true);
          setPauseReason('Capture activity was detected on another participant’s device.');
        } else if (msg.type === 'ROOM_RESUMED') {
          setIsRoomPaused(false);
          setRemoteCaptureAlert(null);
        } else if (msg.type === 'POLICY_CHANGED') {
          setCapturePolicy(msg.policy);
          captureDetectorRef.current?.setPolicy(msg.policy);
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
        const fetchSince = Math.max(0, lastSignalTimestampRef.current - 1000);
        const res = await fetch(
          `/api/rooms/${roomId}/signal?since=${fetchSince}&senderId=${peerId}`
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
          if (seenSignalIdsRef.current.has(sig.id)) continue;
          seenSignalIdsRef.current.add(sig.id);

          if (sig.timestamp > lastSignalTimestampRef.current) {
            lastSignalTimestampRef.current = sig.timestamp;
          }

          if (sig.type === 'room-destroyed') {
            handleRemoteRoomDestroyed();
            return;
          }

          // Privacy Shield Signal Events
          if (sig.type === 'privacy-shield-alert') {
            if (sig.payload?.strictPause) {
              setIsRoomPaused(true);
              setPauseReason('Capture activity was detected on another participant’s device.');
            } else {
              setRemoteCaptureAlert('A supported capture mechanism was detected on another participant’s device.');
            }
          } else if (sig.type === 'privacy-shield-resume') {
            setIsRoomPaused(false);
            setRemoteCaptureAlert(null);
          } else if (sig.type === 'privacy-shield-policy-change') {
            if (sig.payload?.policy) {
              setCapturePolicy(sig.payload.policy);
              captureDetectorRef.current?.setPolicy(sig.payload.policy);
            }
          } else if (sig.type === 'peer-camera-changed') {
            setRemotePeerCamOff(!sig.payload?.enabled);
          } else if (sig.type === 'peer-mic-changed') {
            setRemotePeerMuted(sig.payload?.muted);
          }

          if (!pc) continue;

          if (sig.type === 'participant-joined' && isCreator) {
            // Guest joined! Create or re-send offer
            createAndSendOffer();
          } else if (sig.type === 'renegotiate-request' && isCreator) {
            createAndSendOffer();
          } else if (sig.type === 'offer' && !isCreator) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
              // Drain any queued ICE candidates
              while (iceCandidatesQueueRef.current.length > 0) {
                const cand = iceCandidatesQueueRef.current.shift();
                if (cand) {
                  await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
                }
              }
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await postSignal('answer', answer);
            } catch (err) {
              console.error('Error handling offer:', err);
            }
          } else if (sig.type === 'answer' && isCreator) {
            try {
              if (pc.signalingState !== 'stable') {
                await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
                // Drain any queued ICE candidates
                while (iceCandidatesQueueRef.current.length > 0) {
                  const cand = iceCandidatesQueueRef.current.shift();
                  if (cand) {
                    await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
                  }
                }
              }
            } catch (err) {
              console.error('Error handling answer:', err);
            }
          } else if (sig.type === 'candidate') {
            const cand = sig.payload;
            if (pc.remoteDescription && pc.remoteDescription.type) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
              } catch (e) {
                console.warn('Error adding ice candidate:', e);
              }
            } else {
              iceCandidatesQueueRef.current.push(cand);
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
    sendPeerMessage({ type: 'ROOM_DESTROYED' });

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

  // RENDER: WAITING ROOM STATE (WITH PRE-JOIN PRIVACY SHIELD)
  if (uiState === 'WAITING_ROOM') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-xl w-full">
          {/* Top Privacy Shield Notice */}
          <div className="mb-6 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>PRIVACY SHIELD PROTECTED</span>
            </div>
            <p className="text-xs text-zinc-200 font-medium">
              This conversation is not recorded by Vanyshe.
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Vanyshe can detect certain browser-level capture activity, but no website can detect every possible form of recording or photography.
            </p>

            {/* Room Policy Badge / Creator Select */}
            <div className="mt-3 pt-3 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-zinc-400">Enforced Capture Policy:</span>
              <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                {capturePolicy === 'STRICT'
                  ? 'Strict Privacy (Pause Room)'
                  : capturePolicy === 'OFF'
                  ? 'Off (No Monitoring)'
                  : 'Detect & Alert (Default)'}
              </span>
            </div>

            {/* Creator policy adjustment in waiting room */}
            {isCreator && (
              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Change policy:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePolicyChange('OFF')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      capturePolicy === 'OFF' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Off
                  </button>
                  <button
                    onClick={() => handlePolicyChange('DETECT_ALERT')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      capturePolicy === 'DETECT_ALERT'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Alert
                  </button>
                  <button
                    onClick={() => handlePolicyChange('STRICT')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      capturePolicy === 'STRICT' ? 'bg-red-600 text-white font-bold' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Strict
                  </button>
                </div>
              </div>
            )}
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
              className="w-full py-3 px-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied to Clipboard' : 'Copy Room Link to Share'}</span>
            </button>
          </div>

          {/* Subtle privacy note */}
          <div className="mt-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted DTLS-SRTP v1.3 — Zero conversation retention</span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: ACTIVE IN-CALL STATE
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-white select-none relative">
      {/* Top Bar with Privacy Shield Indicator */}
      <header className="h-14 border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-medium tracking-wide">
            Private session
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-xs font-mono text-zinc-400">{formatDuration(callDuration)}</span>
        </div>

        {/* Center/Right: Privacy Shield Persistent Indicator */}
        <div className="flex items-center gap-3">
          <PrivacyShieldIndicator
            policy={capturePolicy}
            supportLevel={capabilities.supportLevel}
            isCreator={isCreator}
            watermarkEnabled={watermarkEnabled}
            onPolicyChange={handlePolicyChange}
            onWatermarkToggle={handleWatermarkToggle}
          />

          <button
            onClick={copyRoomLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Capture Alert Banner: Local Device Alert */}
      {activeCaptureAlert && !isRoomPaused && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs z-30 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300">Capture detected: </span>
              <span className="text-zinc-300">
                {activeCaptureAlert.type === 'print_screen_detected'
                  ? 'Print Screen key was pressed.'
                  : activeCaptureAlert.type === 'screenshot_attempt_detected'
                  ? 'Possible screenshot shortcut detected.'
                  : 'A supported capture mechanism may be active on this device.'}
              </span>{' '}
              <span className="text-zinc-400 font-medium">The conversation has not been recorded by Vanyshe.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCaptureAlert(null)}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg font-semibold text-[11px] cursor-pointer"
            >
              Continue
            </button>
            <button
              onClick={isCreator ? handleDestroyRoom : leaveCall}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px] cursor-pointer"
            >
              Leave conversation
            </button>
          </div>
        </div>
      )}

      {/* Capture Alert Banner: Remote Peer Capture Notification */}
      {remoteCaptureAlert && !isRoomPaused && (
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs z-30 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-zinc-200">Privacy alert:</span>
            <span className="text-zinc-400">A supported capture mechanism was detected on another participant’s device.</span>
          </div>
          <button
            onClick={() => setRemoteCaptureAlert(null)}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Strict Mode: Paused Room Overlay */}
      {isRoomPaused && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/40 bg-zinc-950 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
              Conversation paused
            </h2>

            <p className="text-sm text-zinc-300 mb-2 leading-relaxed">
              Capture activity has been detected. This room is configured under <strong>Strict Privacy</strong>.
            </p>

            <p className="text-xs text-zinc-400 mb-6 font-mono">
              All participants must acknowledge the risk before continuing.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={acknowledgeAndResume}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
              >
                I understand — continue conversation
              </button>

              <button
                onClick={isCreator ? handleDestroyRoom : leaveCall}
                className="w-full py-3 px-4 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-medium transition-colors cursor-pointer"
              >
                Leave conversation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Viewport */}
      <main className="flex-1 p-3 sm:p-5 flex flex-col justify-center relative overflow-hidden">
        {/* Dynamic Watermark Overlay */}
        <WatermarkOverlay roomId={roomId} enabled={watermarkEnabled} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-w-7xl mx-auto w-full items-center">
          {/* Remote Video Tile */}
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 aspect-video md:aspect-auto md:h-[70vh] flex items-center justify-center overflow-hidden shadow-2xl">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${!remotePeerConnected || isRoomPaused || remotePeerCamOff ? 'hidden' : ''}`}
            />
            {(!remotePeerConnected || isRoomPaused || remotePeerCamOff) && (
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 mb-3 animate-pulse">
                  {remotePeerCamOff ? <VideoOff className="w-6 h-6 text-zinc-400" /> : <VideoIcon className="w-6 h-6" />}
                </div>
                <h3 className="text-base font-medium text-zinc-300 mb-1">
                  {isRoomPaused
                    ? 'Media feed paused'
                    : remotePeerCamOff
                    ? (isCreator ? 'Guest camera is off' : 'Partner camera is off')
                    : 'Waiting for guest to join...'}
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-4">
                  {isRoomPaused
                    ? 'Video is masked while capture alert is resolved.'
                    : remotePeerCamOff
                    ? 'Participant has turned off their camera or is in audio-only mode.'
                    : 'Send the room link to your conversation partner.'}
                </p>
                {!remotePeerConnected && (
                  <button
                    onClick={copyRoomLink}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy room link</span>
                  </button>
                )}
              </div>
            )}

            {/* Remote Peer Status Indicator */}
            {remotePeerConnected && !isRoomPaused && (
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
              className={`w-full h-full object-cover ${!camActive || isRoomPaused ? 'hidden' : ''}`}
            />
            {(!camActive || isRoomPaused) && (
              <div className="flex flex-col items-center text-zinc-500">
                <VideoOff className="w-12 h-12 mb-2 stroke-1" />
                <span className="text-xs font-mono">
                  {isRoomPaused ? 'Camera feed paused' : 'Camera off'}
                </span>
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

            {/* In-Call Screen Sharing Notice */}
            {isScreenSharing && (
              <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/80 border border-emerald-500/30 py-1.5 px-3 rounded-lg text-xs font-mono text-emerald-300 flex items-center justify-between">
                <span>You are sharing your screen with the room.</span>
                <span className="text-[10px] text-zinc-400">Vanyshe Screen Share</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Control Bar at Bottom */}
      <footer className="h-20 border-t border-zinc-800/80 px-4 sm:px-6 flex items-center justify-center gap-3 sm:gap-5 bg-zinc-950/90 backdrop-blur-md z-20">
        {/* Microphone Toggle */}
        <button
          onClick={toggleMicrophone}
          className={`p-3.5 rounded-full transition-all cursor-pointer ${
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
          className={`p-3.5 rounded-full transition-all cursor-pointer ${
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
          className={`p-3.5 rounded-full transition-all cursor-pointer ${
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
