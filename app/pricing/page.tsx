'use client';
import { useTranslations } from 'next-intl';

// Custom App Store Badge Component
const AppStoreBadge = ({ url, width = 200 }: { url: string; width?: number }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'inline-block', width: width, height: width / 3.375 }}
  >
    <img
      src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1276560000"
      alt="Download on the App Store"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </a>
);

// Custom Google Play Badge Component
const GooglePlayBadge = ({ url, width = 200 }: { url: string; width?: number }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'inline-block', width: width * 1.2, height: (width * 1.1) / 2.8 }}
  >
    <img
      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      alt="Get it on Google Play"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </a>
);

export default function Pricing() {
  const t = useTranslations('pricing');
  return (
    <main>
        {/* Pricing Factors Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                  {t('title')}
                </h1>
                <h2 className="mx-auto max-w-2xl text-base sm:text-lg font-normal text-text-secondary px-4">
                  {t('subtitle')}
                </h2>
              </div>
              <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">route</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">{t('distance')}</h3>
                  <p className="text-text-secondary">{t('distanceDesc')}</p>
                </div>
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">timer</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">{t('time')}</h3>
                  <p className="text-text-secondary">{t('timeDesc')}</p>
                </div>
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">trending_up</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">{t('demand')}</h3>
                  <p className="text-text-secondary">{t('demandDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Rates Section */}
        <section className="bg-background-light py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary sm:text-5xl">
                  {t('baseRates')}
                </h1>
                <h2 className="mx-auto max-w-2xl text-lg font-normal text-text-secondary">
                  {t('baseRatesDesc')}
                </h2>
              </div>
              <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-5xl">route</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-text-primary">{t('perKilometer')}</h3>
                    <p className="text-4xl font-extrabold text-primary">{t('perKilometerPrice')}</p>
                    <p className="text-text-secondary">{t('perKilometerDesc')}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-5xl">timer</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-text-primary">{t('perMinute')}</h3>
                    <p className="text-4xl font-extrabold text-primary">{t('perMinutePrice')}</p>
                    <p className="text-text-secondary">{t('perMinuteDesc')}</p>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-text-primary text-center">{t('calculation')}</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center gap-2 rounded-lg bg-background-light p-4">
                      <span className="text-2xl font-bold text-primary">{t('distanceLabel')}</span>
                      <span className="text-sm text-text-secondary">km × €0.65</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-2xl text-text-secondary">+</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg bg-background-light p-4">
                      <span className="text-2xl font-bold text-primary">{t('timeLabel')}</span>
                      <span className="text-sm text-text-secondary">minutes × €0.10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="text-lg text-text-secondary">=</span>
                    <span className="text-xl font-bold text-text-primary">{t('totalFare')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Fares Section */}
        <section className="border-t border-gray-100 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary sm:text-5xl">
                  {t('exampleFares')}
                </h1>
                <h2 className="mx-auto max-w-2xl text-lg font-normal text-text-secondary">
                  {t('exampleFaresDesc')}
                </h2>
              </div>
              <div className="w-full max-w-4xl space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">flight_takeoff</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">{t('route1')}</p>
                      <p className="text-sm text-text-secondary">{t('route1Details')}</p>
                      <p className="text-xs text-text-secondary">{t('route1Calc')}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{t('route1Price')}</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">castle</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">{t('route2')}</p>
                      <p className="text-sm text-text-secondary">{t('route2Details')}</p>
                      <p className="text-xs text-text-secondary">{t('route2Calc')}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{t('route2Price')}</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">landscape</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">{t('route3')}</p>
                      <p className="text-sm text-text-secondary">{t('route3Details')}</p>
                      <p className="text-xs text-text-secondary">{t('route3Calc')}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{t('route3Price')}</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">water</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">{t('route4')}</p>
                      <p className="text-sm text-text-secondary">{t('route4Details')}</p>
                      <p className="text-xs text-text-secondary">{t('route4Calc')}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{t('route4Price')}</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">local_shipping</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">{t('route5')}</p>
                      <p className="text-sm text-text-secondary">{t('route5Details')}</p>
                      <p className="text-xs text-text-secondary">{t('route5Calc')}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{t('route5Price')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-background-light py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary">
                  {t('readyToRide')}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-text-secondary">
                  {t('readyToRideDesc')}
                </p>
              <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
                <AppStoreBadge
                  url="https://apps.apple.com/app/adrigo-plus/id123456789"
                  width={200}
                />
                <GooglePlayBadge
                  url="https://play.google.com/store/apps/details?id=com.adrigo.plus"
                  width={200}
                />
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
