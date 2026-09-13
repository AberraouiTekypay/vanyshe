import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Server, Lock, Database, CheckCircle2, XCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Provider Dependency Map — Vanyshe Admin',
  description: 'Auditable third-party provider dependency map for enterprise due diligence and data governance.',
};

interface DependencyEntry {
  serviceType: string;
  provider: string;
  dataReceived: string;
  whyReceived: string;
  seesMedia: boolean;
  storesData: boolean;
  retention: string;
  region: string;
  costModel: string;
  lockInRisk: 'Low' | 'Medium' | 'High';
  replacementStrategy: string;
}

const DEPENDENCY_MAP: DependencyEntry[] = [
  {
    serviceType: 'Application Hosting',
    provider: 'Vercel Inc.',
    dataReceived: 'HTTP request headers, edge IP address for transient packet routing',
    whyReceived: 'Serve Next.js static assets and execute serverless API routes',
    seesMedia: false,
    storesData: false,
    retention: 'Transient execution only (edge cache logs 24h)',
    region: 'Global Anycast (iad1 primary)',
    costModel: 'Usage-based compute (~$20/mo baseline)',
    lockInRisk: 'Low',
    replacementStrategy: 'Standard Next.js container deployable on Docker, AWS ECS, Fly.io, or self-hosted VPS.',
  },
  {
    serviceType: 'Signalling & Coordination',
    provider: 'Vanyshe Native API',
    dataReceived: 'Ephemeral SDP offers/answers, ICE candidate strings, participant join/leave events',
    whyReceived: 'Coordinate initial WebRTC peer connection setup between browsers',
    seesMedia: false,
    storesData: false,
    retention: 'In-memory only. Purged immediately upon room destruction or 60-min expiry',
    region: 'App server edge',
    costModel: '$0.00 incremental',
    lockInRisk: 'Low',
    replacementStrategy: 'Self-contained code in repository; zero external vendor lock-in.',
  },
  {
    serviceType: 'STUN Discovery',
    provider: 'Google / Cloudflare Public STUN',
    dataReceived: 'UDP bind request packets to discover public IP/port mapping',
    whyReceived: 'Enable NAT traversal for direct peer-to-peer WebRTC connections',
    seesMedia: false,
    storesData: false,
    retention: 'Zero retention (stateless UDP query)',
    region: 'Global Anycast',
    costModel: 'Free (public RFC 5389 standards)',
    lockInRisk: 'Low',
    replacementStrategy: 'Can swap with any RFC 5389 STUN server in next.config.ts in seconds.',
  },
  {
    serviceType: 'TURN Relay (Fallback)',
    provider: 'Cloudflare Calls / Managed Coturn',
    dataReceived: 'Encrypted SRTP packet stream (when symmetric NAT blocks direct P2P)',
    whyReceived: 'Blind packet forwarding across corporate firewalls',
    seesMedia: false, // SRTP is end-to-end encrypted; TURN server cannot decrypt!
    storesData: false,
    retention: 'Zero retention (stateless UDP/TCP packet forwarding)',
    region: 'Global Edge',
    costModel: 'Bandwidth consumed ($0.09/GB egress)',
    lockInRisk: 'Low',
    replacementStrategy: 'Standard RFC 5766 TURN protocol; can point to open-source Coturn on Hetzner/AWS.',
  },
  {
    serviceType: 'Database & Persistent Storage',
    provider: 'None (Zero-Retention Architecture)',
    dataReceived: 'None',
    whyReceived: 'N/A — Vanyshe does not retain conversations, transcripts, recordings, or user profiles',
    seesMedia: false,
    storesData: false,
    retention: 'Zero persistence by design',
    region: 'N/A',
    costModel: '$0.00',
    lockInRisk: 'Low',
    replacementStrategy: 'Architecture fundamentally rejects unnecessary persistent stores.',
  },
  {
    serviceType: 'CDN & DNS',
    provider: 'Vercel / Cloudflare DNS',
    dataReceived: 'DNS lookup requests and encrypted HTTPS handshakes',
    whyReceived: 'Resolve vanyshe.com domain and deliver SSL/TLS certificates',
    seesMedia: false,
    storesData: false,
    retention: 'Standard edge DNS caching',
    region: 'Global Anycast',
    costModel: 'Included in domain / edge',
    lockInRisk: 'Low',
    replacementStrategy: 'Universal DNS standard; transferable to Route53, Cloudflare, or Gandi.',
  },
  {
    serviceType: 'Product Telemetry',
    provider: 'Vanyshe First-Party Engine',
    dataReceived: 'AnonymousId (anon_...), coarse country, device category, hashed room ref',
    whyReceived: 'Measure service reliability and uptime without invading privacy',
    seesMedia: false,
    storesData: false, // 30-day ephemeral event buffer only
    retention: 'Max 30 days, then rolled into aggregate counts',
    region: 'App server edge',
    costModel: '$0.00 incremental',
    lockInRisk: 'Low',
    replacementStrategy: 'Native repository code; no third-party analytics trackers (No GA, No Pixel).',
  },
];

export default function InfrastructureDependenciesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <header className="border-b border-zinc-800 bg-zinc-900/60 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Command Center</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span>Provider Dependency & Data Flow Map</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Audit-Ready
            </span>
          </h1>
        </div>

        <Link
          href="/admin"
          className="text-xs text-zinc-400 hover:text-white font-mono transition-colors"
        >
          Console
        </Link>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Intro */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <span>Third-Party Dependency Audit & Data Governance</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            To satisfy enterprise security audits and legal compliance reviews, this register documents every third-party infrastructure service utilized by Vanyshe, exactly what data it receives, and its data retention properties.
          </p>
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Zero Media Retention Guarantee: No third-party provider ever receives unencrypted audio, video, screen-share streams, or conversation records.</span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-4">Service Type</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Data Received</th>
                  <th className="p-4 text-center">Sees Media?</th>
                  <th className="p-4 text-center">Stores Data?</th>
                  <th className="p-4">Retention</th>
                  <th className="p-4">Lock-in Risk</th>
                  <th className="p-4">Portability Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {DEPENDENCY_MAP.map((dep, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/80">
                    <td className="p-4 font-bold text-white whitespace-nowrap">
                      {dep.serviceType}
                    </td>
                    <td className="p-4 text-emerald-400 whitespace-nowrap">
                      {dep.provider}
                    </td>
                    <td className="p-4 text-zinc-300 min-w-[220px]">
                      {dep.dataReceived}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {dep.seesMedia ? (
                        <span className="text-red-400 font-semibold">Yes</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> No
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {dep.storesData ? (
                        <span className="text-amber-400 font-semibold">Yes</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> No
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-400 whitespace-nowrap">
                      {dep.retention}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] text-zinc-300">
                        {dep.lockInRisk}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400 min-w-[200px]">
                      {dep.replacementStrategy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
