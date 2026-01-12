'use client';
import { useTranslations } from 'next-intl';

export default function Terms() {
  const t = useTranslations('terms');
  return (
    <main>
        {/* Terms of Service Content */}
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
                    <h2 className="text-2xl font-bold text-text-primary mb-4">1. {t('acceptance')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('acceptanceText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">2. {t('description')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('descriptionText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">3. {t('userAccounts')}</h2>
                    <div className="space-y-4">
                      <p className="text-text-secondary leading-relaxed">
                        {t('userAccountsText')}
                      </p>
                      <ul className="list-disc list-inside text-text-secondary space-y-2">
                        <li>{t('userAccountsItems.item1')}</li>
                        <li>{t('userAccountsItems.item2')}</li>
                        <li>{t('userAccountsItems.item3')}</li>
                        <li>{t('userAccountsItems.item4')}</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">4. {t('userConduct')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('userConductText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('userConductItems.item1')}</li>
                      <li>{t('userConductItems.item2')}</li>
                      <li>{t('userConductItems.item3')}</li>
                      <li>{t('userConductItems.item4')}</li>
                      <li>{t('userConductItems.item5')}</li>
                      <li>{t('userConductItems.item6')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">5. {t('paymentTerms')}</h2>
                    <div className="space-y-4">
                      <p className="text-text-secondary leading-relaxed">
                        {t('paymentTermsText')}
                      </p>
                      <ul className="list-disc list-inside text-text-secondary space-y-2">
                        <li>{t('paymentTermsItems.item1')}</li>
                        <li>{t('paymentTermsItems.item2')}</li>
                        <li>{t('paymentTermsItems.item3')}</li>
                        <li>{t('paymentTermsItems.item4')}</li>
                        <li>{t('paymentTermsItems.item5')}</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">6. {t('driverRequirements')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('driverRequirementsText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('driverRequirementsItems.item1')}</li>
                      <li>{t('driverRequirementsItems.item2')}</li>
                      <li>{t('driverRequirementsItems.item3')}</li>
                      <li>{t('driverRequirementsItems.item4')}</li>
                      <li>{t('driverRequirementsItems.item5')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">7. {t('safety')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('safetyText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">8. {t('limitation')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('limitationText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">9. {t('indemnification')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('indemnificationText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">10. {t('privacy')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('privacyText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">11. {t('termination')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('terminationText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">12. {t('disputeResolution')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('disputeResolutionText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">13. {t('governingLaw')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('governingLawText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">14. {t('changesToTerms')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('changesToTermsText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">15. {t('contactInfo')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('contactInfoText')}
                    </p>
                    <div className="mt-4 p-4 bg-background-light rounded-lg">
                      <p className="text-text-primary font-medium">Rivora Legal Department</p>
                      <p className="text-text-secondary">{t('legalEmail')}</p>
                      <p className="text-text-secondary">{t('legalPhone')}</p>
                      <p className="text-text-secondary">{t('legalAddress')}</p>
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
