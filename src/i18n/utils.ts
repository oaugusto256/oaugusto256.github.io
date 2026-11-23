import { en, type Dict } from './en';
import { pt } from './pt';
import { locales, type Locale } from './types';

export { locales, type Locale };

const dicts: Record<Locale, Dict> = { en, pt };

export function useT(locale: Locale): Dict {
  return dicts[locale];
}

export function htmlLang(locale: Locale): 'en' | 'pt-BR' {
  return locale === 'pt' ? 'pt-BR' : 'en';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'pt' : 'en';
}

/** localePath('pt', '/work/terral') → '/pt/work/terral/' (always trailing slash). */
export function localePath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
