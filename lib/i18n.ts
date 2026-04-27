export const locales = ['en', 'zh'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, pathname = '/') {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (locale === defaultLocale) {
    return normalized === '/' ? '/' : normalized;
  }

  if (normalized === '/') {
    return '/zh/';
  }

  return `/zh${normalized}`;
}
