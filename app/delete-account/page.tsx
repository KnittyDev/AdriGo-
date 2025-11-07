'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DeleteAccountRequest() {
  const t = useTranslations('deleteAccount');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email) {
      toast.error(t('emailRequired'));
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('invalidEmail'));
      setLoading(false);
      return;
    }

    const loadingToast = toast.loading(t('submitting'));

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .insert([
          {
            email: formData.email,
            reason: formData.reason || null,
            status: 'pending',
            requested_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        console.error('Error submitting deletion request:', error);
        toast.error(t('submitError'), { id: loadingToast });
        setLoading(false);
        return;
      }

      toast.success(t('submitSuccess'), { id: loadingToast, duration: 3000 });
      
      // Reset form
      setFormData({
        email: '',
        reason: '',
      });

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      toast.error(t('submitError'), { id: loadingToast });
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Page Heading */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-4xl font-extrabold tracking-tighter text-text-primary sm:text-5xl">
                {t('title')}
              </h1>
              <p className="text-lg text-text-secondary">
                {t('subtitle')}
              </p>
            </div>

            {/* Information Section */}
            <div className="rounded-xl border border-gray-200 bg-background-light p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{t('importantInfo')}</h3>
                    <p className="text-text-secondary leading-relaxed">
                      {t('importantInfoText')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{t('processingTime')}</h3>
                    <p className="text-text-secondary leading-relaxed">
                      {t('processingTimeText')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{t('dataDeletion')}</h3>
                    <p className="text-text-secondary leading-relaxed">
                      {t('dataDeletionText')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Form */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="email">
                    {t('email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2"
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                  <p className="mt-1 text-sm text-text-secondary">{t('emailHelper')}</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="reason">
                    {t('reason')} <span className="text-gray-400">({tCommon('optional')})</span>
                  </label>
                  <textarea
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2"
                    id="reason"
                    rows={4}
                    placeholder={t('reasonPlaceholder')}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    disabled={loading}
                  />
                  <p className="mt-1 text-sm text-text-secondary">{t('reasonHelper')}</p>
                </div>

                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-yellow-600 flex-shrink-0">warning</span>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">{t('warningTitle')}</p>
                      <p className="text-sm text-yellow-700">{t('warningText')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-6 bg-red-600 text-white text-base font-bold transition-all hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="truncate">{t('submitting')}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">delete_forever</span>
                        <span className="truncate">{t('submitRequest')}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    disabled={loading}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-6 border-2 border-gray-300 text-text-primary text-base font-bold transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">{t('cancel')}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Information */}
            <div className="rounded-xl border border-gray-200 bg-background-light p-6 sm:p-8">
              <h3 className="text-xl font-bold text-text-primary mb-4">{t('needHelp')}</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                {t('needHelpText')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">email</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{t('contactEmail')}</p>
                    <a className="text-sm text-text-secondary hover:text-primary" href="mailto:privacy@adrigo.com">
                      privacy@adrigo.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{t('contactPhone')}</p>
                    <a className="text-sm text-text-secondary hover:text-primary" href="tel:+382-20-123-456">
                      +382 (20) 123-456
                    </a>
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

