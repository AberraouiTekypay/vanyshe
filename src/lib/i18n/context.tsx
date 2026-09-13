'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLocale } from '../types';
import { translations, TranslationDictionary } from './translations';

interface I18nContextType {
  locale: SupportedLocale;
  t: TranslationDictionary;
  setLocale: (locale: SupportedLocale) => void;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    // Try reading saved preference if available
    const saved = localStorage.getItem('vanyshe_locale') as SupportedLocale;
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'ar')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('vanyshe_locale', newLocale);

    // Update document root attributes
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';

    // Track language selection event
    try {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'language_selected',
          language: newLocale,
        }),
      }).catch(() => {});
    } catch {
      // safe ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const currentDict = translations[locale] || translations.en;

  return (
    <I18nContext.Provider
      value={{
        locale,
        t: currentDict,
        setLocale,
        dir: currentDict.dir,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
