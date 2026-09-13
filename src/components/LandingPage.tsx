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
  Briefcase,
  Scale,
  TrendingUp,
  Newspaper,
  HeartHandshake,
  Users,
  EyeOff,
  FileX,
  Flame,
  KeyRound,
  VideoOff,
  Check,
  X,
  Cpu,
  Radio,
  Loader2,
  Building2,
  User,
  Shield,
  Clock,
  Key,
  Database,
  ExternalLink,
  BotOff,
  FileCheck2,
} from 'lucide-react';

export default function LandingPage() {
  const { t, locale, dir } = useI18n();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [useCaseTab, setUseCaseTab] = useState<'b2b' | 'b2c'>('b2b');
  const [capturePolicy, setCapturePolicy] = useState<'DETECT_ALERT' | 'STRICT' | 'OFF'>('DETECT_ALERT');

  const isRtl = dir === 'rtl';

  const handleCreateRoom = async () => {
    setCreating(true);
    trackEvent('room_created', { language: locale });

    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: locale, capturePolicy }),
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

  // Dedicated B2B & B2C Use Cases data
  const b2bUseCases = [
    {
      role: locale === 'fr' ? 'Fusions-Acquisitions & Conseils d’Administration' : locale === 'ar' ? 'عمليات الدمج والاستحواذ ومجالس الإدارة' : 'Executive M&A & Board Deliberations',
      desc: locale === 'fr'
        ? 'Discutez de valorisations stratégiques, rachats et restructurations sans risque de fuite d’emails ou de transcription cloud.'
        : locale === 'ar'
        ? 'ناقش صفقات الاستحواذ الحساسة والقرارات الاستراتيجية دون ترك سجلات أو تفريغات سحابية قد تتسرب.'
        : 'Discuss confidential buyout terms, valuations, and strategic realignments without cloud meeting transcripts or internal leak risks.',
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
      tag: 'C-Suite',
    },
    {
      role: locale === 'fr' ? 'Négociations Fournisseurs & Achats' : locale === 'ar' ? 'مفاوضات الموردين والمشتريات' : 'Vendor Negotiations & Procurement',
      desc: locale === 'fr'
        ? 'Négociez prix et conditions commerciales sans générer de traces écrites réutilisables lors d’audits ou litiges.'
        : locale === 'ar'
        ? 'تفاوض على الأسعار والعقود التجارية بحرية تامة دون إنشاء وثائق تخضع للمراجعات القضائية أو التنافسية.'
        : 'Negotiate commercial pricing, supply agreements, and dispute settlements without creating paper trails subject to audit discovery.',
      icon: <Scale className="w-5 h-5 text-emerald-500" />,
      tag: 'Procurement',
    },
    {
      role: locale === 'fr' ? 'Secret Professionnel des Avocats & Juristes' : locale === 'ar' ? 'الاستشارات القانونية وسرية المحامين' : 'Attorney-Client Privileged Counsel',
      desc: locale === 'fr'
        ? 'Protégez le privilège avocat-client et les enquêtes internes de conformité contre toute indexation e-discovery.'
        : locale === 'ar'
        ? 'حافظ على السرية المطلقة للاستشارات القانونية والتحقيقات المؤسسية بعيدًا عن الاستدعاءات الرقمية.'
        : 'Conduct privileged consultations and internal compliance reviews immune to cloud subpoenas and automated e-discovery.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      tag: 'Legal',
    },
    {
      role: locale === 'fr' ? 'Ressources Humaines & Alertes Professionnelles' : locale === 'ar' ? 'الموارد البشرية وقنوات الإبلاغ السري' : 'Confidential HR & Whistleblower Intake',
      desc: locale === 'fr'
        ? 'Gérez les départs de dirigeants, entretiens sensibles et signalements d’éthique dans un environnement sans métadonnées.'
        : locale === 'ar'
        ? 'استقبل شكاوى الموظفين الحساسة وبلاغات النزاهة دون تسجيل أي بيانات وصفية أو هوية رقمية.'
        : 'Handle delicate employee grievances, severance negotiations, and whistleblower reports with absolute zero metadata footprints.',
      icon: <HeartHandshake className="w-5 h-5 text-emerald-500" />,
      tag: 'HR & Ethics',
    },
    {
      role: locale === 'fr' ? 'Ventes B2B Stratégiques & Feuilles de Route' : locale === 'ar' ? 'المبيعات الاستراتيجية ومعاينة الملكية الفكرية' : 'Enterprise Sales & Unreleased Roadmaps',
      desc: locale === 'fr'
        ? 'Présentez vos innovations et prix sur mesure à des clients stratégiques sans qu’un bot IA tiers n’enregistre votre propriété intellectuelle.'
        : locale === 'ar'
        ? 'اعرض مزايا منتجك وأسعارك الخاصة لكبار العملاء دون خوف من روبوتات الذكاء الاصطناعي التي تسجل الشاشات.'
        : 'Pitch enterprise buyers and reveal unreleased intellectual property in an environment where no meeting bot can record.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      tag: 'Enterprise Sales',
    },
    {
      role: locale === 'fr' ? 'Téléconsultations Médicales & Échanges Cliniques' : locale === 'ar' ? 'الاستشارات الطبية والسريرية بين الأطباء' : 'Healthcare & Clinical Peer Consultations',
      desc: locale === 'fr'
        ? 'Avis entre confrères et consultations thérapeutiques confidentielles sans engager la responsabilité sur des enregistrements cloud.'
        : locale === 'ar'
        ? 'تبادل الآراء بين الأطباء والاستشارات النفسية المباشرة دون مخاطر حفظ السجلات الصوتية على خوادم تجارية.'
        : 'Provider-to-provider second opinions and psychiatric evaluations without long-term cloud HIPAA recording liabilities.',
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      tag: 'Healthcare',
    },
  ];

  const b2cUseCases = [
    {
      role: locale === 'fr' ? 'Journalistes d’Investigation & Sources' : locale === 'ar' ? 'الصحافة الاستقصائية والمصادر السرية' : 'Investigative Journalists & Sources',
      desc: locale === 'fr'
        ? 'Communiquez directement avec vos informateurs via un flux WebRTC éphémère sans laisser d’historique de connexion.'
        : locale === 'ar'
        ? 'تواصل مع المصادر السرية عبر اتصال مشفر ومباشر بين المتصفحين يختفي فور إنهاء المكالمة.'
        : 'Communicate with sensitive sources over direct encrypted browser streams that leave zero historical footprints.',
      icon: <Newspaper className="w-5 h-5 text-emerald-500" />,
      tag: 'Press',
    },
    {
      role: locale === 'fr' ? 'Santé Personnelle & Soutien Psychologique' : locale === 'ar' ? 'الاستشارات الصحية والنفسية الخاصة' : 'Personal Health & Therapy Consultations',
      desc: locale === 'fr'
        ? 'Discutez de diagnostics ou de situations personnelles sans craindre qu’une plateforme ne conserve des enregistrements.'
        : locale === 'ar'
        ? 'تحدث في أمورك الصحية أو النفسية الخاصة دون قلق من قيام المنصات بأرشفة صوتك أو تفريغه.'
        : 'Seek personal advice and medical guidance without fear of corporate platforms retaining voice transcripts.',
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      tag: 'Personal Health',
    },
    {
      role: locale === 'fr' ? 'Patrimoine Familial & Finances Privées' : locale === 'ar' ? 'التخطيط المالي والتركات العائلية' : 'Family Wealth & Estate Planning',
      desc: locale === 'fr'
        ? 'Partagez des décisions successorales ou financières en toute intimité, hors de portée des algorithmes commerciaux.'
        : locale === 'ar'
        ? 'ناقش الترتيبات العائلية والأمور المالية بعيدًا عن الخوادم التي قد تتعرض للاختراق.'
        : 'Discuss inheritance, wills, and personal wealth matters with total peace of mind, away from advertising algorithms.',
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      tag: 'Family Finance',
    },
    {
      role: locale === 'fr' ? 'Conversations Franches Entre Deux Personnes' : locale === 'ar' ? 'المحادثات الصادقة بين شخصين' : 'Everyday Spoken Conversations',
      desc: locale === 'fr'
        ? 'Parfois, une parole dite doit simplement rester entre deux êtres humains et s’évanouir une fois l’appel terminé.'
        : locale === 'ar'
        ? 'في بعض الأحيان، يجب أن تظل الكلمات المنطوقة بين شخصين فقط وتتلاشى فور إغلاق الخط.'
        : 'Sometimes a conversation is meant to stay in the moment — spoken, understood, and forever gone.',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      tag: 'Everyday',
    },
  ];

  // Dedicated icons for privacy section
  const privacyIcons = [
    <VideoOff key="0" className="w-5 h-5 text-emerald-500" />,
    <FileX key="1" className="w-5 h-5 text-emerald-500" />,
    <Flame key="2" className="w-5 h-5 text-emerald-500" />,
    <EyeOff key="3" className="w-5 h-5 text-emerald-500" />,
    <KeyRound key="4" className="w-5 h-5 text-emerald-500" />,
    <ShieldCheck key="5" className="w-5 h-5 text-emerald-500" />,
  ];

  // Comparison data
  const comparisonItems = [
    {
      feature: locale === 'fr' ? 'Compte utilisateur' : locale === 'ar' ? 'حساب المستخدم' : 'User Account Required',
      traditional: locale === 'fr' ? 'Obligatoire (email, mot de passe, SSO)' : locale === 'ar' ? 'إلزامي (بريد إلكتروني، تسجيل دخول)' : 'Mandatory (Email, Password, SSO)',
      vanyshe: locale === 'fr' ? 'Aucun. Zéro inscription' : locale === 'ar' ? 'لا حاجة لأي حساب إطلاقًا' : 'None. Zero registration',
    },
    {
      feature: locale === 'fr' ? 'Enregistrement audio / vidéo' : locale === 'ar' ? 'تسجيل الصوت والفيديو' : 'Audio & Video Recording',
      traditional: locale === 'fr' ? 'Enregistré sur serveurs cloud & IA' : locale === 'ar' ? 'يُحفظ في السحابة وتفريغ بالذكاء الاصطناعي' : 'Saved to cloud servers & transcribed',
      vanyshe: locale === 'fr' ? 'Zéro rétention. Jamais sur disque' : locale === 'ar' ? 'صفر احتفاظ. لا يُكتب أبدًا على القرص' : 'Zero retention. Never written to disk',
    },
    {
      feature: locale === 'fr' ? 'Routage des flux média' : locale === 'ar' ? 'توجيه وسائط الاتصال' : 'Media Routing Architecture',
      traditional: locale === 'fr' ? 'Serveurs centraux d’entreprise' : locale === 'ar' ? 'خوادم مركزية تابعة للشركات' : 'Centralized corporate data servers',
      vanyshe: locale === 'fr' ? 'Direct P2P chiffré entre navigateurs' : locale === 'ar' ? 'اتصال مباشر مشفر P2P بين المتصفحات' : 'Direct encrypted P2P browser mesh',
    },
    {
      feature: locale === 'fr' ? 'Données après l’appel' : locale === 'ar' ? 'البيانات بعد انتهاء المكالمة' : 'Data After Call Ends',
      traditional: locale === 'fr' ? 'Conservé dans l’historique du compte' : locale === 'ar' ? 'محفوظ في سجل الحساب' : 'Retained in user history & logs',
      vanyshe: locale === 'fr' ? 'Purge instantanée de la mémoire RAM' : locale === 'ar' ? 'مسح فوري من ذاكرة RAM' : 'Instant memory wipe & self-destruct',
    },
    {
      feature: locale === 'fr' ? 'Traceurs publicitaires' : locale === 'ar' ? 'أدوات التتبع والإعلانات' : 'Third-Party Trackers',
      traditional: locale === 'fr' ? 'Cookies publicitaires & profilage' : locale === 'ar' ? 'ملفات تعريف ارتباط وتتبع سلوكي' : 'Ad pixels, trackers & profiling',
      vanyshe: locale === 'fr' ? '0 traceur tiers. Strictement confidentiel' : locale === 'ar' ? 'صفر أدوات تتبع. خصوصية تامة' : 'Zero third-party trackers or cookies',
    },
  ];

  return (
    <div className={`w-full overflow-hidden ${isRtl ? 'font-sans' : ''}`}>
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-grid-dots">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
          <div className="w-[640px] h-[360px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[140px] rounded-full animate-aura" />
          <div className="w-[400px] h-[250px] bg-teal-500/10 dark:bg-teal-500/15 blur-[120px] rounded-full -translate-y-24" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-950/40 text-xs font-medium text-emerald-800 dark:text-emerald-300 mb-6 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono tracking-wide">{t.tagline}</span>
            <span className="h-3 w-px bg-emerald-300/60 dark:bg-emerald-800" />
            <span className="text-[11px] opacity-80 uppercase tracking-wider font-mono">B2B & Personal Privacy</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.08] mb-6">
            {t.hero.headline}
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {t.hero.supporting}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={handleCreateRoom}
              disabled={creating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 group cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            >
              {creating ? (
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              ) : (
                <Video className="w-5 h-5 text-emerald-400 dark:text-emerald-600 transition-transform group-hover:scale-110" />
              )}
              <span>{creating ? t.hero.creatingRoom : t.hero.primaryCta}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 backdrop-blur-xs transition-all duration-200 shadow-xs"
            >
              {locale === 'fr' ? 'Découvrir les Tarifs' : locale === 'ar' ? 'عرض خطط الأسعار' : 'Explore Plans & Pricing'}
            </a>
          </div>

          {/* Quick Room Privacy Policy Configuration */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs font-mono">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Capture Policy:</span>
            </span>
            <div className="inline-flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100/70 dark:bg-zinc-900/70">
              <button
                type="button"
                onClick={() => setCapturePolicy('DETECT_ALERT')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold cursor-pointer ${
                  capturePolicy === 'DETECT_ALERT'
                    ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Detect & Alert (Default)
              </button>
              <button
                type="button"
                onClick={() => setCapturePolicy('STRICT')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold cursor-pointer ${
                  capturePolicy === 'STRICT'
                    ? 'bg-white dark:bg-zinc-800 text-red-500 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Strict Privacy
              </button>
              <button
                type="button"
                onClick={() => setCapturePolicy('OFF')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold cursor-pointer ${
                  capturePolicy === 'OFF'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-3">
            {t.hero.trustIndicators.map((ind, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xs text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{ind}</span>
              </div>
            ))}
          </div>

          {/* Platform support subtext */}
          <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-3">
            Runs natively in Chrome, Safari, Firefox, Edge, iOS & Android • No software install
          </p>
        </div>

        {/* Interactive Room Preview Visual */}
        <div className="mt-14 sm:mt-16 px-4 sm:px-6 lg:px-8">
          <RoomPreview />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 sm:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              // 3-Step Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2 mb-3">
              {t.howItWorks.sectionTitle}
            </h2>
            <div className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400">
              CREATE ROOM → SHARE LINK → TALK → DESTROY
            </div>
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative group p-8 rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  STEP 01
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2 tracking-tight">
                {t.howItWorks.step1Title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howItWorks.step1Desc}
              </p>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Entropy: 256-bit</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Instant & Free</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group p-8 rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  STEP 02
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2 tracking-tight">
                {t.howItWorks.step2Title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howItWorks.step2Desc}
              </p>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Access: One-time token</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Direct P2P Link</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group p-8 rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Trash2 className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  STEP 03
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2 tracking-tight">
                {t.howItWorks.step3Title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.howItWorks.step3Desc}
              </p>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Memory Wipe: Instant</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">0 Bytes Stored</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES WITH B2B & B2C ANGLE */}
      <section id="use-cases" className="py-24 sm:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              // Tailored Confidentiality
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white mt-2 mb-4">
              {locale === 'fr'
                ? 'Conçu pour les conversations sans trace écrite'
                : locale === 'ar'
                ? 'مصمم للمحادثات التي لا تحتمل وجود سجلات ورقية'
                : 'Built for conversations that don’t need a paper trail.'}
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              {locale === 'fr'
                ? 'Que vous soyez une entreprise protégeant ses secrets ou un particulier cherchant l’anonymat.'
                : locale === 'ar'
                ? 'سواء كنت مؤسسة تحمي أسرارها التجارية أو فردًا يبحث عن الخصوصية المطلقة.'
                : 'Whether you are an enterprise guarding board IP or an individual seeking genuine privacy.'}
            </p>

            {/* Segment Selector: B2B Enterprise vs Personal / B2C */}
            <div className="inline-flex items-center rounded-2xl border border-zinc-200 dark:border-zinc-800 p-1 bg-zinc-100/80 dark:bg-zinc-900/80 mt-8 shadow-inner">
              <button
                onClick={() => setUseCaseTab('b2b')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  useCaseTab === 'b2b'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>
                  {locale === 'fr'
                    ? '🏢 Entreprise & B2B'
                    : locale === 'ar'
                    ? '🏢 الشركات والمؤسسات (B2B)'
                    : '🏢 Business & Enterprise (B2B)'}
                </span>
              </button>

              <button
                onClick={() => setUseCaseTab('b2c')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  useCaseTab === 'b2c'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4 text-emerald-500" />
                <span>
                  {locale === 'fr'
                    ? '👤 Particuliers & Personnel (B2C)'
                    : locale === 'ar'
                    ? '👤 الأفراد والاستخدام الشخصي (B2C)'
                    : '👤 Individuals & Everyday (B2C)'}
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Cards Grid according to active tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(useCaseTab === 'b2b' ? b2bUseCases : b2cUseCases).map((item, idx) => (
              <div
                key={idx}
                className="group p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2 tracking-tight">
                  {item.role}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* B2B Enterprise Visual Spotlight Card */}
          <div className="mt-14 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6 sm:p-10 overflow-hidden relative shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: B2B Enterprise Copy */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>
                    {locale === 'fr'
                      ? 'CONÇU POUR LES DSI ET RESPONSABLES SÉCURITÉ (CISO)'
                      : locale === 'ar'
                      ? 'مصمم لمديري أمن المعلومات والشركات الكبرى'
                      : 'DESIGNED FOR CISOS & ENTERPRISE IT TEAMS'}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {locale === 'fr'
                    ? 'Pourquoi les entreprises choisissent Vanyshe contre l’espionnage par IA'
                    : locale === 'ar'
                    ? 'لماذا تفضل الشركات فانيش لحماية أسرارها من روبوتات الذكاء الاصطناعي'
                    : 'Why Enterprise Leaders Choose Vanyshe Over Cloud Video Suites'}
                </h3>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {locale === 'fr'
                    ? 'Les outils de réunion traditionnels installent des robots IA (Otter, Fireflies, Zoom AI) qui indexent vos discussions stratégiques. Avec Vanyshe, le flux vidéo reste strictement confiné entre navigateurs et disparaît à la fermeture.'
                    : locale === 'ar'
                    ? 'تقوم أدوات الاجتماعات التقليدية بنشر روبوتات تسجل وتفرغ المحادثات السرية في قواعد بيانات سحابية. مع فانيش، تظل البيانات مشفرة بين المتصفحات ومسحوبة فورًا من الذاكرة.'
                    : 'Legacy video tools automatically invite transcription bots (Otter, Fireflies, Zoom AI) that ingest and index executive conversations into cloud databases. Vanyshe offers absolute digital immunity — zero media is ever recorded or accessible.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <BotOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">
                        {locale === 'fr' ? 'Zéro indexation par IA' : locale === 'ar' ? 'حظر أدوات التفريغ الذكية' : 'Zero AI Bot Ingestion'}
                      </span>
                      <span className="text-zinc-400 text-[11px]">
                        {locale === 'fr' ? 'Empêche le pillage de votre propriété intellectuelle.' : locale === 'ar' ? 'يمنع تسرب أفكارك وملكيتك الفكرية.' : 'No automated models scrape or train on voice audio.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">
                        {locale === 'fr' ? 'Immunité aux requêtes légales' : locale === 'ar' ? 'حماية من تسريبات السجلات' : 'Subpoena & Breach Immunity'}
                      </span>
                      <span className="text-zinc-400 text-[11px]">
                        {locale === 'fr' ? 'Impossible de réquisitionner des données non enregistrées.' : locale === 'ar' ? 'لا يمكن اختراق بيانات لم يتم حفظها أصلاً.' : 'You cannot breach or subpoena data that was never saved.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Generated Visual Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl group">
                  <img
                    src="/images/b2b-enterprise-shield.jpg"
                    alt="Vanyshe Enterprise B2B Confidential Security Shield"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      <span>DTLS-SRTP Mesh Active</span>
                    </span>
                    <span className="text-zinc-400">Zero Server Media</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION & COMPARISON MATRIX */}
      <section className="py-24 sm:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              // Philosophy & Principle
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2 mb-6">
              {t.valueProp.headline}
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              {t.valueProp.body1}
            </p>
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-sm sm:text-base font-medium text-emerald-900 dark:text-emerald-200">
              {t.valueProp.body2}
            </div>
          </div>

          {/* Comparison Matrix: Vanyshe vs Traditional Meeting Apps */}
          <div className="mt-16 rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8 border-b border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/70 dark:bg-zinc-900/90">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                  {locale === 'fr'
                    ? 'Vanyshe vs. Logiciels de Réunion Traditionnels'
                    : locale === 'ar'
                    ? 'فانيش مقابل تطبيقات الاجتماعات التقليدية'
                    : 'Vanyshe vs. Legacy Meeting Platforms'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {locale === 'fr'
                    ? 'Pourquoi la communication éphémère est essentielle pour protéger votre confidentialité.'
                    : locale === 'ar'
                    ? 'لماذا يعد الاتصال الفوري سريع الزوال ضروريًا لحماية خصوصيتك.'
                    : 'Why zero-retention communication provides genuine peace of mind.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Logging Architecture</span>
              </div>
            </div>

            <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
              {comparisonItems.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-3 p-5 sm:p-6 gap-3 sm:gap-6 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors text-sm"
                >
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{item.feature}</span>
                  </div>

                  {/* Traditional Platforms */}
                  <div className="flex items-center gap-2 text-zinc-500 text-xs sm:text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3" />
                    </div>
                    <span>{item.traditional}</span>
                  </div>

                  {/* Vanyshe */}
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium text-xs sm:text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.vanyshe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & TIERS: FREE / PRO / ENTERPRISE */}
      <section id="pricing" className="py-24 sm:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              // Plans & Infrastructure
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white mt-2 mb-4">
              {locale === 'fr'
                ? 'Une confidentialité transparente. À toute échelle.'
                : locale === 'ar'
                ? 'خصوصية شفافة لجميع الاحتياجات.'
                : 'Simple, transparent privacy. At any scale.'}
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              {locale === 'fr'
                ? 'Des appels privés 100% gratuits aux déploiements souverains on-premise pour les grandes entreprises.'
                : locale === 'ar'
                ? 'من المكالمات الفورية المجانية تمامًا إلى النشر الذاتي داخل السيرفرات الخاصة بالشركات الكبرى.'
                : 'From instant, free ephemeral calls to air-gapped on-premise infrastructure for regulated corporations.'}
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* TIER 1: FREE / EPHEMERAL */}
            <div className="flex flex-col justify-between p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-500">
                    {locale === 'fr' ? 'COMMUNAUTÉ & PERSONNEL' : locale === 'ar' ? 'شخصي ومجاني' : 'COMMUNITY & PERSONAL'}
                  </span>
                  <span className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active Now
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
                  {locale === 'fr' ? 'Gratuit' : locale === 'ar' ? 'مجاني' : 'Free Ephemeral'}
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  {locale === 'fr'
                    ? 'Pour tout individu souhaitant une conversation rapide sans laisser de trace.'
                    : locale === 'ar'
                    ? 'لأي شخص يريد إجراء مكالمة سريعة دون تسجيل أو بيانات.'
                    : 'For anyone who needs a private browser call without accounts or logs.'}
                </p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-5xl font-extrabold text-zinc-950 dark:text-white">$0</span>
                  <span className="text-sm font-medium text-zinc-500">
                    {locale === 'fr' ? '/ toujours' : locale === 'ar' ? '/ دائمًا' : '/ forever'}
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Appels directs 1-à-1 P2P' : locale === 'ar' ? 'مكالمات مباشرة P2P بين شخصين' : '1-on-1 direct browser P2P video & audio'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Jusqu’à 60 minutes par salon' : locale === 'ar' ? 'حتى 60 دقيقة لكل غرفة' : 'Up to 60 minutes per session'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Chiffrement DTLS-SRTP v1.3' : locale === 'ar' ? 'تشفير كامل DTLS-SRTP v1.3' : 'End-to-end DTLS-SRTP v1.3 encryption'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Zéro compte, zéro mot de passe' : locale === 'ar' ? 'بدون حساب أو بريد إلكتروني' : 'Zero accounts, no emails, no logins'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Purge mémoire dès déconnexion' : locale === 'ar' ? 'مسح فوري للذاكرة عند المغادرة' : 'Instant RAM memory wipe on disconnect'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Partage d’écran HD 1080p' : locale === 'ar' ? 'مشاركة شاشة عالية الدقة 1080p' : '1080p video & screen sharing'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                )}
                <span>{creating ? t.hero.creatingRoom : locale === 'fr' ? 'Démarrer un salon gratuit' : locale === 'ar' ? 'ابدأ غرفة مجانية فورًا' : 'Start Free Room Now'}</span>
              </button>
            </div>

            {/* TIER 2: PRO (DEALMAKERS & ADVISORS) */}
            <div className="relative flex flex-col justify-between p-8 rounded-3xl border-2 border-emerald-500 dark:border-emerald-400 bg-white dark:bg-zinc-900/90 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all">
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-md">
                {locale === 'fr' ? 'POPULAIRE CONSULTANTS & DIRIGEANTS' : locale === 'ar' ? 'الخيار الأكثر شعبية للمستشارين' : 'POPULAR FOR ADVISORS & FOUNDERS'}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                    {locale === 'fr' ? 'ÉQUIPES & PROFESSIONNELS' : locale === 'ar' ? 'للفرق والمحترفين' : 'TEAMS & PROFESSIONALS'}
                  </span>
                  <span className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    Beta Access
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
                  {locale === 'fr' ? 'Pro' : locale === 'ar' ? 'الاحترافي (Pro)' : 'Pro Team'}
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  {locale === 'fr'
                    ? 'Pour avocats, investisseurs et cabinets négociant des contrats confidentiels.'
                    : locale === 'ar'
                    ? 'للمحامين والمستثمرين والمفاوضين في الصفقات السرية.'
                    : 'For legal counsel, founders, and dealmakers managing sensitive client discussions.'}
                </p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-5xl font-extrabold text-zinc-950 dark:text-white">$15</span>
                  <span className="text-sm font-medium text-zinc-500">
                    {locale === 'fr' ? '/ utilisateur / mois' : locale === 'ar' ? '/ مستخدم / شهر' : '/ user / month'}
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mb-8">
                  <li className="flex items-center gap-3 font-medium text-zinc-950 dark:text-white">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Tout ce qui est inclus dans Gratuit' : locale === 'ar' ? 'جميع مزايا الخطة المجانية، بالإضافة إلى:' : 'Everything in Free, plus:'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Sessions prolongées jusqu’à 4 heures' : locale === 'ar' ? 'جلسات مطولة تصل إلى 4 ساعات' : 'Extended sessions up to 4 hours'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Accès protégé par code PIN / mot de passe' : locale === 'ar' ? 'حماية الغرف برمز مرور PIN سري' : 'Password & PIN protected room access'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Liens personnalisés vanity (ex: vanyshe.com/r/votre-nom)' : locale === 'ar' ? 'روابط غرف مخصصة باسمك أو شركتك' : 'Custom vanity room links (vanyshe.com/r/deal)'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Relais TURN prioritaires mondiaux (faible latence)' : locale === 'ar' ? 'خوادم TURN فائقة السرعة حول العالم' : 'Priority Global TURN Relay (15 low-latency regions)'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Destruction paramétrable (5 min à 24h)' : locale === 'ar' ? 'مؤقت تدمير مخصص ذاتيًا للغرف' : 'Configurable self-destruct timers (5m - 24h)'}</span>
                  </li>
                </ul>
              </div>

              <a
                href="mailto:contact@vanyshe.com?subject=Pro%20Early%20Access%20Inquiry"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                <span>{locale === 'fr' ? 'Demander l’accès Pro' : locale === 'ar' ? 'طلب ترقية الحساب الاحترافي' : 'Get Pro Early Access'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
            </div>

            {/* TIER 3: ENTERPRISE (AIR-GAPPED & DEDICATED) */}
            <div className="flex flex-col justify-between p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-xs hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-500">
                    {locale === 'fr' ? 'GRANDES ENTREPRISES & SOUVERAINETÉ' : locale === 'ar' ? 'المؤسسات والقطاعات الخاضعة للرقابة' : 'REGULATED ENTERPRISES'}
                  </span>
                  <span className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    On-Premise / Cloud
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
                  {locale === 'fr' ? 'Entreprise' : locale === 'ar' ? 'المؤسسات (Enterprise)' : 'Enterprise'}
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  {locale === 'fr'
                    ? 'Pour banques, hôpitaux et organisations nécessitant un hébergement dédié ou souverain.'
                    : locale === 'ar'
                    ? 'للبنوك والمستشفيات والجهات التي تتطلب تثبيتًا داخليًا معزولاً.'
                    : 'For healthcare, banking, defense, and corporations needing air-gapped on-premise deployments.'}
                </p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white">Custom</span>
                  <span className="text-sm font-medium text-zinc-500">
                    {locale === 'fr' ? '/ annuel' : locale === 'ar' ? '/ سنوي' : '/ annual contract'}
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mb-8">
                  <li className="flex items-center gap-3 font-medium text-zinc-950 dark:text-white">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Tout ce qui est inclus dans Pro' : locale === 'ar' ? 'جميع مزايا الخطة الاحترافية، بالإضافة إلى:' : 'Everything in Pro, plus:'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      <strong className="text-zinc-950 dark:text-white font-semibold">
                        {locale === 'fr' ? 'Déploiement On-Premise / VPC' : locale === 'ar' ? 'تثبيت ذاتي On-Premise / سحابة خاصة' : 'Self-Hosted On-Premise / VPC'}
                      </strong>{' '}
                      (Docker / Kubernetes)
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Nom de domaine d’entreprise dédié (privacy.votresociete.com)' : locale === 'ar' ? 'نطاق فرعي مخصص للمؤسسة' : 'Custom enterprise domain (calls.company.com)'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Dossier de conformité SOC 2, HIPAA & RGPD' : locale === 'ar' ? 'ملف تدقيق الامتثال SOC 2 و HIPAA و GDPR' : 'SOC 2, HIPAA & GDPR compliance audit packet'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'Intégration SSO / SAML & annuaires d’entreprise' : locale === 'ar' ? 'ربط تسجيل الدخول الموحد SSO / SAML' : 'SAML / SSO provisioning & admin gatekeeping'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === 'fr' ? 'SLA de rétention zéro garanti contractuellement' : locale === 'ar' ? 'اتفاقية مستوى الخدمة SLA لحظر التسجيل' : 'Contractual Zero-Retention SLA & 24/7 support'}</span>
                  </li>
                </ul>
              </div>

              <a
                href="mailto:enterprise@vanyshe.com?subject=Enterprise%20Deployment%20Inquiry"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.98]"
              >
                <span>{locale === 'fr' ? 'Contacter l’équipe Entreprise' : locale === 'ar' ? 'التواصل مع قسم مبيعات المؤسسات' : 'Contact Enterprise Sales'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY SECTION */}
      <section id="privacy" className="py-24 sm:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              // Zero-Knowledge Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2 mb-4">
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
                className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    {privacyIcons[idx] || <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    {pt.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-12">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-center text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{t.privacySection.auditNote}</span>
          </div>
        </div>
      </section>

      {/* SECURITY ARCHITECTURE WITH P2P INFRASTRUCTURE VISUAL */}
      <section id="security" className="py-24 sm:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-950 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-400 font-semibold">
              // Open Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-3">
              {t.securityArch.title}
            </h2>
            <p className="text-sm text-zinc-400">
              {t.securityArch.subtitle}
            </p>
          </div>

          {/* Interactive Topology Visual Card */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-10 font-mono shadow-2xl">
            <div className="text-zinc-400 mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-200 font-bold tracking-wider">{t.securityArch.diagramTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full text-[11px]">
                <Lock className="w-3 h-3" />
                <span>DTLS-SRTP v1.3 • AES-256-GCM</span>
              </div>
            </div>

            {/* Embedded P2P Node Architectural Visual Image */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl relative group">
              <img
                src="/images/p2p-ephemeral-nodes.jpg"
                alt="WebRTC Direct P2P Encrypted Data Stream with Zero Logs Disappearing Particles"
                className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-300 bg-zinc-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-zinc-800">
                <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  P2P DIRECT MESH
                </span>
                <span className="text-zinc-400">0 bytes written to disk • Transient flow</span>
              </div>
            </div>

            {/* Technical Detail Rows */}
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>{t.securityArch.peerDirect}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 text-zinc-400">
                <Server className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{t.securityArch.turnRelay}</span>
              </div>
            </div>

            <p className="mt-8 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-4">
              {t.securityArch.encryptionNote}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 sm:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              // Answers & Clarity
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2">
              {t.faq.title}
            </h2>
          </div>

          <div className="space-y-3">
            {t.faq.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-semibold text-sm sm:text-base text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  style={{ textAlign: isRtl ? 'right' : 'left' }}
                  aria-expanded={openFaq === idx}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ${
                      openFaq === idx ? 'transform rotate-180 text-emerald-500' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 sm:py-32 text-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-mono mb-6">
            <Lock className="w-3.5 h-3.5" />
            <span>Instant & Ephemeral</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-4">
            {t.closingCta.headline}
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
            {t.closingCta.subtext}
          </p>

          <button
            onClick={handleCreateRoom}
            disabled={creating}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer group hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            {creating ? (
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            ) : (
              <Video className="w-5 h-5 text-emerald-400 dark:text-emerald-600 transition-transform group-hover:scale-110" />
            )}
            <span>{creating ? t.hero.creatingRoom : t.closingCta.button}</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono">
            <span>✓ No Registration</span>
            <span>✓ No Logs</span>
            <span>✓ Auto-Destruction</span>
          </div>
        </div>
      </section>
    </div>
  );
}
