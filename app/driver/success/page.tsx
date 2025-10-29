'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
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
                Application Submitted Successfully!
              </h1>
              <p className="mx-auto max-w-xl text-base sm:text-lg font-normal text-text-secondary px-4">
                Thank you for your interest in becoming a driver with AdriGo+, {applicantName}! We have received your application and will review it shortly.
              </p>
            </div>

            {/* What's Next */}
            <div className="w-full bg-background-light rounded-xl border border-gray-200 p-6 sm:p-8 mt-8">
              <h2 className="text-xl font-bold text-text-primary mb-6 text-left">What happens next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Review Process</h3>
                    <p className="text-sm text-text-secondary">Our team will review your application within 2-3 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Contact</h3>
                    <p className="text-sm text-text-secondary">We will contact you via email or phone to discuss the next steps.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Onboarding</h3>
                    <p className="text-sm text-text-secondary">Once approved, we'll guide you through the onboarding process.</p>
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
                Back to Home
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-text-primary text-base font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">mail</span>
                Contact Us
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-xl">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
                <div className="text-left">
                  <p className="text-sm text-blue-900 font-medium mb-1">Need help?</p>
                  <p className="text-xs text-blue-700">
                    If you have any questions about your application, please don't hesitate to{' '}
                    <Link href="/contact" className="underline font-medium">contact us</Link>.
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
