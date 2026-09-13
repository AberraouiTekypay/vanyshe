'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { SupportedLocale } from '@/lib/types';
import { ShieldCheck, Lock } from 'lucide-react';

export default function Footer() {
  const { t, locale, setLocale } = useI18n();

  const languages: { code: SupportedLocale; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                Vanyshe
              </span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.footer.links.privacy}
            </Link>
            <Link href="/security" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.footer.links.security}
            </Link>
            <Link href="/terms" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.footer.links.terms}
            </Link>
            <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.footer.links.faq}
            </a>
            <Link href="/admin" className="flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.footer.links.admin}</span>
            </Link>
          </div>

          {/* Language selector in footer */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Language:</span>
            <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 rounded-md p-0.5 bg-white dark:bg-zinc-900">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLocale(l.code)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    locale === l.code
                      ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-950 dark:text-white'
                      : 'hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-600">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Ephemeral WebRTC peer media — Zero storage retention</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
