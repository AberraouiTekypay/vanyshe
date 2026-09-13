import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import { I18nProvider } from '@/lib/i18n/context';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanyshe — Private Conversations That Don’t Stay',
  description:
    'Private conversations, designed to disappear. Create a room, send one link, talk securely, and end the conversation. Vanyshe doesn’t retain your call.',
  alternates: {
    canonical: 'https://vanyshe.com/en',
  },
};

export default function EnglishPage() {
  return (
    <I18nProvider initialLocale="en">
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
