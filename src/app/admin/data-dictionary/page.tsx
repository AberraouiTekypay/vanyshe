import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Database, CheckCircle2, XCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Data Dictionary — Vanyshe',
  description: 'Auditable registry of all first-party product events, metadata fields, retention rules, and privacy controls.',
};

interface DataDictionaryEntry {
  eventName: string;
  category: 'Acquisition' | 'Funnel' | 'Media Controls' | 'Retention';
  meaning: string;
  dataCollected: string[];
  whyCollected: string;
  retention: string;
  containsIdentifier: boolean;
  containsPersonalData: boolean;
}

const EVENTS_CATALOG: DataDictionaryEntry[] = [
  {
    eventName: 'page_view',
    category: 'Acquisition',
    meaning: 'Landing page loaded by a visitor browser.',
    dataCollected: ['anonymousId', 'sessionId', 'language', 'country', 'deviceCategory', 'browserCategory', 'referrerCategory'],
    whyCollected: 'Measure landing page traffic volume and coarse geographic distribution.',
    retention: '30 days raw, then rolled into aggregate counts',
    containsIdentifier: true, // random anon_... only
    containsPersonalData: false,
  },
  {
    eventName: 'landing_cta_clicked',
    category: 'Acquisition',
    meaning: 'User clicked primary or secondary CTA to initiate room creation.',
    dataCollected: ['anonymousId', 'sessionId', 'language'],
    whyCollected: 'Track landing page intent and conversion to room creation.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'language_selected',
    category: 'Acquisition',
    meaning: 'User changed interface language (en, fr, or ar).',
    dataCollected: ['anonymousId', 'language'],
    whyCollected: 'Understand localization usage and RTL preferences.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'room_created',
    category: 'Funnel',
    meaning: 'New ephemeral room successfully generated.',
    dataCollected: ['anonymousId', 'roomSafeRef (SHA-256 hash)', 'sessionId', 'language', 'deviceCategory', 'country'],
    whyCollected: 'Measure core product creation volume and founder KPIs.',
    retention: '30 days raw, lifetime aggregate count',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'room_link_copied',
    category: 'Funnel',
    meaning: 'Room creator copied room URL to clipboard to share.',
    dataCollected: ['anonymousId', 'roomSafeRef (SHA-256 hash)', 'sessionId'],
    whyCollected: 'Measure the viral sharing conversion step.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'room_joined',
    category: 'Funnel',
    meaning: 'Participant joined waiting room or active call.',
    dataCollected: ['anonymousId', 'roomSafeRef (SHA-256 hash)', 'sessionId', 'language'],
    whyCollected: 'Verify second user link receipt and entry.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'room_connection_started',
    category: 'Funnel',
    meaning: 'WebRTC RTCPeerConnection negotiation initiated.',
    dataCollected: ['anonymousId', 'sessionId', 'browserCategory'],
    whyCollected: 'Track technical handshake initialization.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'room_connection_established',
    category: 'Funnel',
    meaning: 'WebRTC peer connection state reached connected.',
    dataCollected: ['anonymousId', 'sessionId', 'browserCategory', 'country'],
    whyCollected: 'Measure true technical reliability and NAT traversal success rate.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'call_started',
    category: 'Funnel',
    meaning: 'Audio and video media exchange begins between peers.',
    dataCollected: ['anonymousId', 'roomSafeRef (SHA-256 hash)', 'sessionId'],
    whyCollected: 'Measure successful conversation starts.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'call_ended',
    category: 'Funnel',
    meaning: 'Call concluded normally by participant or creator.',
    dataCollected: ['anonymousId', 'roomSafeRef (SHA-256 hash)', 'durationSeconds'],
    whyCollected: 'Calculate average conversation length (in minutes).',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'room_destroyed',
    category: 'Funnel',
    meaning: 'Creator explicitly clicked End & Destroy Room.',
    dataCollected: ['anonymousId', 'roomSafeRef (SHA-256 hash)', 'durationSeconds'],
    whyCollected: 'Track intentional room destruction rate versus expiry.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'room_expired',
    category: 'Funnel',
    meaning: 'Room passed 60-minute lifetime without manual destruction.',
    dataCollected: ['roomSafeRef (SHA-256 hash)'],
    whyCollected: 'Audit room cleanup lifecycle enforcement.',
    retention: '30 days',
    containsIdentifier: false,
    containsPersonalData: false,
  },
  {
    eventName: 'camera_enabled / camera_disabled',
    category: 'Media Controls',
    meaning: 'User toggled video track on/off.',
    dataCollected: ['anonymousId', 'deviceCategory'],
    whyCollected: 'Assess video feature adoption.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'microphone_enabled / microphone_disabled',
    category: 'Media Controls',
    meaning: 'User toggled audio mute state.',
    dataCollected: ['anonymousId'],
    whyCollected: 'Assess microphone mute usage.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'screen_share_started / screen_share_ended',
    category: 'Media Controls',
    meaning: 'User initiated or stopped getDisplayMedia screen stream.',
    dataCollected: ['anonymousId', 'browserCategory'],
    whyCollected: 'Evaluate screen sharing utility without inspecting screen pixels.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
  {
    eventName: 'return_visit',
    category: 'Retention',
    meaning: 'Previously seen anonymousId visited again after 24 hours.',
    dataCollected: ['anonymousId', 'country'],
    whyCollected: 'Calculate 7-day and 30-day cohort retention.',
    retention: '30 days',
    containsIdentifier: true,
    containsPersonalData: false,
  },
];

export default function DataDictionaryPage() {
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
            <span>Vanyshe Analytics Data Dictionary</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Audit-Ready
            </span>
          </h1>
        </div>

        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-white font-mono transition-colors"
        >
          Public Site
        </Link>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Intro */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Product Telemetry Audit Model</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            This document outlines every single event tracked by Vanyshe’s first-party analytics system.
            It provides complete transparency for founders, security auditors, and investors during technical due diligence.
          </p>
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Zero personal data guarantee: No conversation content, chat, audio, video, transcripts, names, or emails are ever tracked.</span>
          </div>
        </div>

        {/* Dictionary Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-4">Event Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Meaning & Trigger</th>
                  <th className="p-4">Fields Collected</th>
                  <th className="p-4">Why Collected</th>
                  <th className="p-4">Retention</th>
                  <th className="p-4 text-center">Anonymous ID</th>
                  <th className="p-4 text-center">Personal Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {EVENTS_CATALOG.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/80">
                    <td className="p-4 font-bold text-emerald-400 whitespace-nowrap">
                      {evt.eventName}
                    </td>
                    <td className="p-4 text-zinc-400 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[11px]">
                        {evt.category}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-200 min-w-[200px]">
                      {evt.meaning}
                    </td>
                    <td className="p-4 text-zinc-400">
                      <div className="flex flex-wrap gap-1">
                        {evt.dataCollected.map((f, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 min-w-[180px]">
                      {evt.whyCollected}
                    </td>
                    <td className="p-4 text-zinc-500 whitespace-nowrap">
                      {evt.retention}
                    </td>
                    <td className="p-4 text-center">
                      {evt.containsIdentifier ? (
                        <span className="text-zinc-400">Yes (anon_...)</span>
                      ) : (
                        <span className="text-zinc-600">None</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> No
                      </span>
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
