import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import { I18nProvider } from '@/lib/i18n/context';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanyshe — محادثات خاصة لا تبقى محفوظة',
  description:
    'محادثات خاصة مصممة لتختفي. أنشئ غرفة، أرسل رابطًا واحدًا، تحدث بخصوصية، ثم أنهِ المحادثة. Vanyshe لا تحتفظ بمحادثتك.',
  alternates: {
    canonical: 'https://vanyshe.com/ar',
  },
};

export default function ArabicPage() {
  return (
    <I18nProvider initialLocale="ar">
      <div dir="rtl" className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
