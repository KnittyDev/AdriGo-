import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

// Supported locales
export const locales = ['me', 'en', 'sr', 'tr'] as const;
export type Locale = (typeof locales)[number];

// Browser language to locale mapping
function getLocaleFromBrowserLanguage(browserLang: string | null): Locale | null {
  if (!browserLang) return null;
  
  // Normalize browser language (e.g., 'en-US' -> 'en', 'tr-TR' -> 'tr')
  const lang = browserLang.toLowerCase().split('-')[0];
  
  // Map browser languages to our supported locales
  const langMap: Record<string, Locale> = {
    'me': 'me',      // Montenegrin
    'cnr': 'me',     // Montenegrin (ISO 639-3)
    'sr': 'sr',      // Serbian
    'en': 'en',      // English
    'tr': 'tr'       // Turkish
  };
  
  return langMap[lang] || null;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale: Locale = 'me'; // default
  
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE');
    
    // Priority 1: Check cookie (user's manual selection)
    if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
      locale = localeCookie.value as Locale;
    } else {
      // Priority 2: Check requestLocale from next-intl
      if (requestLocale && locales.includes(requestLocale as Locale)) {
        locale = requestLocale as Locale;
      } else {
        // Priority 3: Detect from browser Accept-Language header
        try {
          const headersList = await headers();
          const acceptLanguage = headersList.get('accept-language');
          
          if (acceptLanguage) {
            // Parse Accept-Language header (e.g., "en-US,en;q=0.9,tr;q=0.8")
            // Split by comma and get the first language (highest priority)
            const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
            
            // Try each language in priority order
            for (const lang of languages) {
              const browserLocale = getLocaleFromBrowserLanguage(lang);
              if (browserLocale) {
                locale = browserLocale;
                break; // Use the first matching supported locale
              }
            }
          }
        } catch {
          // If headers() fails, continue with default
        }
      }
    }
  } catch {
    // If cookies() fails, use default
    console.warn('Failed to get locale, using default');
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

