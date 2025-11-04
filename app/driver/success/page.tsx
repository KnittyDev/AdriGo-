'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

function SuccessContent() {
  const t = useTranslations('driverSuccess');
  const searchParams = useSearchParams();
  const applicantName = searchParams.get('name') || 'applicant';

  return (
    <main>
      {/* Success Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-8">
            {/* Success Icon */}
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
              <span className="material-symbols-outlined text-green-600 text-6xl">
                check_circle
              </span>
            </div>

            {/* Success Message */}
            <div className="flex flex-col gap-4 max-w-2xl">
              <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl px-4">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-xl text-base sm:text-lg font-normal text-text-secondary px-4">
                {t('thankYou', { name: applicantName })}
              </p>
            </div>

            {/* What's Next */}
            <div className="w-full bg-background-light rounded-xl border border-gray-200 p-6 sm:p-8 mt-8">
              <h2 className="text-xl font-bold text-text-primary mb-6 text-left">{t('whatsNext')}</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{t('step1')}</h3>
                    <p className="text-sm text-text-secondary">{t('step1Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{t('step2')}</h3>
                    <p className="text-sm text-text-secondary">{t('step2Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{t('step3')}</h3>
                    <p className="text-sm text-text-secondary">{t('step3Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/"
                className="flex items-center justify-center px-6 py-3 bg-primary text-white text-base font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">home</span>
                {t('backToHome')}
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-text-primary text-base font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">mail</span>
                {t('contactUs')}
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-xl">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
                <div className="text-left">
                  <p className="text-sm text-blue-900 font-medium mb-1">{t('needHelp')}</p>
                  <p className="text-xs text-blue-700">
                    {t('needHelpDesc')}{' '}
                    <Link href="/contact" className="underline font-medium">{t('contactUs')}</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DriverApplicationSuccess() {
  return (
    <Suspense fallback={
      <main>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
