'use client';
import { useTranslations } from 'next-intl';

export default function DriverAgreement() {
  const t = useTranslations('driverAgreement');
  return (
    <main>
        {/* Driver Agreement Content */}
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
                    <h2 className="text-2xl font-bold text-text-primary mb-4">2. {t('relationship')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('relationshipText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('relationshipItems.item1')}</li>
                      <li>{t('relationshipItems.item2')}</li>
                      <li>{t('relationshipItems.item3')}</li>
                      <li>{t('relationshipItems.item4')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">3. {t('driverRequirements')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('driverRequirementsText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('driverRequirementsItems.item1')}</li>
                      <li>{t('driverRequirementsItems.item2')}</li>
                      <li>{t('driverRequirementsItems.item3')}</li>
                      <li>{t('driverRequirementsItems.item4')}</li>
                      <li>{t('driverRequirementsItems.item5')}</li>
                      <li>{t('driverRequirementsItems.item6')}</li>
                      <li>{t('driverRequirementsItems.item7')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">4. {t('vehicleRequirements')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('vehicleRequirementsText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('vehicleRequirementsItems.item1')}</li>
                      <li>{t('vehicleRequirementsItems.item2')}</li>
                      <li>{t('vehicleRequirementsItems.item3')}</li>
                      <li>{t('vehicleRequirementsItems.item4')}</li>
                      <li>{t('vehicleRequirementsItems.item5')}</li>
                      <li>{t('vehicleRequirementsItems.item6')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">5. {t('driverObligations')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('driverObligationsText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('driverObligationsItems.item1')}</li>
                      <li>{t('driverObligationsItems.item2')}</li>
                      <li>{t('driverObligationsItems.item3')}</li>
                      <li>{t('driverObligationsItems.item4')}</li>
                      <li>{t('driverObligationsItems.item5')}</li>
                      <li>{t('driverObligationsItems.item6')}</li>
                      <li>{t('driverObligationsItems.item7')}</li>
                      <li>{t('driverObligationsItems.item8')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">6. {t('compensation')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('compensationText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('compensationItems.item1')}</li>
                      <li>{t('compensationItems.item2')}</li>
                      <li>{t('compensationItems.item3')}</li>
                      <li>{t('compensationItems.item4')}</li>
                      <li>{t('compensationItems.item5')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">7. {t('platformUse')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('platformUseText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('platformUseItems.item1')}</li>
                      <li>{t('platformUseItems.item2')}</li>
                      <li>{t('platformUseItems.item3')}</li>
                      <li>{t('platformUseItems.item4')}</li>
                      <li>{t('platformUseItems.item5')}</li>
                      <li>{t('platformUseItems.item6')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">8. {t('safety')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('safetyText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('safetyItems.item1')}</li>
                      <li>{t('safetyItems.item2')}</li>
                      <li>{t('safetyItems.item3')}</li>
                      <li>{t('safetyItems.item4')}</li>
                      <li>{t('safetyItems.item5')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">9. {t('termination')}</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {t('terminationText')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>{t('terminationItems.item1')}</li>
                      <li>{t('terminationItems.item2')}</li>
                      <li>{t('terminationItems.item3')}</li>
                      <li>{t('terminationItems.item4')}</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">10. {t('intellectualProperty')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('intellectualPropertyText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">11. {t('limitation')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('limitationText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">12. {t('indemnification')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('indemnificationText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">13. {t('disputeResolution')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('disputeResolutionText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">14. {t('governingLaw')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('governingLawText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">15. {t('changesToAgreement')}</h2>
                    <p className="text-text-secondary leading-relaxed">
                      {t('changesToAgreementText')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">16. {t('contactInfo')}</h2>
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
