import { describe, it, expect } from 'vitest';
import { translations } from '../src/lib/i18n/translations';

describe('Internationalization & RTL Support', () => {
  it('supports English, French, and Arabic dictionaries', () => {
    expect(translations.en).toBeDefined();
    expect(translations.fr).toBeDefined();
    expect(translations.ar).toBeDefined();
  });

  it('sets Arabic as RTL and English/French as LTR', () => {
    expect(translations.ar.dir).toBe('rtl');
    expect(translations.en.dir).toBe('ltr');
    expect(translations.fr.dir).toBe('ltr');
  });

  it('contains approved master copy for English hero', () => {
    expect(translations.en.hero.headline).toBe('Say it. Don’t save it.');
    expect(translations.en.hero.primaryCta).toBe('Start a private conversation');
    expect(translations.en.hero.trustIndicators).toContain('No account required');
  });

  it('contains approved master copy for French hero', () => {
    expect(translations.fr.hero.headline).toBe('Dites-le. Ne le gardez pas.');
    expect(translations.fr.hero.primaryCta).toBe('Démarrer une conversation privée');
    expect(translations.fr.hero.trustIndicators).toContain('Aucun compte requis');
  });

  it('contains approved master copy for Arabic hero', () => {
    expect(translations.ar.hero.headline).toBe('قل ما تريد. ولا تتركه محفوظًا.');
    expect(translations.ar.hero.primaryCta).toBe('ابدأ محادثة خاصة');
    expect(translations.ar.hero.trustIndicators).toContain('لا حاجة إلى حساب');
  });

  it('provides 9 complete FAQ questions across all languages', () => {
    expect(translations.en.faq.items.length).toBe(9);
    expect(translations.fr.faq.items.length).toBe(9);
    expect(translations.ar.faq.items.length).toBe(9);
  });
});
