import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { I18nProvider } from '@/lib/i18n/context';
import { ShieldCheck, Network, Lock, Cpu, Server, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Architecture — Vanyshe',
  description: 'Technical overview of Vanyshe WebRTC encryption, DTLS-SRTP, signalling architecture, and room destruction.',
};

export default function SecurityPage() {
  return (
    <I18nProvider initialLocale="en">
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
              Architecture & Cryptography
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2 mb-4">
              Security Architecture
            </h1>
            <p className="text-sm text-zinc-500">
              Technical explanation of media encryption, peer negotiation, and ephemeral room destruction.
            </p>
          </div>

          <div className="space-y-10 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {/* Core Topology */}
            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-emerald-500" />
                1. Media Flow Topology
              </h2>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-300 font-mono text-xs mb-4">
                <pre className="overflow-x-auto whitespace-pre">
{`Browser A (Creator)
       │
       ├─ [Signalling API] ─── Exchanges ephemeral SDP Offer/Answer/ICE
       │
       ▼
 [DTLS Handshake] ──────────── Direct browser-to-browser key exchange
       │
       ▼
 [SRTP Media Stream] ──────── Encrypted Audio, Video & Screen Sharing
       │
       ▼
Browser B (Guest)`}
                </pre>
              </div>
              <p>
                In standard network environments, media flows directly between Browser A and Browser B. Vanyshe servers only relay the initial cryptographic SDP handshake parameters and never participate in the media stream.
              </p>
            </section>

            {/* Cryptography */}
            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-emerald-500" />
                2. Established Cryptographic Standards
              </h2>
              <p>
                In strict compliance with modern security principles, <strong>Vanyshe does not invent proprietary cryptography</strong>. We leverage established browser WebRTC RFC specifications:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>DTLS 1.2 / 1.3:</strong> Datagram Transport Layer Security is used during peer connection setup to negotiate session keys directly between endpoints.</li>
                <li><strong>SRTP:</strong> Secure Real-time Transport Protocol encrypts all audio and video packet payloads (typically utilizing AES-GCM or AES-CTR with HMAC-SHA1 authentication).</li>
                <li><strong>Key Secrecy:</strong> Encryption keys are generated locally in participant browsers. The Vanyshe server does not possess these keys and cannot decrypt audio/video packets.</li>
              </ul>
            </section>

            {/* TURN Relay */}
            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-emerald-500" />
                3. NAT Traversal (STUN & TURN)
              </h2>
              <p>
                When participants are behind symmetric NATs or corporate enterprise firewalls, direct peer connections may not be routable. In those scenarios:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>STUN (Session Traversal Utilities for NAT) discovers external IP mapping.</li>
                <li>TURN (Traversal Using Relays around NAT) acts as a blind relay packet forwarder. Even when packets travel through a TURN server, the SRTP payload remains encrypted end-to-end; the relay cannot inspect the content.</li>
              </ul>
            </section>

            {/* Room Entropy */}
            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-emerald-500" />
                4. Room Identifier Entropy
              </h2>
              <p>
                Vanyshe room identifiers are generated using system CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) with over 64 bits of entropy (e.g. <code>vny-7Kx9-2mQa-P8zt</code>).
              </p>
              <p className="mt-2">
                This design prevents sequential enumeration, guessing, or automated scraping of active room links.
              </p>
            </section>

            {/* Ephemeral Destruction */}
            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                5. Ephemeral Destruction Guarantee
              </h2>
              <p>
                When a conversation is terminated:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>The creator client issues an authenticated destroy command with a secret token stored only in client <code>sessionStorage</code>.</li>
                <li>The server immediately updates room status to <code>DESTROYED</code> and purges all signalling mailboxes.</li>
                <li>WebRTC PeerConnections are immediately closed, dropping all active tracks.</li>
                <li>Subsequent requests to join or access the room return HTTP 410 / "Conversation destroyed".</li>
              </ul>
            </section>

            {/* Privacy Shield & Capture Detection */}
            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                6. Vanyshe Privacy Shield &amp; Capture Detection
              </h2>
              <p>
                Vanyshe includes a purpose-built security and capture-awareness module called <strong>Privacy Shield</strong>. Because standard web applications run in a sandboxed browser environment, technical honesty regarding screen capture boundaries is paramount:
              </p>
              
              <div className="mt-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-4">
                <div>
                  <h3 className="font-semibold text-zinc-950 dark:text-white text-sm mb-1">In-Transit vs Local Rendering Decryption</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    WebRTC DTLS-SRTP rigorously safeguards media while it is in transit over the network. However, once media packets reach a peer device, the browser WebRTC engine must decrypt them into raw frames to render them on the display and audio output hardware. At that point, the media exists inside the client device display buffer.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-950 dark:text-white text-sm mb-1">What Privacy Shield Detects</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <li><strong>PrintScreen Key Events:</strong> Captured on supported desktop operating systems (Windows, Linux) via standard DOM keyboard events.</li>
                    <li><strong>Operating System Screenshot Shortcuts:</strong> Heuristic sequence monitoring for Windows Snipping Tool (<code>Win+Shift+S</code>) and macOS Grab/Screenshots (<code>Cmd+Shift+3/4/5</code>), correlated with window blur timestamps.</li>
                    <li><strong>Browser-Initiated Capture:</strong> Detects in-page screen sharing (<code>getDisplayMedia</code>) and distinguishes intentional Vanyshe screen shares from third-party window capture.</li>
                    <li><strong>Window Visibility Fluctuations:</strong> Flags suspicious focus loss when correlated with capture keystrokes.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-950 dark:text-white text-sm mb-1">Browser Sandbox &amp; Hardware Boundaries</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Operating system isolation models deliberately prevent unprivileged web pages from observing or interfering with external processes. Consequently, no web browser can detect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <li>Background OS-level recording applications (e.g., OBS Studio, QuickTime Player, Windows Game Bar).</li>
                    <li>Hardware-level capture devices (HDMI/DisplayPort capture cards, KVM recorders).</li>
                    <li>External physical recording (e.g., another smartphone or camera pointed at the screen).</li>
                    <li>Hardware screenshot key combinations on mobile operating systems (iOS and Android native buttons bypass web DOM events).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-950 dark:text-white text-sm mb-1">Mitigation &amp; Room Policy Enforcement</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    To deter unauthorized capture where detection is physically bounded, Vanyshe deploys defense-in-depth measures:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <li><strong>Dynamic Watermarking:</strong> Overlays shifting semi-transparent room IDs and timestamps over video feeds, rendering surreptitious re-sharing non-repudiable and attributable.</li>
                    <li><strong>Configurable Capture Policies:</strong> Room creators can set rooms to <code>DETECT_ALERT</code> (broadcasts warnings immediately to all peers upon detection) or <code>STRICT</code> (immediately pauses the room and blurs video until participants acknowledge the event).</li>
                    <li><strong>No Server Replay Infrastructure:</strong> Vanyshe never stores, buffers, or records calls on server infrastructure.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
