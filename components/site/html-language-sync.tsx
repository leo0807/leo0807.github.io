'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isLocale } from '@/lib/i18n';

export function HtmlLanguageSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname?.split('/')[1] ?? '';
    const resolvedLocale = isLocale(locale) ? locale : 'en';

    document.documentElement.lang = resolvedLocale;
    document.documentElement.dataset.locale = resolvedLocale;
  }, [pathname]);

  return null;
}
