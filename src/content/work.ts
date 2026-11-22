import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/types';

export type WorkEntry = CollectionEntry<'work'>;

/** "terral/en" → "terral" */
export function slugOf(entry: WorkEntry): string {
  return entry.id.split('/')[0];
}

export async function getWork(locale: Locale): Promise<WorkEntry[]> {
  const all = await getCollection('work', (e) => e.data.locale === locale);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function hasTwin(slug: string, locale: Locale): Promise<boolean> {
  const all = await getCollection('work', (e) => e.data.locale === locale && slugOf(e) === slug);
  return all.length > 0;
}
