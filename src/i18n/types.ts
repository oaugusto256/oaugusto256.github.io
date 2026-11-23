export type Locale = 'en' | 'pt';
export const locales: readonly Locale[] = ['en', 'pt'] as const;
export const defaultLocale: Locale = 'en';
