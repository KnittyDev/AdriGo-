'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PricingSetting {
  id: string;
  base_fare: string;
  per_km_rate: string;
  per_minute_rate: string;
  included_km: string;
  minimum_fare: string;
  budva_per_km_rate: string | null;
  kotor_per_km_rate: string | null;
  tivat_per_km_rate: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function PricingSettings() {
  const [pricingSettings, setPricingSettings] = useState<PricingSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState<PricingSetting | null>(null);
  const { signOut, profile } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    base_fare: '',
    per_km_rate: '',
    per_minute_rate: '',
    included_km: '',
    minimum_fare: '',
    budva_per_km_rate: '',
    kotor_per_km_rate: '',
    tivat_per_km_rate: '',
    is_active: true,
  });

  useEffect(() => {
    fetchPricingSettings();
  }, []);

  // Sekme değiştirip tekrar geldiğinde sayfayı yenile
  useEffect(() => {
    let wasHidden = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasHidden = true;
      } else if (wasHidden && !document.hidden) {
        // Sekme görünür hale geldi ve önceden gizliydi
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchPricingSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('pricing_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pricing settings:', error);
        toast.error('Error fetching pricing settings');
        return;
      }

      setPricingSettings(data || []);
    } catch (error) {
      console.error('Error fetching pricing settings:', error);
      toast.error('Error fetching pricing settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.base_fare || !formData.per_km_rate || !formData.per_minute_rate || 
        !formData.included_km || !formData.minimum_fare) {
      toast.error('Please fill in all required fields');
      return;
    }

    const loadingToast = toast.loading(editingSetting ? 'Updating pricing settings...' : 'Creating pricing settings...');

    try {
      const pricingData = {
        base_fare: parseFloat(formData.base_fare),
        per_km_rate: parseFloat(formData.per_km_rate),
        per_minute_rate: parseFloat(formData.per_minute_rate),
        included_km: parseFloat(formData.included_km),
        minimum_fare: parseFloat(formData.minimum_fare),
        budva_per_km_rate: formData.budva_per_km_rate ? parseFloat(formData.budva_per_km_rate) : null,
        kotor_per_km_rate: formData.kotor_per_km_rate ? parseFloat(formData.kotor_per_km_rate) : null,
        tivat_per_km_rate: formData.tivat_per_km_rate ? parseFloat(formData.tivat_per_km_rate) : null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingSetting) {
        const { error } = await supabase
          .from('pricing_settings')
          .update(pricingData)
          .eq('id', editingSetting.id);

        if (error) throw error;
        toast.success('Pricing settings updated successfully!', { id: loadingToast });
      } else {
        const { error } = await supabase
          .from('pricing_settings')
          .insert([pricingData]);

        if (error) throw error;
        toast.success('Pricing settings created successfully!', { id: loadingToast });
      }

      setShowModal(false);
      resetForm();
      fetchPricingSettings();
    } catch (error: any) {
      console.error('Error saving pricing settings:', error);
      toast.error(error.message || 'Error saving pricing settings', { id: loadingToast });
    }
  };

  const handleEdit = (setting: PricingSetting) => {
    setEditingSetting(setting);
    setFormData({
      base_fare: setting.base_fare,
      per_km_rate: setting.per_km_rate,
      per_minute_rate: setting.per_minute_rate,
      included_km: setting.included_km,
      minimum_fare: setting.minimum_fare,
      budva_per_km_rate: setting.budva_per_km_rate || '',
      kotor_per_km_rate: setting.kotor_per_km_rate || '',
      tivat_per_km_rate: setting.tivat_per_km_rate || '',
      is_active: setting.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing setting?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting pricing setting...');

    try {
      const { error } = await supabase
        .from('pricing_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Pricing setting deleted successfully!', { id: loadingToast });
      fetchPricingSettings();
    } catch (error: any) {
      console.error('Error deleting pricing setting:', error);
      toast.error(error.message || 'Error deleting pricing setting', { id: loadingToast });
    }
  };

  const handleToggleActive = async (setting: PricingSetting) => {
    const loadingToast = toast.loading('Updating pricing setting status...');

    try {
      const { error } = await supabase
        .from('pricing_settings')
        .update({ is_active: !setting.is_active, updated_at: new Date().toISOString() })
        .eq('id', setting.id);

      if (error) throw error;

      toast.success(`Pricing setting ${!setting.is_active ? 'activated' : 'deactivated'}!`, { id: loadingToast });
      fetchPricingSettings();
    } catch (error: any) {
      console.error('Error updating pricing setting:', error);
      toast.error(error.message || 'Error updating pricing setting', { id: loadingToast });
    }
  };

  const resetForm = () => {
    setFormData({
      base_fare: '',
      per_km_rate: '',
      per_minute_rate: '',
      included_km: '',
      minimum_fare: '',
      budva_per_km_rate: '',
      kotor_per_km_rate: '',
      tivat_per_km_rate: '',
      is_active: true,
    });
    setEditingSetting(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
    }
  };

  const getStatusBadge = (setting: PricingSetting) => {
    if (!setting.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          Inactive
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
        Active
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="relative flex min-h-screen w-full flex-col group/design-root bg-background-light dark:bg-background-dark">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-4 shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-8 w-8">
              <img 
                src="/adrigologo.png" 
                alt="AdriGo+ Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="text-lg font-bold tracking-[-0.015em] text-[#131616] dark:text-white">Admin Panel</h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </Link>
            <Link href="/admin/rides" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">directions_car</span>
              <p className="text-sm font-medium">Rides</p>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">group</span>
              <p className="text-sm font-medium">Users</p>
            </Link>
            <Link href="/admin/withdrawals" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">paid</span>
              <p className="text-sm font-medium">Withdrawals</p>
            </Link>
            <Link href="/admin/applications" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">description</span>
              <p className="text-sm font-medium">Applications</p>
            </Link>
            <Link href="/admin/discounts" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">local_offer</span>
              <p className="text-sm font-medium">Discounts</p>
            </Link>
            <Link href="/admin/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>attach_money</span>
              <p className="text-sm font-bold">Pricing</p>
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">monitoring</span>
              <p className="text-sm font-medium">Reports</p>
            </Link>
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                 style={{backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZkuiPQz-9bU_xvPIJ-xdF7ktVgpng0Hxwto0kFab1hUZVGi8ygSPqpResjQ9sUgJJvu5RG0XtpZLQk836HvE_xCqvwX92lGLHjW9iC08hE3cwNYO1fToE5n51-ZFsgLLIvoH_C1db8xIooZXsEYoSznmoAmYECEVaOUlDhUohkZ6TLuiix-E1ydx6qeRqkBDtDoLsZxW9-fvcMw6s-9AY37wF1vrYvgREUFfePc6Dh5Qh27yfTXRxefJYi7cep7O8zNmRB7Do9-wd")'}}></div>
            <div className="flex flex-col">
              <h1 className="text-base font-medium text-[#131616] dark:text-white">{profile?.full_name || 'Admin User'}</h1>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-4 bg-white dark:bg-background-dark">
            <div className="flex items-center gap-4 text-[#131616] dark:text-white">
              <h1 className="text-2xl font-bold">Pricing Settings</h1>
            </div>
            <div className="flex flex-1 justify-end gap-3">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-background-light dark:bg-gray-700 text-[#131616] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-background-light dark:bg-gray-700 text-[#131616] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                   style={{backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRMBgSmW9laNC9jMDC3v7VWFSBvTSQhWodUSCzPrPz_Zood2K2bqE2kznrCdT-yJ3pEL5yHfus-VOVr8cR9MhZCfRywfY0P9kreMzC22Ql6fyrfyYvysK8HPy5sn6_pP8o-nfKBsiZuCYFXr5Cs7UG5Cy3v780kQQc4uoIO0bC6_HBF0cmewZaRwYRS3GZg0-W9QanD-dYIxoGKCqx7KxsSgmqyYYQ_Fe-kO9psSDBi_HWkJaOBETsK0duzc3k7kxEfcQcUMhEmXBC")'}}></div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-8">
            <div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm">
              {/* Title and Create Button */}
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <p className="text-[#131616] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                  Pricing Management
                </p>
                <button 
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-[#131616] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                  <span className="truncate">Create Pricing Setting</span>
                </button>
              </div>

              {/* Table */}
              <div className="px-4 py-3 @container">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Base Fare (€)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Per KM Rate (€)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Per Minute Rate (€)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Included KM</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Minimum Fare (€)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Budva/KM (€)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kotor/KM (€)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tivat/KM (€)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Updated</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={11} className="px-4 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-gray-500">Loading pricing settings...</p>
                            </div>
                          </td>
                        </tr>
                      ) : pricingSettings.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                            No pricing settings found. Create one to get started.
                          </td>
                        </tr>
                      ) : (
                        pricingSettings.map((setting) => (
                          <tr key={setting.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#131616] dark:text-white">
                              €{parseFloat(setting.base_fare).toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              €{parseFloat(setting.per_km_rate).toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              €{parseFloat(setting.per_minute_rate).toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {parseFloat(setting.included_km).toFixed(2)} km
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              €{parseFloat(setting.minimum_fare).toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {setting.budva_per_km_rate ? `€${parseFloat(setting.budva_per_km_rate).toFixed(2)}` : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {setting.kotor_per_km_rate ? `€${parseFloat(setting.kotor_per_km_rate).toFixed(2)}` : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {setting.tivat_per_km_rate ? `€${parseFloat(setting.tivat_per_km_rate).toFixed(2)}` : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {getStatusBadge(setting)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(setting.updated_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEdit(setting)}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  title="Edit"
                                >
                                  <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button 
                                  onClick={() => handleToggleActive(setting)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                  title={setting.is_active ? 'Deactivate' : 'Activate'}
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    {setting.is_active ? 'toggle_on' : 'toggle_off'}
                                  </span>
                                </button>
                                <button 
                                  onClick={() => handleDelete(setting.id)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                  title="Delete"
                                >
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-background-dark rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#131616] dark:text-white">
                  {editingSetting ? 'Edit Pricing Setting' : 'Create New Pricing Setting'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Base Fare (€) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.base_fare}
                      onChange={(e) => setFormData({ ...formData, base_fare: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="1.75"
                    />
                    <p className="text-xs text-gray-500 mt-1">Initial fare charged for every ride</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Per Kilometer Rate (€) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.per_km_rate}
                      onChange={(e) => setFormData({ ...formData, per_km_rate: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="0.65"
                    />
                    <p className="text-xs text-gray-500 mt-1">Rate charged per kilometer</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Per Minute Rate (€) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.per_minute_rate}
                      onChange={(e) => setFormData({ ...formData, per_minute_rate: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="0.10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Rate charged per minute</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Included Kilometers <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.included_km}
                      onChange={(e) => setFormData({ ...formData, included_km: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="1.0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Kilometers included in base fare</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Fare (€) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.minimum_fare}
                      onChange={(e) => setFormData({ ...formData, minimum_fare: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="1.75"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum fare for any ride</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">City-Specific Per KM Rates (Optional)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Budva Per KM Rate (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.budva_per_km_rate}
                        onChange={(e) => setFormData({ ...formData, budva_per_km_rate: e.target.value })}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                        placeholder="0.80"
                      />
                      <p className="text-xs text-gray-500 mt-1">Rate for Budva area</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kotor Per KM Rate (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.kotor_per_km_rate}
                        onChange={(e) => setFormData({ ...formData, kotor_per_km_rate: e.target.value })}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                        placeholder="0.85"
                      />
                      <p className="text-xs text-gray-500 mt-1">Rate for Kotor area</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tivat Per KM Rate (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.tivat_per_km_rate}
                        onChange={(e) => setFormData({ ...formData, tivat_per_km_rate: e.target.value })}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                        placeholder="0.90"
                      />
                      <p className="text-xs text-gray-500 mt-1">Rate for Tivat area</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingSetting ? 'Update' : 'Create'} Pricing Setting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}

