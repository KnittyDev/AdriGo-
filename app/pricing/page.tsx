'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

interface PricingSetting {
  base_fare: string;
  per_km_rate: string;
  per_minute_rate: string;
  included_km: string;
  minimum_fare: string;
}

export default function Pricing() {
  const t = useTranslations('pricing');
  const [pricing, setPricing] = useState<PricingSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data, error } = await supabase
          .from('pricing_settings')
          .select('base_fare, per_km_rate, per_minute_rate, included_km, minimum_fare')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching pricing:', error);
          // Fallback to default values if error
          setPricing({ 
            base_fare: '1.75', 
            per_km_rate: '0.65', 
            per_minute_rate: '0.10',
            included_km: '1.0',
            minimum_fare: '1.75'
          });
        } else if (data) {
          setPricing(data);
        } else {
          // Fallback to default values if no data
          setPricing({ 
            base_fare: '1.75', 
            per_km_rate: '0.65', 
            per_minute_rate: '0.10',
            included_km: '1.0',
            minimum_fare: '1.75'
          });
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
        // Fallback to default values
        setPricing({ 
          base_fare: '1.75', 
          per_km_rate: '0.65', 
          per_minute_rate: '0.10',
          included_km: '1.0',
          minimum_fare: '1.75'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  // Default values as fallback
  const baseFare = pricing ? parseFloat(pricing.base_fare) : 1.75;
  const perKmRate = pricing ? parseFloat(pricing.per_km_rate) : 0.65;
  const perMinuteRate = pricing ? parseFloat(pricing.per_minute_rate) : 0.10;
  const includedKm = pricing ? parseFloat(pricing.included_km) : 1.0;
  const minimumFare = pricing ? parseFloat(pricing.minimum_fare) : 1.75;

  // Calculate fare for a route
  const calculateFare = (distanceKm: number, timeMinutes: number): number => {
    const distanceCharge = Math.max(0, (distanceKm - includedKm)) * perKmRate;
    const timeCharge = timeMinutes * perMinuteRate;
    const totalFare = baseFare + distanceCharge + timeCharge;
    const fareWithMinimum = Math.max(totalFare, minimumFare);
    
    // Round to nearest 5 (e.g., 22 -> 20, 24 -> 25, 27 -> 25, 28 -> 30)
    return Math.round(fareWithMinimum / 5) * 5;
  };

  // Route data
  const routes = [
    { km: 25, minutes: 30, name: 'route1' },
    { km: 23, minutes: 60, name: 'route2' },
    { km: 8, minutes: 18, name: 'route3' }, // Average of 15-20
    { km: 5, minutes: 10, name: 'route4' }, // Average of 8-12
    { km: 15, minutes: 25, name: 'route5' }, // Average of 20-30
  ];

  // Format display values
  const perKmRateDisplay = perKmRate.toFixed(2);
  const perMinuteRateDisplay = perMinuteRate.toFixed(2);

  return (
    <main>
        {/* Pricing Rates Section */}
        <section className="py-20 sm:py-28">
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
                    <p className="text-4xl font-extrabold text-primary">€{perKmRateDisplay}</p>
                    <p className="text-text-secondary">{t('perKilometerDesc')}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-5xl">timer</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-text-primary">{t('perMinute')}</h3>
                    <p className="text-4xl font-extrabold text-primary">€{perMinuteRateDisplay}</p>
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
                      <span className="text-sm text-text-secondary">km × €{perKmRateDisplay}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-2xl text-text-secondary">+</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg bg-background-light p-4">
                      <span className="text-2xl font-bold text-primary">{t('timeLabel')}</span>
                      <span className="text-sm text-text-secondary">minutes × €{perMinuteRateDisplay}</span>
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

        {/* Pricing Factors Section */}
        <section className="bg-background-light py-20 sm:py-28">
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
                {routes.map((route, index) => {
                  // Calculate actual fare first
                  const distanceCharge = Math.max(0, (route.km - includedKm)) * perKmRate;
                  const timeCharge = route.minutes * perMinuteRate;
                  const actualFare = baseFare + distanceCharge + timeCharge;
                  const fareWithMinimum = Math.max(actualFare, minimumFare);
                  
                  // Round to nearest 5 for display
                  const fare = Math.round(fareWithMinimum / 5) * 5;
                  
                  const chargeableKm = Math.max(0, route.km - includedKm);
                  
                  let calcText = '';
                  if (chargeableKm > 0) {
                    calcText = `€${baseFare.toFixed(2)} + ${chargeableKm.toFixed(1)}km × €${perKmRateDisplay} + ${route.minutes}min × €${perMinuteRateDisplay} = €${fare.toFixed(0)}`;
                  } else {
                    calcText = `€${baseFare.toFixed(2)} + ${route.minutes}min × €${perMinuteRateDisplay} = €${fare.toFixed(0)}`;
                  }
                  
                  const icons = [
                    'flight_takeoff',
                    'castle',
                    'landscape',
                    'water',
                    'local_shipping'
                  ];

                  return (
                    <div key={route.name} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                          <span className="material-symbols-outlined !text-2xl">{icons[index]}</span>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-text-primary">{t(route.name)}</p>
                          <p className="text-sm text-text-secondary">{t(`${route.name}Details`)}</p>
                          <p className="text-xs text-text-secondary">{calcText}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-primary">€{fare.toFixed(0)}</p>
                    </div>
                  );
                })}
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
                  url="https://apps.apple.com/app/id6756029035"
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
