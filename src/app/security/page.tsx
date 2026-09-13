import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { I18nProvider } from '@/lib/i18n/context';
import { ShieldCheck, Network, Lock, Cpu, Server, CheckCircle2 } from 'lucide-react';
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
          </div>
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
