# Vanyshe Architecture Document

## Overview

Vanyshe is an ephemeral real-time communication system built on the philosophy:

> **Measure the product. Never measure the conversation.**

## 1. High-Level Topology

```text
Browser A (Creator)                        Browser B (Guest)
      │                                            │
      │ ── 1. Create Room (POST /api/rooms/create) │
      │    Returns roomId + creatorToken           │
      │                                            │
      │ ── 2. Share Link (https://vanyshe.com/r/..) ─▶
      │                                            │
      │ ── 3. Ephemeral Signalling (REST Mailbox) ──│
      │    Exchanges SDP Offers, Answers & ICE     │
      │                                            │
      ▼                                            ▼
┌────────────────────────────────────────────────────────┐
│             Direct WebRTC Media Connection             │
│            (Encrypted via DTLS 1.3 / SRTP)             │
│                                                        │
│  [Audio & Video] ◀───────────────────▶ [Audio & Video] │
│  [Screen Share]  ◀───────────────────▶ [Screen Share]  │
│  [DataChannel]   ◀───────────────────▶ [DataChannel]   │
└────────────────────────────────────────────────────────┘
                           │
       (Fallback only if symmetric NAT blocks P2P)
                           ▼
               ┌───────────────────────┐
               │   Blind TURN Relay    │
               │ (SRTP stays encrypted)│
               └───────────────────────┘
```

## 2. Ephemeral Room Lifecycle

Every room follows strict, non-reversible state transitions:

```text
[CREATED] ──▶ [WAITING] ──▶ [ACTIVE] ──▶ [ENDED]
    │             │            │
    ▼             ▼            ▼
[EXPIRED]     [EXPIRED]    [DESTROYED]
```

- **CREATED:** Room record generated with cryptographically random ID (`vny-xxxx-xxxx-xxxx`) and 60-minute TTL.
- **WAITING:** First participant joined waiting room and tested devices.
- **ACTIVE:** 2 or more participants joined (up to `MAX_ROOM_PARTICIPANTS`, default 8).
- **ENDED:** Last participant left without manual destruction.
- **DESTROYED:** Creator clicked "End & Destroy Room". Server wipes all signalling messages and session records immediately. Re-entry returns HTTP 410 Gone.
- **EXPIRED:** Auto-cleanup when room reaches 60 minutes of inactivity.

## 3. WebRTC Signalling Architecture

- **Signalling Transport:** Serverless Next.js API endpoints (`/api/rooms/[roomId]/signal`).
- **Targeted Signals:** Messages can be broadcast or targeted (`targetId`) to enable multi-peer mesh (2–8 participants).
- **Polling Loop:** Short polling (1000ms) only during the 2-second connection establishment phase.
- **DataChannel Control:** Once connected, in-call peer signaling (mute notifications, destroy events, screen sharing indicators) switches to zero-latency WebRTC DataChannels.

## 4. Privacy & Data Separation Model

| System Layer | Data Processed | Persistence | Encryption |
| --- | --- | --- | --- |
| **Media Stream** | Audio, Video, Screen | Zero (in-memory buffers only) | DTLS-SRTP end-to-end |
| **Signalling** | SDP offer/answer, ICE candidates | Ephemeral RAM (wiped on destroy) | TLS 1.3 in transit |
| **Product Analytics** | AnonymousId (`anon_...`), coarse geo, events | Max 30 days raw, then aggregate | TLS 1.3 in transit |
| **Conversation Content** | Speech, text, video pixels | **NEVER STORED** | N/A |

## 5. Scaling Strategy (Stages 1–4)

1. **Stage 1 (Current):** P2P mesh for 2–3 peers + managed TURN fallback.
2. **Stage 2 (10k–100k MAU):** P2P for 2 peers, Managed SFU (LiveKit/mediasoup) for 4–8 participants.
3. **Stage 3 (100k–1M MAU):** Multi-region SFU with continental Anycast edges.
4. **Stage 4 (1M+ MAU):** Hybrid self-hosted sovereign clusters for enterprise data residency.
