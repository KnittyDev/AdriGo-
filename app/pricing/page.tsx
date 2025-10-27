'use client';

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
  return (
    <main>
        {/* Pricing Factors Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                  Fair & Transparent Pricing
                </h1>
                <h2 className="mx-auto max-w-2xl text-base sm:text-lg font-normal text-text-secondary px-4">
                  No surprises. See how your fare is calculated before you book a ride. Your price is based on a few key factors.
                </h2>
              </div>
              <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">route</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">Distance</h3>
                  <p className="text-text-secondary">The length of your journey from pickup to destination is a primary component of your fare.</p>
                </div>
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">timer</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">Time</h3>
                  <p className="text-text-secondary">We account for the estimated duration of the ride, including potential traffic conditions.</p>
                </div>
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">trending_up</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">Demand</h3>
                  <p className="text-text-secondary">Prices may adjust during busy times to ensure a driver is always available when you need one.</p>
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
                  Base Pricing Rates
                </h1>
                <h2 className="mx-auto max-w-2xl text-lg font-normal text-text-secondary">
                  Our transparent pricing structure ensures you always know what you're paying for.
                </h2>
              </div>
              <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-5xl">route</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-text-primary">Per Kilometer</h3>
                    <p className="text-4xl font-extrabold text-primary">€0.65</p>
                    <p className="text-text-secondary">Charged for every kilometer traveled during your ride</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-5xl">timer</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-text-primary">Per Minute</h3>
                    <p className="text-4xl font-extrabold text-primary">€0.10</p>
                    <p className="text-text-secondary">Charged for every minute spent in the vehicle</p>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-text-primary text-center">How Your Fare is Calculated</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center gap-2 rounded-lg bg-background-light p-4">
                      <span className="text-2xl font-bold text-primary">Distance</span>
                      <span className="text-sm text-text-secondary">km × €0.65</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-2xl text-text-secondary">+</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg bg-background-light p-4">
                      <span className="text-2xl font-bold text-primary">Time</span>
                      <span className="text-sm text-text-secondary">minutes × €0.10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="text-lg text-text-secondary">=</span>
                    <span className="text-xl font-bold text-text-primary">Your Total Fare</span>
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
                  Example Fares
                </h1>
                <h2 className="mx-auto max-w-2xl text-lg font-normal text-text-secondary">
                  To give you a better idea, here are some estimated costs for typical routes in Montenegro. Actual prices may vary.
                </h2>
              </div>
              <div className="w-full max-w-4xl space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">flight_takeoff</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">Podgorica Center to Podgorica Airport</p>
                      <p className="text-sm text-text-secondary">Approx. 25 km, 30 minutes</p>
                      <p className="text-xs text-text-secondary">(25km × €0.65) + (30min × €0.10) = €19.25</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">~€19-22</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">castle</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">Budva to Kotor Old Town</p>
                      <p className="text-sm text-text-secondary">Approx. 23 km, 60 minutes (summer season)</p>
                      <p className="text-xs text-text-secondary">(23km × €0.65) + (60min × €0.10) = €20.95</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">~€21-24</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">landscape</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">Cetinje to Lovćen National Park</p>
                      <p className="text-sm text-text-secondary">Approx. 8 km, 15-20 minutes (mountain road)</p>
                      <p className="text-xs text-text-secondary">(8km × €0.65) + (18min × €0.10) = €7.00</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">~€7-9</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">water</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">Herceg Novi to Perast</p>
                      <p className="text-sm text-text-secondary">Approx. 5 km, 8-12 minutes (coastal route)</p>
                      <p className="text-xs text-text-secondary">(5km × €0.65) + (10min × €0.10) = €4.25</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">~€4-5</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <span className="material-symbols-outlined !text-2xl">local_shipping</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-text-primary">Ulcinj to Bar Port</p>
                      <p className="text-sm text-text-secondary">Approx. 15 km, 20-30 minutes (coastal highway)</p>
                      <p className="text-xs text-text-secondary">(15km × €0.65) + (25min × €0.10) = €12.25</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">~€12-14</p>
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
                Ready to Ride?
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-text-secondary">
                Download the app and get moving in minutes. Your next ride is just a tap away.
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
