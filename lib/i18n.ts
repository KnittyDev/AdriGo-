'use server';

import { cookies } from 'next/headers';
import { locales, type Locale } from '@/i18n';

export async function getLocale(): Promise<Locale> {
  try {
    // Try to get locale from cookie
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE');
    
    if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
      return localeCookie.value as Locale;
    }
  } catch (error) {
    // If cookies() fails, fall back to default
    console.warn('Failed to get locale from cookie:', error);
  }
  
  // Default to Montenegrin
  return 'me';
}

