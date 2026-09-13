'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { trackEvent } from '@/lib/analytics-client';
import RoomPreview from './RoomPreview';
import {
  ShieldCheck,
  Video,
  ArrowRight,
  ArrowLeft,
  Lock,
  ChevronDown,
  Sparkles,
  Zap,
  Globe2,
  Trash2,
  Share2,
  CheckCircle2,
  Server,
} from 'lucide-react';

export default function LandingPage() {
  const { t, locale, dir } = useI18n();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isRtl = dir === 'rtl';

  const handleCreateRoom = async () => {
    setCreating(true);
    trackEvent('room_created', { language: locale });

    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: locale }),
      });
      const data = await res.json();
      if (data.roomId) {
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={`w-full overflow-hidden ${isRtl ? 'font-sans' : ''}`}>
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-xs text-zinc-600 dark:text-zinc-400 mb-6 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t.tagline}</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1] mb-6">
            {t.hero.headline}
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.supporting}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={handleCreateRoom}
              disabled={creating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl shadow-lg transition-all disabled:opacity-50 group cursor-pointer"
            >
              <Video className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
              <span>{creating ? t.hero.creatingRoom : t.hero.primaryCta}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {t.hero.secondaryCta}
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-zinc-500">
            {t.hero.trustIndicators.map((ind, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Room Preview Visual */}
        <div className="mt-14 px-4 sm:px-6 lg:px-8">
          <RoomPreview />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
              {t.howItWorks.sectionTitle}
            </h2>
            <p className="text-sm text-zinc-500">
              CREATE ROOM → COPY LINK → JOIN → TALK → END → DESTROY
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-6">
                <Zap className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-2">
                {t.howItWorks.step1Title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howItWorks.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-6">
                <Share2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-2">
                {t.howItWorks.step2Title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howItWorks.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-6">
                <Trash2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-2">
                {t.howItWorks.step3Title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howItWorks.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="py-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-3 mb-6">
            {t.valueProp.headline}
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            {t.valueProp.body1}
          </p>
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-sm font-medium text-zinc-900 dark:text-zinc-200">
            {t.valueProp.body2}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="py-24 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
              {t.useCases.title}
            </h2>
            <p className="text-sm text-zinc-500">
              {t.useCases.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.useCases.items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs"
              >
                <h3 className="text-base font-semibold text-zinc-950 dark:text-white mb-2">
                  {item.role}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-2xl mx-auto italic">
              {t.useCases.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* PRIVACY SECTION */}
      <section id="privacy" className="py-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Privacy by Design
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-3 mb-4">
              {t.privacySection.title}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              {t.privacySection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.privacySection.points.map((pt, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {pt.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center text-xs text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            {t.privacySection.auditNote}
          </div>
        </div>
      </section>

      {/* SECURITY ARCHITECTURE */}
      <section id="security" className="py-24 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-400 font-semibold">
              Transparent Engineering
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-2 mb-3">
              {t.securityArch.title}
            </h2>
            <p className="text-sm text-zinc-400">
              {t.securityArch.subtitle}
            </p>
          </div>

          {/* Architecture topology visual */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 font-mono text-xs">
            <div className="text-zinc-400 mb-6 flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-zinc-200 font-medium">{t.securityArch.diagramTitle}</span>
              <span className="text-emerald-400">DTLS-SRTP v1.3</span>
            </div>

            <div className="space-y-4 text-zinc-300">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{t.securityArch.peerDirect}</span>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center gap-3 text-zinc-400">
                <Server className="w-4 h-4 text-zinc-500" />
                <span>{t.securityArch.turnRelay}</span>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-4">
              {t.securityArch.encryptionNote}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {t.faq.title}
            </h2>
          </div>

          <div className="space-y-4">
            {t.faq.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-sm text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  style={{ textAlign: isRtl ? 'right' : 'left' }}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 text-center bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
            {t.closingCta.headline}
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 mb-8">
            {t.closingCta.subtext}
          </p>
          <button
            onClick={handleCreateRoom}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl shadow-xl transition-all disabled:opacity-50 cursor-pointer group"
          >
            <Video className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
            <span>{creating ? t.hero.creatingRoom : t.closingCta.button}</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
