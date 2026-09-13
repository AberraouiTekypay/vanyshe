import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Layers, GitBranch, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infrastructure Playbook — Vanyshe Admin',
  description: 'Architectural transition playbook and decision framework for Vanyshe ephemeral communication.',
};

export default function InfrastructurePlaybookPage() {
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
            <span>Adaptive Scaling & Infrastructure Playbook</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Stages 1–4
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-10">
        {/* Guiding Philosophy */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Scaling Philosophy: Usage First, Infrastructure Second</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            Vanyshe avoids premature over-engineering. We scale infrastructure only when verified usage data and unit economics mandate it.
            Under no circumstances does an infrastructure optimization compromise the zero-conversation-retention privacy guarantee.
          </p>
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
            <strong>CRITICAL RULE:</strong> The platform will never automatically switch providers, change WebRTC architectures, or restart live clusters without explicit human review and approval.
            <div className="text-emerald-400 mt-1 font-semibold">
              Sequence: Detect → Analyze → Recommend → Human Approval → Deploy
            </div>
          </div>
        </div>

        {/* Decision Framework: Green / Amber / Red */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Decision Framework
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-400 font-mono text-sm">GREEN (Healthy)</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                Connection success &gt; 95%, TURN usage &lt; 20%, infrastructure cost &lt; $0.005/min.
              </p>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold block">
                ACTION: Maintain current architecture.
              </span>
            </div>

            <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-bold text-amber-400 font-mono text-sm">AMBER (Investigate)</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                Connection success &lt; 95%, TURN fallback &gt; 20%, or average group size &gt; 3.0 participants.
              </p>
              <span className="text-[11px] font-mono text-amber-400 font-semibold block">
                ACTION: Review ICE gathering & evaluate SFU adapter.
              </span>
            </div>

            <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-bold text-red-400 font-mono text-sm">RED (Constrained)</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                Frequent call drops, severe client CPU bottlenecks in group rooms, or cost per min &gt; $0.02.
              </p>
              <span className="text-[11px] font-mono text-red-400 font-semibold block">
                ACTION: Deploy managed SFU routing for group tiers.
              </span>
            </div>
          </div>
        </div>

        {/* 4 Evolutionary Stages */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Infrastructure Evolution Stages
          </h3>

          {/* Stage 1 */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                Stage 1 (Current Active Architecture)
              </span>
              <span className="text-xs font-mono text-zinc-500">0 – 10,000 MAU</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Direct WebRTC P2P + Ephemeral Serverless Signalling + Standard STUN/TURN
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong>Topology:</strong> Direct browser-to-browser mesh for 2–3 participants, falling back to TURN relay only when strict symmetric NAT firewalls prevent direct packet traversal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-400 pt-2">
              <div>• Server Cost: Ultra-low (~$20/mo)</div>
              <div>• Privacy: Media never touches Vanyshe servers</div>
              <div>• Operational Overhead: Near zero</div>
              <div>• Limitation: Uplink load increases with 4+ participants</div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 px-2 py-0.5 rounded bg-zinc-800">
                Stage 2 (Planned Group Optimization)
              </span>
              <span className="text-xs font-mono text-zinc-500">10,000 – 100,000 MAU</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              P2P for 2–3 Peers + Managed SFU Routing for 4–8 Participants
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong>Topology:</strong> Calls with 2 participants remain 100% direct P2P. Rooms with 4–8 participants route through an ephemeral Selective Forwarding Unit (e.g. LiveKit or mediasoup managed instance) to ensure mobile battery efficiency and prevent upstream bandwidth degradation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-400 pt-2">
              <div>• Estimated Cost: ~$150 – $350/mo</div>
              <div>• Privacy: SFU acts as blind packet forwarder; zero storage</div>
              <div>• Benefit: Mobile devices stay cool and bandwidth efficient</div>
              <div>• Trigger: Group room percentage &gt; 35%</div>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400 px-2 py-0.5 rounded bg-zinc-800">
                Stage 3 (Scale & Global Edge)
              </span>
              <span className="text-xs font-mono text-zinc-500">100,000 – 1,000,000 MAU</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Multi-Region SFU with Geo-Distributed Edge Routing
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong>Topology:</strong> Anycast routing directs peers to the nearest continental media edge (North Africa/EU/Gulf/Americas), minimizing round-trip latency for intercontinental private calls.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-400 pt-2">
              <div>• Estimated Cost: ~$1,200 – $4,000/mo</div>
              <div>• Privacy: Local regional processing, zero transatlantic data storage</div>
              <div>• Benefit: Consistent sub-60ms media RTT globally</div>
              <div>• Trigger: International concurrency &gt; 500 simultaneous calls</div>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-500 px-2 py-0.5 rounded bg-zinc-800">
                Stage 4 (Enterprise & Self-Hosted)
              </span>
              <span className="text-xs font-mono text-zinc-500">1,000,000+ MAU</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Hybrid Dedicated Infrastructure + Sovereign Regional Clusters
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong>Topology:</strong> Bare-metal or dedicated sovereign cloud instances deployed strictly when enterprise sovereign compliance (e.g. EU GDPR sovereign clouds or Morocco data sovereignty) mandates air-gapped on-premise relay nodes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
