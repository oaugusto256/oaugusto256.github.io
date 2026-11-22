export type FeaturedSlug = 'terral' | 'blockdaemon' | 'mercado-envios';

export const featured: { slug: FeaturedSlug; emphasis: 'primary' | 'secondary' }[] = [
  { slug: 'terral', emphasis: 'primary' },
  { slug: 'blockdaemon', emphasis: 'secondary' },
  { slug: 'mercado-envios', emphasis: 'secondary' },
];
