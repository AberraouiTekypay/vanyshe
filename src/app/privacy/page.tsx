import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { I18nProvider } from '@/lib/i18n/context';
import { Shield, Lock, EyeOff, Database, Server, RefreshCw } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Vanyshe',
  description: 'Vanyshe privacy policy: zero conversation retention, data minimization, and first-party anonymous metrics.',
};

export default function PrivacyPage() {
  return (
    <I18nProvider initialLocale="en">
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
              Legal & Privacy
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2 mb-4">
              Vanyshe Privacy Policy
            </h1>
            <p className="text-sm text-zinc-500">
              Initial draft for product testing and demonstration. Subject to formal legal counsel review prior to commercial scaling.
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-3">
                <EyeOff className="w-5 h-5 text-emerald-500" />
                1. Core Privacy Principle: Zero Conversation Retention
              </h2>
              <p>
                The defining principle of Vanyshe is simple: <strong>If we do not need your conversation to provide the service, we do not retain it.</strong>
              </p>
              <p>
                Vanyshe provides ephemeral, direct browser-to-browser audio and video communication utilizing standard WebRTC protocols. Under this architecture:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>We do <strong>not</strong> record audio or video.</li>
                <li>We do <strong>not</strong> produce or store automated transcripts.</li>
                <li>We do <strong>not</strong> retain conversation history or chat logs after room destruction.</li>
                <li>We do <strong>not</strong> monitor or listen to conversation streams.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-emerald-500" />
                2. What Data We Temporarily Process
              </h2>
              <p>
                To establish a peer-to-peer connection between two browsers, temporary technical signalling data must be exchanged:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Ephemeral Room Mailbox:</strong> Session Description Protocol (SDP) offers, answers, and ICE candidate coordinates.</li>
                <li><strong>Room Lifecycle State:</strong> Current room status (CREATED, WAITING, ACTIVE, ENDED, DESTROYED, EXPIRED).</li>
                <li><strong>Destruction Enforcement:</strong> As soon as the room creator ends the conversation, the room status is permanently updated to DESTROYED, and all signalling messages in memory are immediately purged.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-3">
                <Server className="w-5 h-5 text-emerald-500" />
                3. First-Party Product Analytics & Anonymity
              </h2>
              <p>
                To ensure service reliability, understand organic traction, and troubleshoot connection errors without compromising privacy, we maintain a strictly separated first-party analytics system:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Anonymous Identifier:</strong> We generate a random local identifier (e.g. <code>anon_8f72c1...</code>) stored in your browser. We never link this to an email address, phone number, or human name.</li>
                <li><strong>Non-Reversible Room References:</strong> Product events reference rooms only via a one-way cryptographic SHA-256 hash. Plain room links are never stored in analytics.</li>
                <li><strong>Coarse Metadata:</strong> We record aggregate metrics such as device category (mobile/desktop), browser type, and coarse country level geolocation (e.g. Morocco, France) derived from edge network headers.</li>
                <li><strong>Zero Third-Party Trackers:</strong> We do not load Google Analytics, Meta Pixel, FullStory, Hotjar, or advertising tracking networks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-3">
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                4. Data Retention Rules
              </h2>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Conversation Data:</strong> Zero retention. Destroys with the room.</li>
                <li><strong>Signalling Coordinates:</strong> Held only in ephemeral memory during negotiation. Discarded immediately upon call start or room destruction.</li>
                <li><strong>Product Analytics Events:</strong> Raw first-party event records are retained for a maximum of 30 days for operational debugging, after which they are purged or rolled into long-term aggregate counts (e.g. total rooms created).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-emerald-500" />
                5. Important Realistic Boundaries
              </h2>
              <p>
                We believe in technical honesty over marketing exaggeration:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>We do not claim conversations are "impossible to record." Any participant in any video call can independently record their own screen or audio output using external software or hardware.</li>
                <li>Vanyshe cannot prevent someone you invite from taking notes or recording on their end.</li>
                <li>Organizations with statutory, legal, or industry retention mandates (such as financial compliance) must ensure they comply with their applicable laws.</li>
              </ul>
            </section>

            <section className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-white mb-2">
                6. Contact
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                For questions regarding this privacy policy or technical data practices, contact: <code>privacy@vanyshe.com</code>.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
