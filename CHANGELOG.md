# Changelog & System Documentation

All notable changes to the **Vanyshe** platform are documented in this file.

---

## [1.2.0] — 2026-09-13 / 2026-09-14

### Fixed
- **Dynamic Camera Acquisition (`toggleCamera`)**:
  - Resolved an issue where participants who joined without camera access (or where preview defaulted to audio-only) could not enable their video camera.
  - Upgraded `toggleCamera` and `toggleMicrophone` to dynamically request media via `navigator.mediaDevices.getUserMedia` when no live video track exists in `localStreamRef.current`.
  - Acquired tracks are cleanly bound to the local media stream, DOM elements, and WebRTC senders via `videoSender.replaceTrack(newVideoTrack)`.
- **Pre-Allocated Unified Plan Transceivers**:
  - In `setupWebRTC()`, pre-allocated both `audio` and `video` transceivers with `direction: 'sendrecv'`.
  - Both media channels are negotiated in the initial SDP exchange, allowing participants to turn cameras on/off at any time without triggering SDP renegotiation or glare.
- **Asynchronous DOM Video Mount Race Condition**:
  - Resolved an issue where `localVideoRef.current.srcObject` was evaluated synchronously while the in-call view was still mounting during `joinCall()`.
  - Implemented a dedicated `useEffect` synchronizing `localStreamRef.current` and `remoteStreamRef.current` with their respective `<video>` elements whenever `uiState` or active media states change.
- **WebRTC ICE Candidate Buffering**:
  - Added `iceCandidatesQueueRef` to buffer ICE candidate signals arriving prior to `pc.setRemoteDescription()`, draining them sequentially once remote description is set.
- **Remote Peer Camera State & Clean Tile UI**:
  - Added `peer-camera-changed` signaling and DataChannel notifications.
  - When a remote participant disables their camera, the tile renders an informative *"Guest camera is off"* status card instead of a black or frozen frame.
- **Signaling API Whitelist**:
  - Updated `/api/rooms/[roomId]/signal` to whitelist modern signal types (`privacy-shield-alert`, `privacy-shield-policy-change`, `privacy-shield-resume`, `peer-camera-changed`, `peer-mic-changed`, `renegotiate-request`).

---

## [1.1.0] — 2026-09-13

### Added — Vanyshe Privacy Shield (Capture Detection & Deterrence)
- **Core Engine & Heuristics** (`src/lib/privacy-shield.ts`):
  - Passive event-driven detector listening for `PrintScreen` keydown/keyup events.
  - Sequence tracking for Windows Snipping Tool (`Win+Shift+S`) and macOS Grab shortcuts (`Cmd+Shift+3/4/5`) correlated with a 1,200ms window blur window.
  - Labeled strictly as *"Possible screenshot shortcut detected"*, never claiming screenshots are captured.
  - Distinction between Vanyshe intentional screen sharing (`screen_share_detected`) and external display capture.
- **Platform Capability Matrix** (`src/lib/privacy-shield-matrix.ts`):
  - Capability audits across Windows, macOS, Linux, iOS, and Android.
  - Strict honesty disclosures: `osLevelRecorderDetection: false` (due to OS process sandboxing) and `nativeScreenshotDetection: false` (hardware buttons bypass browser DOM).
  - Evaluates client environment to assign support levels: `ACTIVE`, `LIMITED`, `UNSUPPORTED`, `OFF`.
- **Configurable Room Policies**:
  - `OFF`: Disables all monitoring and watermarks.
  - `DETECT_ALERT` (Default): Continuous monitoring with participant banners and sanitized peer notifications.
  - `STRICT`: Pauses room media upon detection, requiring participant acknowledgment to resume.
- **Dynamic Shifting Watermark** (`src/components/WatermarkOverlay.tsx`):
  - Semi-transparent, shifting overlay with room ID, timestamp, and zero-retention notice to deter unauthorized recording through non-repudiation.
- **In-Room Privacy Shield Inspector** (`src/components/PrivacyShieldIndicator.tsx`):
  - Persistent status chip in room header with modal inspector detailing protected features, detectable signals, OS sandbox limitations, live policy switcher, and watermark toggle.
- **Pre-Join Waiting Room Card** (`src/app/r/[roomId]/page.tsx`):
  - Informs participants of the room's active capture policy and platform capabilities before joining.
- **Landing Page Policy Picker** (`src/components/LandingPage.tsx`):
  - Enables room creators to establish their preferred Capture Policy upon room creation.
- **Public Disclosures Updated**:
  - `src/app/privacy/page.tsx`: Added Section 6 with four-layer Privacy Shield model and physical/OS boundaries.
  - `src/app/security/page.tsx`: Added Section 6 explaining in-transit vs local rendering buffer decryption and OS sandboxing.

---

## [1.0.0] — 2026-09-12

### Initial Launch
- Radically simple, account-free ephemeral video calling.
- True Ephemeral Room Lifecycle (`CREATED` → `WAITING` → `ACTIVE` → `ENDED` → `DESTROYED` / `EXPIRED`).
- High-entropy CSPRNG room identifiers (`vny-xxxx-xxxx-xxxx`).
- Multilingual interface supporting English (`/en`), French (`/fr`), and Arabic (`/ar`) with full RTL typography.
- Multi-participant rooms supporting up to 8 peers (`MAX_ROOM_PARTICIPANTS=8`).
- Standard WebRTC media encryption (DTLS 1.2/1.3, SRTP) with STUN and blind TURN relay fallback.
- First-party privacy-preserving product analytics with strict payload sanitization (zero personal or conversation data).
- Founder Admin Command Center (`/admin`) with KPI analytics, funnel metrics, error health, and governance playbooks.
