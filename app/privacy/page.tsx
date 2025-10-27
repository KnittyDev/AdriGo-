'use client';

export default function Privacy() {
  return (
    <main>
        {/* Privacy Policy Content */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary sm:text-5xl">
                  Privacy Policy
                </h1>
                <p className="text-lg text-text-secondary">
                  Last updated: December 2024
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">1. Introduction</h2>
                    <p className="text-text-secondary leading-relaxed">
                      AdriGo+ ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our ride-hailing service and mobile application.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">2. Information We Collect</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Personal Information</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2">
                          <li>Name, email address, and phone number</li>
                          <li>Payment information (processed securely through third-party providers)</li>
                          <li>Profile information and preferences</li>
                          <li>Driver's license and vehicle information (for drivers)</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Location Information</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2">
                          <li>Real-time location data for ride matching and navigation</li>
                          <li>Pickup and destination addresses</li>
                          <li>Route information and travel patterns</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Usage Information</h3>
                        <ul className="list-disc list-inside text-text-secondary space-y-2">
                          <li>App usage patterns and features used</li>
                          <li>Device information and operating system</li>
                          <li>Communication preferences and support interactions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">3. How We Use Your Information</h2>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>To provide and maintain our ride-hailing services</li>
                      <li>To process payments and manage your account</li>
                      <li>To match you with drivers and optimize routes</li>
                      <li>To communicate with you about rides, promotions, and service updates</li>
                      <li>To improve our services and develop new features</li>
                      <li>To ensure safety and security for all users</li>
                      <li>To comply with legal obligations and enforce our terms</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">4. Information Sharing</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      We do not sell your personal information. We may share your information in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>With drivers to facilitate ride services</li>
                      <li>With service providers who assist in our operations</li>
                      <li>When required by law or to protect our rights</li>
                      <li>In case of emergency or safety concerns</li>
                      <li>With your explicit consent</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">5. Data Security</h2>
                    <p className="text-text-secondary leading-relaxed">
                      We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">6. Your Rights</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>Access and review your personal information</li>
                      <li>Correct inaccurate or incomplete information</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Request data portability</li>
                      <li>Withdraw consent for data processing</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">7. Data Retention</h2>
                    <p className="text-text-secondary leading-relaxed">
                      We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Location data is typically retained for 7 days for safety purposes.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">8. Children's Privacy</h2>
                    <p className="text-text-secondary leading-relaxed">
                      Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected such information, we will take steps to delete it.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">9. International Transfers</h2>
                    <p className="text-text-secondary leading-relaxed">
                      Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">10. Changes to This Policy</h2>
                    <p className="text-text-secondary leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services constitutes acceptance of the updated policy.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">11. Contact Us</h2>
                    <p className="text-text-secondary leading-relaxed">
                      If you have any questions about this Privacy Policy or our data practices, please contact us at:
                    </p>
                    <div className="mt-4 p-4 bg-background-light rounded-lg">
                      <p className="text-text-primary font-medium">AdriGo+ Support</p>
                      <p className="text-text-secondary">Email: privacy@adrigo.com</p>
                      <p className="text-text-secondary">Phone: +382 20 123 456</p>
                      <p className="text-text-secondary">Address: Podgorica, Montenegro</p>
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
