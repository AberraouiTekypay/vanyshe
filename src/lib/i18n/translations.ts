import { SupportedLocale } from '../types';

export interface TranslationDictionary {
  locale: SupportedLocale;
  dir: 'ltr' | 'rtl';
  brand: string;
  tagline: string;
  nav: {
    product: string;
    howItWorks: string;
    useCases: string;
    privacy: string;
    security: string;
    faq: string;
    admin: string;
    startCta: string;
  };
  hero: {
    headline: string;
    supporting: string;
    primaryCta: string;
    secondaryCta: string;
    creatingRoom: string;
    trustIndicators: string[];
  };
  howItWorks: {
    sectionTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  preview: {
    badge: string;
    title: string;
    roomReady: string;
    privateSession: string;
    micLabel: string;
    camLabel: string;
    screenLabel: string;
    endLabel: string;
    liveIndicator: string;
  };
  valueProp: {
    headline: string;
    body1: string;
    body2: string;
    highlight: string;
  };
  useCases: {
    title: string;
    subtitle: string;
    disclaimer: string;
    items: {
      role: string;
      desc: string;
    }[];
  };
  privacySection: {
    title: string;
    subtitle: string;
    principle: string;
    points: {
      title: string;
      desc: string;
    }[];
    auditNote: string;
  };
  securityArch: {
    title: string;
    subtitle: string;
    diagramTitle: string;
    peerDirect: string;
    turnRelay: string;
    encryptionNote: string;
  };
  faq: {
    title: string;
    items: {
      q: string;
      a: string;
    }[];
  };
  closingCta: {
    headline: string;
    button: string;
    subtext: string;
  };
  footer: {
    tagline: string;
    links: {
      privacy: string;
      security: string;
      terms: string;
      faq: string;
      admin: string;
    };
    copyright: string;
  };
  room: {
    waitingTitle: string;
    waitingSubtitle: string;
    roomReady: string;
    joinButton: string;
    joining: string;
    copyLink: string;
    linkCopied: string;
    privateSessionBadge: string;
    micOn: string;
    micOff: string;
    camOn: string;
    camOff: string;
    shareScreen: string;
    stopSharing: string;
    endRoom: string;
    destroyRoom: string;
    confirmDestroy: string;
    leaving: string;
    conversationEnded: string;
    conversationDestroyed: string;
    destroyedNotice: string;
    startAnother: string;
    returnHome: string;
    errors: {
      notFound: string;
      expired: string;
      destroyed: string;
      camDenied: string;
      micDenied: string;
      connectionFailed: string;
    };
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    locale: 'en',
    dir: 'ltr',
    brand: 'Vanyshe',
    tagline: 'Say it. Don’t save it.',
    nav: {
      product: 'Product',
      howItWorks: 'How it works',
      useCases: 'Use cases',
      privacy: 'Privacy',
      security: 'Security',
      faq: 'FAQ',
      admin: 'Admin',
      startCta: 'Start conversation',
    },
    hero: {
      headline: 'Say it. Don’t save it.',
      supporting:
        'Private conversations, designed to disappear. Create a room, send one link, talk securely, and end the conversation. Vanyshe doesn’t retain your conversation.',
      primaryCta: 'Start a private conversation',
      secondaryCta: 'How it works',
      creatingRoom: 'Creating room...',
      trustIndicators: ['No account required', 'No recording', 'No conversation history'],
    },
    howItWorks: {
      sectionTitle: 'Radically simple. Ephemeral by design.',
      step1Title: '01 — Create',
      step1Desc: 'Create a private room in seconds with one click.',
      step2Title: '02 — Share',
      step2Desc: 'Send one simple link to the person you want to talk to.',
      step3Title: '03 — Disappear',
      step3Desc: 'When the conversation ends, the room disappears permanently.',
    },
    preview: {
      badge: 'Interactive Room Preview',
      title: 'Experience Vanyshe Calling',
      roomReady: 'Room ready',
      privateSession: 'Private session — DTLS-SRTP active',
      micLabel: 'Microphone',
      camLabel: 'Camera',
      screenLabel: 'Share screen',
      endLabel: 'End & Destroy',
      liveIndicator: 'Ephemeral peer connection',
    },
    valueProp: {
      headline: 'Communication shouldn’t create another permanent data trail.',
      body1:
        'Every modern meeting platform creates persistent accounts, chat logs, call recordings, automated AI transcripts, and organizational metadata.',
      body2:
        'Vanyshe takes the opposite approach. If we don’t need your conversation to provide the service, we don’t retain it.',
      highlight: 'Zero conversation retention. Direct peer media.',
    },
    useCases: {
      title: 'Built for conversations that don’t need a paper trail.',
      subtitle: 'For when spoken words should remain spoken, not indexed in corporate databases.',
      disclaimer:
        'Some industries and situations require records to be retained. Vanyshe should not be used to bypass legal, regulatory or organizational retention obligations.',
      items: [
        {
          role: 'For CEOs',
          desc: 'Discuss sensitive executive and strategic matters without creating another permanent communication record.',
        },
        {
          role: 'For Lawyers',
          desc: 'Conduct confidential client discussions without retaining unnecessary cloud conversation history.',
        },
        {
          role: 'For Investors',
          desc: 'Discuss opportunities, term sheets, and transactions without creating another permanent data repository.',
        },
        {
          role: 'For Journalists',
          desc: 'Communicate privately with sources using ephemeral browser-to-browser connections.',
        },
        {
          role: 'For HR',
          desc: 'Handle delicate employee conversations and sensitive personal reviews without permanent logs.',
        },
        {
          role: 'For Everyone',
          desc: 'Sometimes a conversation should simply remain a conversation between two human beings.',
        },
      ],
    },
    privacySection: {
      title: 'Privacy by design.',
      subtitle: 'We don’t need your conversation to provide the service.',
      principle: 'What we never collect or retain:',
      points: [
        {
          title: 'No conversation recordings',
          desc: 'Audio and video are routed directly between browsers and never written to our disk.',
        },
        {
          title: 'No automatic transcripts',
          desc: 'No AI models or speech-to-text bots listen to or transcribe your speech.',
        },
        {
          title: 'No persistent conversation history',
          desc: 'Once the call ends or is destroyed, all session states and mailboxes are purged.',
        },
        {
          title: 'No third-party advertising trackers',
          desc: 'No Google Analytics, Meta Pixel, Hotjar, or tracking cookies are ever loaded.',
        },
        {
          title: 'Cryptographic room entropy',
          desc: 'Room IDs use cryptographically strong random identifiers to prevent scanning.',
        },
        {
          title: 'Peer-to-peer encryption',
          desc: 'Media streams utilize standard WebRTC DTLS-SRTP encryption end-to-end.',
        },
      ],
      auditNote:
        'First-party product metrics strictly measure operational availability (e.g. room count, connection rate) and never inspect speech, video, or message payloads.',
    },
    securityArch: {
      title: 'Security Architecture',
      subtitle: 'Standard, transparent WebRTC peer media architecture.',
      diagramTitle: 'Data Flow Topology',
      peerDirect: 'Browser A ⟷ DTLS-SRTP Media ⟷ Browser B (Direct P2P)',
      turnRelay: 'TURN Relay (Used only when strict NAT/firewall blocks direct connection; media remains encrypted)',
      encryptionNote:
        'WebRTC mandates DTLS key negotiation and SRTP encryption. Vanyshe servers never hold decryption keys for peer media.',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'Is Vanyshe free?',
          a: 'Yes, Vanyshe is free to use for temporary, private browser-to-browser conversations.',
        },
        {
          q: 'Do I need an account to use Vanyshe?',
          a: 'No. You do not need to register, provide an email address, or create a password to create or join a conversation.',
        },
        {
          q: 'Do you record or store calls?',
          a: 'Never. Media is exchanged directly between participant browsers using WebRTC DTLS-SRTP. We do not store audio, video, or screen content.',
        },
        {
          q: 'Do you store conversation transcripts?',
          a: 'No. There is no automated transcription or recording mechanism within Vanyshe.',
        },
        {
          q: 'Can someone record my conversation?',
          a: 'Yes. While Vanyshe does not retain conversations, any participant on a call can independently record their screen or use another recording device.',
        },
        {
          q: 'Is Vanyshe encrypted?',
          a: 'Yes. All browser-to-browser WebRTC media streams are encrypted using standard DTLS and SRTP. Even if routed via a TURN relay during strict firewall conditions, media remains encrypted in transit.',
        },
        {
          q: 'How long does a room exist?',
          a: 'Rooms automatically expire after 60 minutes of inactivity. When the creator clicks "End & Destroy Room", the session terminates and the room is destroyed immediately.',
        },
        {
          q: 'Does Vanyshe know who I am?',
          a: 'No. We do not ask for your name, email, or credentials. For operational monitoring, we measure product metrics using an anonymous client identifier (e.g. anon_...).',
        },
        {
          q: 'Can businesses use Vanyshe?',
          a: 'Yes. However, organizations with statutory or regulatory recordkeeping mandates must ensure they comply with their applicable legal obligations.',
        },
      ],
    },
    closingCta: {
      headline: 'Have a conversation. Not a data trail.',
      button: 'Start a private conversation',
      subtext: 'No account. Just a link. Destroys when done.',
    },
    footer: {
      tagline: 'Private communication without retention.',
      links: {
        privacy: 'Privacy',
        security: 'Security',
        terms: 'Terms',
        faq: 'FAQ',
        admin: 'Admin Console',
      },
      copyright: '© 2026 Vanyshe. Say it. Don’t save it.',
    },
    room: {
      waitingTitle: 'You’re entering a private Vanyshe room.',
      waitingSubtitle: 'Test your camera and microphone before joining.',
      roomReady: 'Room ready',
      joinButton: 'Join Conversation',
      joining: 'Connecting...',
      copyLink: 'Copy Room Link',
      linkCopied: 'Link Copied!',
      privateSessionBadge: 'Private session — DTLS-SRTP',
      micOn: 'Mute Microphone',
      micOff: 'Unmute Microphone',
      camOn: 'Turn Off Camera',
      camOff: 'Turn On Camera',
      shareScreen: 'Share Screen',
      stopSharing: 'Stop Sharing',
      endRoom: 'Leave Conversation',
      destroyRoom: 'End & Destroy Room',
      confirmDestroy: 'Are you sure you want to destroy this room for all participants?',
      leaving: 'Disconnecting...',
      conversationEnded: 'Conversation ended.',
      conversationDestroyed: 'Conversation destroyed.',
      destroyedNotice: 'This room and its ephemeral session state have been permanently destroyed.',
      startAnother: 'Start another conversation',
      returnHome: 'Return to Vanyshe',
      errors: {
        notFound: 'Room not found or link is invalid.',
        expired: 'This room has expired.',
        destroyed: 'This conversation has already been destroyed.',
        camDenied: 'Camera permission was denied. You can still join with audio.',
        micDenied: 'Microphone permission was denied. Please allow microphone access in your browser.',
        connectionFailed: 'Peer connection failed. Check your network or firewall.',
      },
    },
  },
  fr: {
    locale: 'fr',
    dir: 'ltr',
    brand: 'Vanyshe',
    tagline: 'Dites-le. Ne le gardez pas.',
    nav: {
      product: 'Produit',
      howItWorks: 'Comment ça marche',
      useCases: 'Cas d’usage',
      privacy: 'Confidentialité',
      security: 'Sécurité',
      faq: 'FAQ',
      admin: 'Admin',
      startCta: 'Démarrer',
    },
    hero: {
      headline: 'Dites-le. Ne le gardez pas.',
      supporting:
        'Des conversations privées conçues pour disparaître. Créez une salle, envoyez un seul lien, échangez en toute confidentialité, puis fermez la conversation. Vanyshe ne conserve pas votre conversation.',
      primaryCta: 'Démarrer une conversation privée',
      secondaryCta: 'Comment ça marche ?',
      creatingRoom: 'Création de la salle...',
      trustIndicators: ['Aucun compte requis', 'Aucun enregistrement', 'Aucun historique de conversation'],
    },
    howItWorks: {
      sectionTitle: 'Radicalement simple. Éphémère par conception.',
      step1Title: '01 — Créez',
      step1Desc: 'Créez une salle privée en quelques secondes d’un seul clic.',
      step2Title: '02 — Partagez',
      step2Desc: 'Envoyez un seul lien à la personne avec laquelle vous souhaitez parler.',
      step3Title: '03 — Disparaissez',
      step3Desc: 'Lorsque la conversation se termine, la salle disparaît définitivement.',
    },
    preview: {
      badge: 'Aperçu interactif',
      title: 'Découvrez l’expérience Vanyshe',
      roomReady: 'Salle prête',
      privateSession: 'Session privée — DTLS-SRTP actif',
      micLabel: 'Microphone',
      camLabel: 'Caméra',
      screenLabel: 'Partager l’écran',
      endLabel: 'Fermer & Détruire',
      liveIndicator: 'Connexion pair-à-pair éphémère',
    },
    valueProp: {
      headline: 'Une conversation ne devrait pas devenir une trace de données permanente.',
      body1:
        'Chaque plateforme de réunion crée des comptes permanents, des journaux de chat, des enregistrements, des transcriptions IA et des métadonnées d’entreprise.',
      body2:
        'Si Vanyshe n’a pas besoin de votre conversation pour fournir le service, Vanyshe ne la conserve pas.',
      highlight: 'Zéro conservation de conversation. Média direct entre pairs.',
    },
    useCases: {
      title: 'Conçu pour les conversations sans trace écrite.',
      subtitle: 'Quand les paroles doivent simplement rester des paroles, sans être indexées.',
      disclaimer:
        'Certains secteurs et situations exigent la conservation de documents légaux. Vanyshe ne doit pas être utilisé pour contourner des obligations légales ou réglementaires.',
      items: [
        {
          role: 'Pour les dirigeants',
          desc: 'Échangez sur des sujets sensibles sans créer une nouvelle trace permanente.',
        },
        {
          role: 'Pour les avocats',
          desc: 'Des conversations privées sans historique inutile conservé dans le cloud.',
        },
        {
          role: 'Pour les investisseurs',
          desc: 'Échangez sur des opportunités et transactions sans créer un nouveau dépôt permanent de données.',
        },
        {
          role: 'Pour les journalistes',
          desc: 'Communiquez en privé avec vos sources via des connexions directes éphémères.',
        },
        {
          role: 'Pour les RH',
          desc: 'Gérez des conversations sensibles sans conservation inutile.',
        },
        {
          role: 'Pour tous',
          desc: 'Certaines conversations devraient simplement rester des conversations.',
        },
      ],
    },
    privacySection: {
      title: 'La confidentialité par conception.',
      subtitle: 'Nous n’avons pas besoin de votre conversation pour fournir le service.',
      principle: 'Ce que nous ne collectons ni ne conservons jamais :',
      points: [
        {
          title: 'Aucun enregistrement d’appel',
          desc: 'L’audio et la vidéo transitent directement entre navigateurs sans être enregistrés.',
        },
        {
          title: 'Aucune transcription automatique',
          desc: 'Aucun modèle d’IA n’écoute ni ne transcrit votre voix.',
        },
        {
          title: 'Aucun historique persistant',
          desc: 'À la destruction de la salle, toutes les données de session sont immédiatement purgées.',
        },
        {
          title: 'Aucun traceur publicitaire',
          desc: 'Pas de Google Analytics, ni de pixel de tracking tiers.',
        },
        {
          title: 'Identifiants à haute entropie',
          desc: 'Les identifiants de salle sont générés de manière cryptographiquement aléatoire.',
        },
        {
          title: 'Chiffrement pair-à-pair',
          desc: 'Les flux multimédias utilisent les normes WebRTC DTLS-SRTP de bout en bout.',
        },
      ],
      auditNote:
        'Nos métriques internes mesurent uniquement la disponibilité opérationnelle (taux de connexion, création de salles) sans jamais inspecter les conversations.',
    },
    securityArch: {
      title: 'Architecture de Sécurité',
      subtitle: 'Architecture de médias pair-à-pair WebRTC transparente.',
      diagramTitle: 'Flux de Données',
      peerDirect: 'Navigateur A ⟷ Média DTLS-SRTP ⟷ Navigateur B (P2P direct)',
      turnRelay: 'Relais TURN (Uniquement lors de pare-feu stricts ; les médias restent chiffrés)',
      encryptionNote:
        'WebRTC impose la négociation de clés DTLS et le chiffrement SRTP. Les serveurs Vanyshe ne possèdent jamais les clés de déchiffrement des médias.',
    },
    faq: {
      title: 'Questions Fréquemment Posées',
      items: [
        {
          q: 'Vanyshe est-il gratuit ?',
          a: 'Oui, Vanyshe est gratuit pour des conversations privées et éphémères directement dans le navigateur.',
        },
        {
          q: 'Dois-je créer un compte ?',
          a: 'Non. Aucun compte, email ou mot de passe n’est requis pour créer ou rejoindre une salle.',
        },
        {
          q: 'Enregistrez-vous les appels ?',
          a: 'Non. Les flux sont échangés directement entre navigateurs via WebRTC DTLS-SRTP.',
        },
        {
          q: 'Conservez-vous des transcriptions ?',
          a: 'Non. Aucun système de transcription automatique n’est intégré à Vanyshe.',
        },
        {
          q: 'Quelqu’un peut-il enregistrer la conversation ?',
          a: 'Oui. Bien que Vanyshe ne conserve rien, un participant peut toujours enregistrer son propre écran ou utiliser un appareil externe.',
        },
        {
          q: 'Vanyshe est-il chiffré ?',
          a: 'Oui. Tous les flux WebRTC sont chiffrés en continu via DTLS et SRTP.',
        },
        {
          q: 'Combien de temps dure une salle ?',
          a: 'Les salles expirent après 60 minutes d’inactivité, ou sont détruites instantanément dès que le créateur clique sur "Détruire la salle".',
        },
        {
          q: 'Vanyshe sait-il qui je suis ?',
          a: 'Non. Nous n’avons pas vos coordonnées. Nous utilisons un identifiant anonyme aléatoire (anon_...) pour mesurer la qualité technique du service.',
        },
        {
          q: 'Les entreprises peuvent-elles utiliser Vanyshe ?',
          a: 'Oui, tout en respectant leurs obligations légales ou réglementaires d’archivage propres.',
        },
      ],
    },
    closingCta: {
      headline: 'Une conversation. Pas une trace de données.',
      button: 'Démarrer une conversation privée',
      subtext: 'Sans compte. Juste un lien. Disparaît à la fin.',
    },
    footer: {
      tagline: 'Communication privée sans rétention.',
      links: {
        privacy: 'Confidentialité',
        security: 'Sécurité',
        terms: 'Conditions',
        faq: 'FAQ',
        admin: 'Console Admin',
      },
      copyright: '© 2026 Vanyshe. Dites-le. Ne le gardez pas.',
    },
    room: {
      waitingTitle: 'Vous entrez dans une salle privée Vanyshe.',
      waitingSubtitle: 'Vérifiez votre caméra et votre microphone avant d’entrer.',
      roomReady: 'Salle prête',
      joinButton: 'Rejoindre la conversation',
      joining: 'Connexion...',
      copyLink: 'Copier le lien',
      linkCopied: 'Lien copié !',
      privateSessionBadge: 'Session privée — DTLS-SRTP',
      micOn: 'Couper le micro',
      micOff: 'Activer le micro',
      camOn: 'Désactiver la caméra',
      camOff: 'Activer la caméra',
      shareScreen: 'Partager l’écran',
      stopSharing: 'Arrêter le partage',
      endRoom: 'Quitter la conversation',
      destroyRoom: 'Fermer & Détruire la salle',
      confirmDestroy: 'Voulez-vous vraiment détruire définitivement cette salle pour tous ?',
      leaving: 'Déconnexion...',
      conversationEnded: 'Conversation terminée.',
      conversationDestroyed: 'Conversation détruite.',
      destroyedNotice: 'Cette salle et son état éphémère ont été définitivement détruits.',
      startAnother: 'Démarrer une autre conversation',
      returnHome: 'Retourner à l’accueil',
      errors: {
        notFound: 'Salle introuvable ou lien invalide.',
        expired: 'Cette salle a expiré.',
        destroyed: 'Cette conversation a déjà été détruite.',
        camDenied: 'Accès caméra refusé. Vous pouvez toujours continuer en audio.',
        micDenied: 'Accès micro refusé. Veuillez autoriser le microphone dans votre navigateur.',
        connectionFailed: 'Échec de connexion entre pairs. Vérifiez votre réseau.',
      },
    },
  },
  ar: {
    locale: 'ar',
    dir: 'rtl',
    brand: 'Vanyshe',
    tagline: 'قل ما تريد. ولا تتركه محفوظًا.',
    nav: {
      product: 'المنتج',
      howItWorks: 'كيف يعمل',
      useCases: 'حالات الاستخدام',
      privacy: 'الخصوصية',
      security: 'الأمان',
      faq: 'الأسئلة الشائعة',
      admin: 'الإدارة',
      startCta: 'ابدأ محادثة',
    },
    hero: {
      headline: 'قل ما تريد. ولا تتركه محفوظًا.',
      supporting:
        'محادثات خاصة مصممة لتختفي. أنشئ غرفة، أرسل رابطًا واحدًا، تحدث بخصوصية، ثم أنهِ المحادثة. Vanyshe لا تحتفظ بمحادثتك.',
      primaryCta: 'ابدأ محادثة خاصة',
      secondaryCta: 'كيف يعمل؟',
      creatingRoom: 'جارٍ إنشاء الغرفة...',
      trustIndicators: ['لا حاجة إلى حساب', 'لا تسجيل', 'لا سجل للمحادثة'],
    },
    howItWorks: {
      sectionTitle: 'بساطة جذرية. زوال محتوم.',
      step1Title: '01 — أنشئ',
      step1Desc: 'أنشئ غرفة خاصة خلال ثوانٍ بنقرة واحدة.',
      step2Title: '02 — شارك',
      step2Desc: 'أرسل رابطًا واحدًا إلى الشخص الذي تريد التحدث معه.',
      step3Title: '03 — اختفِ',
      step3Desc: 'عند انتهاء المحادثة، تختفي الغرفة نهائيًا.',
    },
    preview: {
      badge: 'معاينة تفاعلية للغرفة',
      title: 'تجربة محادثات Vanyshe',
      roomReady: 'الغرفة جاهزة',
      privateSession: 'جلسة خاصة — تشفير DTLS-SRTP نشط',
      micLabel: 'الميكروفون',
      camLabel: 'الكاميرا',
      screenLabel: 'مشاركة الشاشة',
      endLabel: 'إنهاء وتدمير',
      liveIndicator: 'اتصال مباشر مؤقت بين المتصفحين',
    },
    valueProp: {
      headline: 'المحادثة لا ينبغي أن تتحول إلى أثر دائم من البيانات.',
      body1:
        'كل منصة اجتماعات حديثة تُنشئ حسابات دائمة وسجلات نصوص وتسجيلات مكالمات وتحليلات ذكاء اصطناعي وبيانات مؤسسية لا تنتهي.',
      body2:
        'إذا لم تكن Vanyshe بحاجة إلى محادثتك لتقديم الخدمة، فإنها لا تحتفظ بها إطلاقًا.',
      highlight: 'انعدام تام لحفظ المحادثات. وسائط مباشرة بين الأطراف.',
    },
    useCases: {
      title: 'مصممة للمحادثات التي لا تحتاج إلى سجل ورقي.',
      subtitle: 'لكي تبقى الكلمات المنطوقة مجرد كلمات، لا بيانات مفهرسة في قواعد السحاب.',
      disclaimer:
        'تتطلب بعض القطاعات والظروف الاحتفاظ بالسجلات الرسمية. لا يجوز استخدام Vanyshe لتجاوز الالتزامات القانونية أو التنظيمية المعمول بها.',
      items: [
        {
          role: 'للرؤساء التنفيذيين',
          desc: 'ناقش الأمور الاستراتيجية والحساسة دون إنشاء سجل دائم إضافي.',
        },
        {
          role: 'للمحامين',
          desc: 'محادثات خاصة مع الموكلين دون الاحتفاظ بسجل سحابي غير ضروري.',
        },
        {
          role: 'للمستثمرين',
          desc: 'ناقش الفرص والصفقات دون إنشاء مستودع دائم جديد للبيانات.',
        },
        {
          role: 'للصحفيين',
          desc: 'تواصل بشكل خاص مع مصادرك عبر اتصالات مباشرة تختفي فورًا.',
        },
        {
          role: 'للموارد البشرية',
          desc: 'تعامل مع المحادثات الحساسة دون احتفاظ غير ضروري.',
        },
        {
          role: 'للجميع',
          desc: 'بعض المحادثات يجب أن تبقى مجرد محادثات بين إنسان وآخر.',
        },
      ],
    },
    privacySection: {
      title: 'الخصوصية منذ التصميم.',
      subtitle: 'نحن لا نحتاج إلى محادثتك لتقديم الخدمة.',
      principle: 'ما لا نقوم بجمعه أو حفظه أبدًا:',
      points: [
        {
          title: 'لا تسجيل للمكالمات',
          desc: 'تنتقل الإشارات الصوتية والمرئية مباشرة بين المتصفحات ولا تُكتب على خوادمنا.',
        },
        {
          title: 'لا تفريغ صوتي أو نصوص',
          desc: 'لا توجد روبوتات ذكاء اصطناعي أو أدوات تستمع إلى حديثك أو تدونه.',
        },
        {
          title: 'لا سجل تاريخي للمحادثة',
          desc: 'بمجرد إنهاء المكالمة أو تدمير الغرفة، تُحذف كل بيانات الجلسة فورًا.',
        },
        {
          title: 'لا أدوات تعقب إعلانية',
          desc: 'لا وجود لـ Google Analytics أو أدوات تتبع خارجية أخرى.',
        },
        {
          title: 'معرفات غرف عشوائية مشفرة',
          desc: 'تعتمد معرفات الغرف على توليد عشوائي قوي مشفر يمنع التخمين أو المسح.',
        },
        {
          title: 'تشفير كامل بين الطرفين',
          desc: 'تستخدم وسائط WebRTC معايير DTLS-SRTP المشفرة من طرف إلى طرف.',
        },
      ],
      auditNote:
        'تقيس تحليلاتنا الفنية استقرار الخدمة فقط (مثل معدل نجاح الاتصال وتوليد الغرف) دون الاطلاع على الصوت أو الفيديو.',
    },
    securityArch: {
      title: 'بنية الأمان الفنية',
      subtitle: 'هندسة معمارية قياسية وشفافة لاتصال WebRTC المباشر.',
      diagramTitle: 'مخطط تدفق البيانات',
      peerDirect: 'متصفح أ ⟷ وسائط DTLS-SRTP المشفرة ⟷ متصفح ب (مباشر)',
      turnRelay: 'مرحل TURN (يُستخدم فقط عند وجود جدران حماية صعبة؛ وتبقى الوسائط مشفرة تمامًا)',
      encryptionNote:
        'يفرض معيار WebRTC مفاتيح DTLS وتشفير SRTP. لا تملك خوادم Vanyshe أبدًا مفاتيح فك تشفير وسائطك.',
    },
    faq: {
      title: 'الأسئلة الشائعة',
      items: [
        {
          q: 'هل خدمة Vanyshe مجانية؟',
          a: 'نعم، الخدمة مجانية للمحادثات الخاصة والمؤقتة عبر المتصفح مباشرة.',
        },
        {
          q: 'هل أحتاج إلى إنشاء حساب؟',
          a: 'كلا. لا تحتاج إلى بريد إلكتروني أو كلمة مرور أو أي بيانات تسجيل.',
        },
        {
          q: 'هل تسجلون المكالمات؟',
          a: 'أبدًا. تنتقل الوسائط مباشرة بين أجهزة المشاركين عبر WebRTC المشفر.',
        },
        {
          q: 'هل تحتفظون بنصوص أو تفريغ للمحادثات؟',
          a: 'لا. لا توجد أي أدوات تفريغ صوتي أو نصوص مدمجة في النظام.',
        },
        {
          q: 'هل يمكن للطرف الآخر تسجيل المحادثة؟',
          a: 'نعم. لا تحتفظ Vanyshe بأي شيء، ولكن يمكن لأي مشارك تسجيل شاشته أو استخدام جهاز خارجي بشكل مستقل.',
        },
        {
          q: 'هل المكالمات مشفرة؟',
          a: 'نعم. جميع تدفقات وسائط WebRTC مشفرة باستمرار عبر بروتوكولات DTLS و SRTP.',
        },
        {
          q: 'كم تدوم الغرفة؟',
          a: 'تنتهي صلاحية الغرفة تلقائيًا بعد 60 دقيقة من عدم النشاط، أو تُدمر فورًا بمجرد نقر منشئ الغرفة على "إنهاء وتدمير".',
        },
        {
          q: 'هل تعرف Vanyshe هويتي؟',
          a: 'لا. نحن لا نطلب هويتك. نستخدم فقط معرفًا عشوائيًا مجهولًا (anon_...) لمتابعة جودة الاتصال الفنية.',
        },
        {
          q: 'هل تستطيع الشركات استخدام Vanyshe؟',
          a: 'نعم، مع التزام المؤسسات باللوائح القانونية المنظمة لقطاعاتها الخاصة بحفظ السجلات.',
        },
      ],
    },
    closingCta: {
      headline: 'محادثة. وليست سجلًا للبيانات.',
      button: 'ابدأ محادثة خاصة',
      subtext: 'لا حساب. رابط واحد فقط. تختفي فور الانتهاء.',
    },
    footer: {
      tagline: 'محادثات خاصة مصممة لتختفي دون أثر.',
      links: {
        privacy: 'الخصوصية',
        security: 'الأمان',
        terms: 'الشروط',
        faq: 'الأسئلة الشائعة',
        admin: 'لوحة التحكم',
      },
      copyright: '© 2026 Vanyshe. قل ما تريد. ولا تتركه محفوظًا.',
    },
    room: {
      waitingTitle: 'أنت بصدد الدخول إلى غرفة Vanyshe خاصة.',
      waitingSubtitle: 'تحقق من الكاميرا والميكروفون قبل الانضمام.',
      roomReady: 'الغرفة جاهزة',
      joinButton: 'الانضمام إلى المحادثة',
      joining: 'جارٍ الاتصال...',
      copyLink: 'نسخ رابط الغرفة',
      linkCopied: 'تم نسخ الرابط!',
      privateSessionBadge: 'جلسة خاصة — تشفير DTLS-SRTP',
      micOn: 'كتم الميكروفون',
      micOff: 'تشغيل الميكروفون',
      camOn: 'إيقاف الكاميرا',
      camOff: 'تشغيل الكاميرا',
      shareScreen: 'مشاركة الشاشة',
      stopSharing: 'إيقاف المشاركة',
      endRoom: 'مغادرة المحادثة',
      destroyRoom: 'إنهاء وتدمير الغرفة',
      confirmDestroy: 'هل أنت متأكد من رغبتك في تدمير هذه الغرفة نهائيًا لجميع المشاركين؟',
      leaving: 'جارٍ قطع الاتصال...',
      conversationEnded: 'انتهت المحادثة.',
      conversationDestroyed: 'تم تدمير المحادثة.',
      destroyedNotice: 'تم تدمير هذه الغرفة وجميع حالات جلستها المؤقتة بشكل نهائي.',
      startAnother: 'بدء محادثة جديدة',
      returnHome: 'العودة إلى الصفحة الرئيسية',
      errors: {
        notFound: 'الغرفة غير موجودة أو الرابط غير صالح.',
        expired: 'انتهت صلاحية هذه الغرفة.',
        destroyed: 'تم تدمير هذه المحادثة بالفعل.',
        camDenied: 'تم رفض إذن الكاميرا. لا يزال بإمكانك الانضمام بالصوت فقط.',
        micDenied: 'تم رفض إذن الميكروفون. يُرجى السماح بالميكروفون في المتصفح.',
        connectionFailed: 'فشل الاتصال المباشر. يرجى التحقق من اتصال الإنترنت.',
      },
    },
  },
};
