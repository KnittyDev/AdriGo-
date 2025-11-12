'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface CommissionSetting {
  id: string;
  payment_type: 'cash' | 'online';
  commission_rate: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CommissionSettings() {
  const [commissionSettings, setCommissionSettings] = useState<CommissionSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState<CommissionSetting | null>(null);
  const { signOut, profile } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    payment_type: 'online' as 'cash' | 'online',
    commission_rate: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCommissionSettings();
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

  const fetchCommissionSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('commission_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching commission settings:', error);
        toast.error('Error fetching commission settings');
        return;
      }

      setCommissionSettings(data || []);
    } catch (error) {
      console.error('Error fetching commission settings:', error);
      toast.error('Error fetching commission settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.commission_rate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const commissionRatePercent = parseFloat(formData.commission_rate);
    if (commissionRatePercent < 0 || commissionRatePercent > 100) {
      toast.error('Commission rate must be between 0 and 100%');
      return;
    }
    
    // Convert percentage to decimal (e.g., 13.5% -> 0.135)
    const commissionRate = commissionRatePercent / 100;

    const loadingToast = toast.loading(editingSetting ? 'Updating commission setting...' : 'Creating commission setting...');

    try {
      const commissionData = {
        payment_type: formData.payment_type,
        commission_rate: commissionRate,
        description: formData.description || null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingSetting) {
        const { error } = await supabase
          .from('commission_settings')
          .update(commissionData)
          .eq('id', editingSetting.id);

        if (error) throw error;
        toast.success('Commission setting updated successfully!', { id: loadingToast });
      } else {
        const { error } = await supabase
          .from('commission_settings')
          .insert([commissionData]);

        if (error) throw error;
        toast.success('Commission setting created successfully!', { id: loadingToast });
      }

      setShowModal(false);
      resetForm();
      fetchCommissionSettings();
    } catch (error: any) {
      console.error('Error saving commission setting:', error);
      toast.error(error.message || 'Error saving commission setting', { id: loadingToast });
    }
  };

  const handleEdit = (setting: CommissionSetting) => {
    setEditingSetting(setting);
    // Convert decimal to percentage for display (e.g., 0.135 -> 13.5)
    const commissionRatePercent = (parseFloat(setting.commission_rate) * 100).toString();
    setFormData({
      payment_type: setting.payment_type,
      commission_rate: commissionRatePercent,
      description: setting.description || '',
      is_active: setting.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this commission setting?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting commission setting...');

    try {
      const { error } = await supabase
        .from('commission_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Commission setting deleted successfully!', { id: loadingToast });
      fetchCommissionSettings();
    } catch (error: any) {
      console.error('Error deleting commission setting:', error);
      toast.error(error.message || 'Error deleting commission setting', { id: loadingToast });
    }
  };

  const handleToggleActive = async (setting: CommissionSetting) => {
    const loadingToast = toast.loading('Updating commission setting status...');

    try {
      const { error } = await supabase
        .from('commission_settings')
        .update({ is_active: !setting.is_active, updated_at: new Date().toISOString() })
        .eq('id', setting.id);

      if (error) throw error;

      toast.success(`Commission setting ${!setting.is_active ? 'activated' : 'deactivated'}!`, { id: loadingToast });
      fetchCommissionSettings();
    } catch (error: any) {
      console.error('Error updating commission setting:', error);
      toast.error(error.message || 'Error updating commission setting', { id: loadingToast });
    }
  };

  const resetForm = () => {
    setFormData({
      payment_type: 'online',
      commission_rate: '',
      description: '',
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

  const getStatusBadge = (setting: CommissionSetting) => {
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
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-4 bg-white dark:bg-background-dark">
            <div className="flex items-center gap-4 text-[#131616] dark:text-white">
              <h1 className="text-2xl font-bold">Commission Settings</h1>
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
                  Commission Management
                </p>
                <button 
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-[#131616] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                  <span className="truncate">Create Commission Setting</span>
                </button>
              </div>

              {/* Table */}
              <div className="px-4 py-3 @container">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Payment Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Commission Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Updated</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-gray-500">Loading commission settings...</p>
                            </div>
                          </td>
                        </tr>
                      ) : commissionSettings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No commission settings found. Create one to get started.
                          </td>
                        </tr>
                      ) : (
                        commissionSettings.map((setting) => (
                          <tr key={setting.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#131616] dark:text-white">
                              <span className="capitalize">{setting.payment_type}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {(parseFloat(setting.commission_rate) * 100).toFixed(2)}%
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                              <p className="truncate">{setting.description || 'No description'}</p>
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
                  {editingSetting ? 'Edit Commission Setting' : 'Create New Commission Setting'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.payment_type}
                    onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as 'cash' | 'online' })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                    disabled={!!editingSetting}
                  >
                    <option value="online">Online</option>
                    <option value="cash">Cash</option>
                  </select>
                  {editingSetting && (
                    <p className="text-xs text-gray-500 mt-1">Payment type cannot be changed after creation</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Commission Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                    placeholder="13.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter as percentage (e.g., 13.5 for 13.5%). Will be converted to decimal (0.135)</p>
                  {formData.commission_rate && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Decimal value: {(parseFloat(formData.commission_rate) / 100).toFixed(4)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Commission rate for online payments (13.5%)"
                  />
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
                    {editingSetting ? 'Update' : 'Create'} Commission Setting
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

