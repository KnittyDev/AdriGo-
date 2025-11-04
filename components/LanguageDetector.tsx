'use client';

import { useEffect } from 'react';
import { type Locale, locales } from '@/i18n';
import { setLocale } from '@/lib/i18n-client';

// Browser language to locale mapping
function getLocaleFromBrowserLanguage(browserLang: string): Locale | null {
  const lang = browserLang.toLowerCase().split('-')[0];
  
  const langMap: Record<string, Locale> = {
    'me': 'me',
    'cnr': 'me',
    'sr': 'sr',
    'en': 'en',
    'tr': 'tr'
  };
  
  return langMap[lang] || null;
}

// Check if cookie exists
function hasLocaleCookie(): boolean {
  if (typeof window === 'undefined') return false;
  return document.cookie.split(';').some(cookie => cookie.trim().startsWith('NEXT_LOCALE='));
}

export default function LanguageDetector() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if locale cookie already exists
    if (hasLocaleCookie()) {
      return; // User already has a preference, don't override
    }
    
    // Detect browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const detectedLocale = getLocaleFromBrowserLanguage(browserLang);
    
    // If we detected a supported language, set it as cookie
    if (detectedLocale) {
      setLocale(detectedLocale);
      // Reload page to apply the new locale
      window.location.reload();
    }
  }, []);

  // This component doesn't render anything
  return null;
}

