'use client';

import { type Locale } from '@/i18n';

// Client-side function to set locale in cookie
export function setLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

