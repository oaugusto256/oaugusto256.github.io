import type { Locale } from '../i18n/types';

export const person = {
  name: 'Otavio Silva',
  email: 'tavioalves@gmail.com',
  github: 'https://github.com/oaugusto256',
  linkedin: 'https://www.linkedin.com/in/oaugusto256',
} as const;

export function resumePath(locale: Locale): string {
  return `/resume/otavio-silva-resume-${locale}.pdf`;
}
