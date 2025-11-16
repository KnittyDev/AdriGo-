'use client';
import { useState, useEffect, useRef } from 'react';
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

// Custom Google Play Badge Component //TODO: Add Google Play Badge
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

export default function Home() {
  const t = useTranslations('home');
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  
  const texts = [
    t('location1'),
    t('location2'), 
    t('location3'),
    t('location4')
  ];

  useEffect(() => {
    const current = texts[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < current.length) {
          setCurrentText(current.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(current.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (reviewsRef.current) observer.observe(reviewsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main>
        {/* HeroSection */}
        <section ref={heroRef} className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className={`flex flex-col gap-4 text-center transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                  {t('heroTitle')}
                </h1>
                <h2 className="mx-auto max-w-2xl text-base sm:text-lg font-normal text-text-secondary px-4">
                  {t('heroSubtitle')}
                </h2>
              </div>
              <div className={`relative w-full max-w-4xl transition-all duration-1000 ease-out delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="relative w-full aspect-[16/9] rounded-xl bg-gray-100 p-8 shadow-2xl shadow-gray-200 overflow-hidden">
                  {/* Abstract map background */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute h-full w-px bg-gray-200/80 left-1/4"></div>
                    <div className="absolute h-full w-px bg-gray-200/80 left-1/2"></div>
                    <div className="absolute h-full w-px bg-gray-200/80 left-3/4"></div>
                    <div className="absolute w-full h-px bg-gray-200/80 top-1/4"></div>
                    <div className="absolute w-full h-px bg-gray-200/80 top-1/2"></div>
                    <div className="absolute w-full h-px bg-gray-200/80 top-3/4"></div>
                  </div>
                  {/* Route line */}
                  <svg className="absolute inset-0 z-10 h-full w-full" fill="none" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
                    <path d="M80 180 C 150 150, 180 50, 320 60" stroke="#99cfcf" strokeDasharray="8 8" strokeLinecap="round" strokeWidth="4">
                      <animate attributeName="stroke-dashoffset" dur="2s" from="300" repeatCount="indefinite" to="0"></animate>
                    </path>
                  </svg>
                  {/* Pins */}
                  <div className="absolute z-20" style={{left: '18%', top: '75%'}}>
                    <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/30 animate-pulse"></div>
                  </div>
                  <div className="absolute z-20" style={{left: '80%', top: '20%'}}>
                    <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/30"></div>
                  </div>
                  {/* Floating Search Bar */}
                  <div className="absolute top-4 sm:top-6 left-1/2 z-30 w-full max-w-sm -translate-x-1/2 transform px-4">
                    <div className="flex items-center gap-2 rounded-full bg-white p-2 sm:p-3 shadow-xl">
                      <span className="material-symbols-outlined text-primary pl-2 text-lg sm:text-xl">search</span>
                      <div className="w-full border-0 bg-transparent text-text-primary focus:ring-0 flex items-center">
                        <span className="min-h-[1.5rem] text-sm sm:text-base">
                          {currentText}
                          <span className="animate-pulse">|</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row px-4 transition-all duration-1000 ease-out delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <AppStoreBadge
                  url="https://apps.apple.com/app/adrigo-plus/id123456789"
                  width={180}
                />
                <GooglePlayBadge
                  url="https://play.google.com/store/apps/details?id=com.adrigo.plus"
                  width={180}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FeatureSection */}
        <section ref={featuresRef} className="py-20 sm:py-28 bg-background-light">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className={`flex flex-col gap-4 text-center transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary">
                  {t('whyChooseUs')}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-text-secondary">
                  {t('whyChooseUsDesc')}
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className={`flex flex-col items-center gap-4 rounded-xl bg-white p-8 text-center transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '200ms' }}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">speed</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{t('quickRides')}</p>
                    <p className="mt-1 text-base text-text-secondary">{t('quickRidesDesc')}</p>
                  </div>
                </div>
                <div className={`flex flex-col items-center gap-4 rounded-xl bg-white p-8 text-center transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '400ms' }}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">shield</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{t('safeSecure')}</p>
                    <p className="mt-1 text-base text-text-secondary">{t('safeSecureDesc')}</p>
                  </div>
                </div>
                <div className={`flex flex-col items-center gap-4 rounded-xl bg-white p-8 text-center transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '600ms' }}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">phone_iphone</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{t('futuristicInterface')}</p>
                    <p className="mt-1 text-base text-text-secondary">{t('futuristicInterfaceDesc')}</p>
                  </div>
                </div>
                <div className={`flex flex-col items-center gap-4 rounded-xl bg-white p-8 text-center transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '800ms' }}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-4xl">support_agent</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{t('support247')}</p>
                    <p className="mt-1 text-base text-text-secondary">{t('support247Desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA & Reviews Section */}
        <section ref={reviewsRef} id="download" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className={`flex flex-col gap-4 text-center transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary">
                  {t('downloadApp')}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-text-secondary">{t('downloadAppDesc')}</p>
              </div>
              {/* Reviews */}
              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className={`flex flex-col gap-4 rounded-xl bg-background-light p-6 transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '200ms' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-cover bg-center" data-alt="User avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXLxOfETejeG0YI1rbZoridW8o4uL4RA_rYSy5Ewu7_A-dUYn1mOJD2GiXTrmHrCgC1Q9geNt4WP_bmEoIEaOhbWUfKQgWVnnLqBObLfTraQdNRbh-rBoOhI_rO85Uw7WiceVX8mnyOrxKvpmhV4aZ5P2kKe1im7S-pL5A9XSQcbufT-ood75gRfSapFuRcw-GyQoPmA8hngW-SkemKemUI3MhuQ4-4LusdsG2xe-DzhaJiVQsex_kjLU_fVOjZD0dBIP660lbzcle")'}}></div>
                    <div className="flex-1">
                      <p className="font-bold text-text-primary">Sarah J.</p>
                      <div className="flex gap-1">
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient2)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient3)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient4)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient5)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-base font-normal text-text-secondary">
                    "{t('review1')}"
                  </p>
                </div>
                <div className={`flex flex-col gap-4 rounded-xl bg-background-light p-6 transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '400ms' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-cover bg-center" data-alt="User avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-gEhXXdaW2Arwl5NLontdYLWqU4bhNe6Ljp8S5x5AqV-TFcroFm4AXquNP3mWqGvOpyB8tQy4FQeRFlLDx06UDk9Py1LsfQts_PGN0oLo2oAySrFt8IidLLwjKTlzkst2zqgeJ9vCg7M0dIWqPBqLLQsFn01yJ72LCe3d4-MHReQIcFeFYB_yuijoU8OHh1R0yWATFcD5wQ6ThuNFR0r-dfcNhHJflf9E-jVq-ujhn4-_utmp9hibO8ZPnEoj_vj8fEZLz59Qdlxb")'}}></div>
                    <div className="flex-1">
                      <p className="font-bold text-text-primary">Mike R.</p>
                      <div className="flex gap-1">
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient2)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient3)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient4)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient5)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-base font-normal text-text-secondary">
                    "{t('review2')}"
                  </p>
                </div>
                <div className={`flex flex-col gap-4 rounded-xl bg-background-light p-6 transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '600ms' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-cover bg-center" data-alt="User avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCrsMH_yy-473TQt0pN-H2BrelKANImCDUwYJUMTYave9RI6oSIlww4EmsiFjODaaLIoos93KjIh5_zxm4RKxd0fCY4SpwnO1HdOuz11OQWaIdCETR92Swi0avoL_VqV046YMdfFX53v7PR8XhQzlb9SkBHewikYDUGQWRQFoN-GkW6xMziZFC3RNFz0s4RRl5DEjLqlqm5lYWNplQta1HCBKxjw6wqw8vRt_URGXeNqpemVdcmdFI3J-Sn1R-c6KKkgUGjCMhxa38K")'}}></div>
                    <div className="flex-1">
                      <p className="font-bold text-text-primary">Emily K.</p>
                      <div className="flex gap-1">
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient2)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient3)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient4)" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                          <defs>
                            <linearGradient id="starGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGradient5)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-base font-normal text-text-secondary">
                    "{t('review3')}"
          </p>
        </div>
              </div>
              <div className={`flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row px-4 transition-all duration-1000 ease-out delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <AppStoreBadge
                  url="https://apps.apple.com/app/adrigo-plus/id123456789"
                  width={180}
                />
                <GooglePlayBadge
                  url="https://play.google.com/store/apps/details?id=com.adrigo.plus"
                  width={180}
                />
              </div>
            </div>
        </div>
        </section>
      </main>
    </div>
  );
}
