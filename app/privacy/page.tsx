'use client';
import { useTranslations } from 'next-intl';

export default function Privacy() {
  const t = useTranslations('privacy');
  return (
    <main>
        {/* Privacy Policy Content */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary sm:text-5xl">
                  {t('title')}
                </h1>
                <p className="text-lg text-text-secondary">
                  {t('lastUpdated')}
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">1. {t('intro')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('introText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">2. {t('infoWeCollect')}</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">{t('personalInfo')}</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2">
                          <li>{t('personalInfoItems.item1')}</li>
                          <li>{t('personalInfoItems.item2')}</li>
                          <li>{t('personalInfoItems.item3')}</li>
                          <li>{t('personalInfoItems.item4')}</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">{t('locationInfo')}</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2">
                          <li>{t('locationInfoItems.item1')}</li>
                          <li>{t('locationInfoItems.item2')}</li>
                          <li>{t('locationInfoItems.item3')}</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">{t('usageInfo')}</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2">
                          <li>{t('usageInfoItems.item1')}</li>
                          <li>{t('usageInfoItems.item2')}</li>
                          <li>{t('usageInfoItems.item3')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">3. {t('howWeUse')}</h2>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('howWeUseItems.item1')}</li>
                      <li>{t('howWeUseItems.item2')}</li>
                      <li>{t('howWeUseItems.item3')}</li>
                      <li>{t('howWeUseItems.item4')}</li>
                      <li>{t('howWeUseItems.item5')}</li>
                      <li>{t('howWeUseItems.item6')}</li>
                      <li>{t('howWeUseItems.item7')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">4. {t('infoSharing')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('infoSharingText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('infoSharingItems.item1')}</li>
                      <li>{t('infoSharingItems.item2')}</li>
                      <li>{t('infoSharingItems.item3')}</li>
                      <li>{t('infoSharingItems.item4')}</li>
                      <li>{t('infoSharingItems.item5')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">5. {t('dataSecurity')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('dataSecurityText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">6. {t('yourRights')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('yourRightsText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('yourRightsItems.item1')}</li>
                      <li>{t('yourRightsItems.item2')}</li>
                      <li>{t('yourRightsItems.item3')}</li>
                      <li>{t('yourRightsItems.item4')}</li>
                      <li>{t('yourRightsItems.item5')}</li>
                      <li>{t('yourRightsItems.item6')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">7. {t('dataRetention')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('dataRetentionText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">8. {t('childrensPrivacy')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('childrensPrivacyText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">9. {t('internationalTransfers')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('internationalTransfersText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">10. {t('changesToPolicy')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('changesToPolicyText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">11. {t('contactUs')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('contactUsText')}
                    </p>
                    <div className="mt-4 p-4 bg-background-light rounded-lg">
                      <p className="text-text-primary font-medium">AdriGo+ Support</p>
                      <p className="text-text-secondary">{t('supportEmail')}</p>
                      <p className="text-text-secondary">{t('supportPhone')}</p>
                      <p className="text-text-secondary">{t('supportAddress')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
