'use client';
import { useTranslations } from 'next-intl';

export default function Features() {
  const t = useTranslations('features');
  return (
    <main>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 text-center">
              <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-3xl text-base sm:text-lg text-text-secondary px-4">
                {t('subtitle')}
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2 lg:gap-16">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">speed</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">{t('quickRides')}</h3>
                  <p className="mt-2 text-base text-text-secondary">{t('quickRidesDesc')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">shield</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">{t('safeSecure')}</h3>
                  <p className="mt-2 text-base text-text-secondary">{t('safeSecureDesc')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">phone_iphone</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">{t('futuristicInterface')}</h3>
                  <p className="mt-2 text-base text-text-secondary">{t('futuristicInterfaceDesc')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">support_agent</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">{t('support247')}</h3>
                  <p className="mt-2 text-base text-text-secondary">{t('support247Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
