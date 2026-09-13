import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import { I18nProvider } from '@/lib/i18n/context';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanyshe — Des conversations privées qui ne restent pas',
  description:
    'Des conversations privées conçues pour disparaître. Créez une salle, envoyez un seul lien, échangez en toute confidentialité, puis fermez la conversation. Vanyshe ne conserve pas votre conversation.',
  alternates: {
    canonical: 'https://vanyshe.com/fr',
  },
};

export default function FrenchPage() {
  return (
    <I18nProvider initialLocale="fr">
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
