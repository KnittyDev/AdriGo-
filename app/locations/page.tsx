'use client';
import InteractiveMap from '@/components/InteractiveMap';
import { useTranslations } from 'next-intl';

export default function Locations() {
  const t = useTranslations('locations');
  return (
    <main>
      {/* Page Heading */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="flex flex-col gap-4 max-w-3xl">
              <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-2xl text-base sm:text-lg font-normal text-text-secondary px-4">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">{t('interactiveMap')}</h2>
            <p className="text-text-secondary">
              {t('interactiveMapDesc')}
            </p>
          </div>
          <div className="px-4 py-3">
            <div className="w-full rounded-xl shadow-lg overflow-hidden">
              <InteractiveMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} />
            </div>
          </div>
        </div>
      </section>

      {/* Locations List */}
      <section className="py-20 sm:py-28 bg-background-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl px-4 pb-3">
              {t('ourLocations')}
            </h2>
            <p className="text-text-secondary">
              {t('ourLocationsDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Podgorica */}
            <div className="flex items-start gap-4 border-t border-solid border-gray-200 py-6">
              <span className="material-symbols-outlined text-primary text-3xl mt-1">directions_car</span>
              <div className="flex flex-col gap-1">
                <p className="text-text-primary text-lg font-bold leading-normal">{t('podgorica')}</p>
                <p className="text-text-secondary text-base font-normal leading-normal">
                  {t('podgoricaDesc')}
                </p>
              </div>
            </div>
            
            {/* Budva */}
            <div className="flex items-start gap-4 border-t border-solid border-gray-200 py-6">
              <span className="material-symbols-outlined text-primary text-3xl mt-1">beach_access</span>
              <div className="flex flex-col gap-1">
                <p className="text-text-primary text-lg font-bold leading-normal">{t('budva')}</p>
                <p className="text-text-secondary text-base font-normal leading-normal">
                  {t('budvaDesc')}
                </p>
              </div>
            </div>
            
            {/* Kotor */}
            <div className="flex items-start gap-4 border-t border-solid border-gray-200 py-6">
              <span className="material-symbols-outlined text-primary text-3xl mt-1">fort</span>
              <div className="flex flex-col gap-1">
                <p className="text-text-primary text-lg font-bold leading-normal">{t('kotor')}</p>
                <p className="text-text-secondary text-base font-normal leading-normal">
                  {t('kotorDesc')}
                </p>
              </div>
            </div>
            
            {/* Tivat */}
            <div className="flex items-start gap-4 border-t border-solid border-gray-200 py-6">
              <span className="material-symbols-outlined text-primary text-3xl mt-1">flight</span>
              <div className="flex flex-col gap-1">
                <p className="text-text-primary text-lg font-bold leading-normal">{t('tivat')}</p>
                <p className="text-text-secondary text-base font-normal leading-normal">
                  {t('tivatDesc')}
                </p>
              </div>
            </div>
            
            {/* Herceg Novi */}
            <div className="flex items-start gap-4 border-t border-solid border-gray-200 py-6">
              <span className="material-symbols-outlined text-primary text-3xl mt-1">landscape</span>
              <div className="flex flex-col gap-1">
                <p className="text-text-primary text-lg font-bold leading-normal">{t('hercegNovi')}</p>
                <p className="text-text-secondary text-base font-normal leading-normal">
                  {t('hercegNoviDesc')}
                </p>
              </div>
            </div>
            
            {/* Ulcinj */}
            <div className="flex items-start gap-4 border-t border-solid border-gray-200 py-6">
              <span className="material-symbols-outlined text-primary text-3xl mt-1">water</span>
              <div className="flex flex-col gap-1">
                <p className="text-text-primary text-lg font-bold leading-normal">{t('ulcinj')}</p>
                <p className="text-text-secondary text-base font-normal leading-normal">
                  {t('ulcinjDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl px-4 pb-3">
              {t('serviceCoverage')}
            </h2>
            <p className="text-text-secondary">
              {t('serviceCoverageDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary">{t('currentlyAvailable')}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-text-secondary">{t('podgoricaFull')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-text-secondary">{t('budvaCity')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-text-secondary">{t('kotorBay')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-text-secondary">{t('tivatAirport')}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-600 text-2xl">schedule</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary">{t('comingSoon')}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-text-secondary">{t('hercegNoviSoon')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-text-secondary">{t('ulcinjSoon')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-text-secondary">{t('cetinjeSoon')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-text-secondary">{t('barSoon')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
