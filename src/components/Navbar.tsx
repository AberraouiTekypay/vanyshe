'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { SupportedLocale } from '@/lib/types';
import { Globe, Menu, X, Shield, ArrowRight, Video, Lock, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics-client';

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleStartCall = async () => {
    setCreating(true);
    trackEvent('landing_cta_clicked', { language: locale });

    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: locale }),
      });
      const data = await res.json();
      if (data.roomId) {
        // Save creator token locally in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`vanyshe_creator_${data.roomId}`, data.creatorToken);
        }
        router.push(`/r/${data.roomId}`);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
      setCreating(false);
    }
  };

  const languages: { code: SupportedLocale; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">
              Vanyshe
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 bg-zinc-100/50 dark:bg-zinc-900/50">
              Ephemeral
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#how-it-works" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.nav.howItWorks}
            </a>
            <a href="#use-cases" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.nav.useCases}
            </a>
            <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {locale === 'fr' ? 'Tarifs' : locale === 'ar' ? 'الأسعار' : 'Pricing'}
            </a>
            <a href="#privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.nav.privacy}
            </a>
            <a href="#security" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.nav.security}
            </a>
            <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              {t.nav.faq}
            </a>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Selector */}
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100/70 dark:bg-zinc-900/70 text-xs">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                  locale === lang.code
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
                aria-label={`Switch to ${lang.label}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Admin link */}
          <Link
            href="/admin"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-2.5 py-1 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>{t.nav.admin}</span>
          </Link>

          {/* Start Conversation CTA Button */}
          <button
            onClick={handleStartCall}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer hover:shadow-md hover:shadow-emerald-500/10 active:scale-[0.98]"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            ) : (
              <Video className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            )}
            <span>{creating ? t.hero.creatingRoom : t.nav.startCta}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t.nav.howItWorks}
          </a>
          <a
            href="#use-cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t.nav.useCases}
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {locale === 'fr' ? 'Tarifs' : locale === 'ar' ? 'الأسعار' : 'Pricing'}
          </a>
          <a
            href="#privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t.nav.privacy}
          </a>
          <a
            href="#security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t.nav.security}
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t.nav.faq}
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t.nav.admin}
          </Link>
        </div>
      )}
    </header>
  );
}
