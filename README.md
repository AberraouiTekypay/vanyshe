# Vanyshe

> **Say it. Don’t save it.**  
> *A private conversation that doesn’t become a permanent record.*

Vanyshe is an ephemeral, browser-to-browser communication product designed around radical simplicity and zero retention.

## Core Flow

```text
CREATE ROOM → COPY LINK → JOIN → TALK → END → DESTROY
```

## Features

- **Radically Simple Video Calling:** No account required, no login wall, zero friction.
- **Vanyshe Privacy Shield (Capture Detection):** Real-time monitoring for supported capture activity (PrintScreen keys, OS shortcut sequence heuristics, in-page screen sharing) with room policies (`OFF`, `DETECT_ALERT`, `STRICT`).
- **Dynamic Visual Watermark:** Non-repudiable shifting overlay with room ID and timestamps across media tiles to deter unauthorized screen sharing.
- **Pre-Allocated Media Transceivers:** Unified Plan audio & video transceivers pre-negotiated from connection establishment, enabling instantaneous, seamless camera toggling without SDP renegotiation glare.
- **True Ephemeral Lifecycle:** Explicit room states (`CREATED`, `WAITING`, `ACTIVE`, `ENDED`, `EXPIRED`, `DESTROYED`). When the creator ends the call, room state and temporary signalling mailboxes are wiped permanently.
- **Multilingual & True RTL:** Production-quality English (`/en`), French (`/fr`), and Arabic (`/ar`) with complete right-to-left layout and typography.
- **Multi-Participant Rooms:** Configurable limit supporting 2–8 participants (`MAX_ROOM_PARTICIPANTS=8`).
- **Standard WebRTC Media:** Direct DTLS-SRTP encrypted peer media, with STUN and blind TURN relay fallback across strict firewalls.
- **First-Party Anonymous Product Analytics:** "Measure the product. Never measure the conversation." Strict architectural separation guaranteeing zero conversation payloads, audio, video, transcripts, or messages enter analytics.
- **Founder Admin Command Center:** Secure protected dashboard (`/admin`) displaying KPIs, conversion funnels, retention cohorts, technology health, infrastructure bandwidth, unit economics, cost alerts, and exportable CSV reports.
- **Auditable Governance:** Full `/admin/data-dictionary`, `/admin/infrastructure-playbook`, and `/admin/infrastructure-dependencies`.

## Technology Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Real-Time Media:** WebRTC (DTLS-SRTP), RFC 5389 STUN, RFC 5766 TURN fallback
- **Signalling:** Vanyshe Serverless Ephemeral Mailbox API
- **Testing:** Vitest (100% test pass rate across unit, integration, and security tests)
- **Deployment:** Vercel Global Edge Network

## Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/AberraouiTekypay/vanyshe.git
cd vanyshe

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run test suite
npm test

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Admin Dashboard

Access the private admin dashboard at:
- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Password:** `vanyshe-founder-2026` (configure via `ADMIN_PASSWORD` in `.env.local`)

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Secure password for `/admin` access | `vanyshe-founder-2026` |
| `ADMIN_SECRET` | 32-character secret for HMAC session signing | `vanyshe_secure_admin_secret_key_8f72a9103c` |
| `MAX_ROOM_PARTICIPANTS` | Maximum participants per ephemeral room | `8` |
| `NEXT_PUBLIC_APP_URL` | Canonical product URL | `https://vanyshe.com` |

## Security & Privacy Highlights

1. **Zero Retention:** We do not store audio, video, chat logs, transcripts, or recordings.
2. **Established Cryptography:** We do not invent proprietary crypto. We rely on standard WebRTC DTLS 1.2/1.3 and SRTP AES encryption.
3. **No Third-Party Trackers:** No Google Analytics, Meta Pixel, FullStory, or Hotjar scripts are loaded.
4. **Data Separation:** The analytics pipeline cannot accept or process messages or conversation payloads.

## License

Proprietary © 2026 Vanyshe. All rights reserved.
