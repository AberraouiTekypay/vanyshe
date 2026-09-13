import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { I18nProvider } from '@/lib/i18n/context';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Vanyshe',
  description: 'Terms of service and acceptable use guidelines for Vanyshe ephemeral communication.',
};

export default function TermsPage() {
  return (
    <I18nProvider initialLocale="en">
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
              Terms & Conditions
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2 mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-zinc-500">
              Product prototype & testing terms. Formal review required prior to commercial operations.
            </p>
          </div>

          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">1. The Nature of the Service</h2>
              <p>
                Vanyshe provides a web-based, ephemeral peer-to-peer audio and video communication platform. Rooms are temporary by design and are destroyed upon session conclusion or expiry.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">2. Acceptable Use Policy</h2>
              <p>
                You agree not to use Vanyshe to engage in illegal, harassing, threatening, or abusive behavior, or to transmit malware or unsolicited communications. Because rooms are ephemeral, abusive activity reports are handled with rate-limiting and IP throttling at the infrastructure boundary.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">3. Statutory & Regulatory Retention Obligations</h2>
              <p className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs sm:text-sm font-medium">
                <strong>Important Notice:</strong> Some industries, organizations, and legal jurisdictions mandate the retention of business communications (such as financial transactions, healthcare disclosures, or formal notices). Vanyshe is designed for private conversational use and should NOT be used to bypass legal, regulatory, or organizational record-retention duties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">4. Disclaimer of Warranties & Limitation of Liability</h2>
              <p>
                The service is provided "AS IS" and "AS AVAILABLE" without warranty of any kind. Vanyshe shall not be liable for any indirect, consequential, or incidental damages arising from connection interruptions or participant actions.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
