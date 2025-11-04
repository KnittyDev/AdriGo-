'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DiscountCode {
  id: string;
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: string;
  max_discount_amount: string | null;
  min_order_amount: string;
  description: string | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  usage_limit: number | null;
  created_at: string;
  updated_at: string;
  usage_count?: number;
}

export default function Discounts() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'inactive'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const { signOut, profile } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'fixed' | 'percentage',
    discount_value: '',
    max_discount_amount: '',
    min_order_amount: '0',
    description: '',
    is_active: true,
    valid_from: new Date().toISOString().slice(0, 16),
    valid_until: '',
    usage_limit: '',
  });

  useEffect(() => {
    fetchDiscounts();
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

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      
      // Fetch discount codes with usage count
      const { data: discountsData, error: discountsError } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (discountsError) {
        console.error('Error fetching discounts:', discountsError);
        toast.error('Error fetching discounts');
        return;
      }

      // Get usage counts for each discount
      const discountsWithUsage = await Promise.all(
        (discountsData || []).map(async (discount) => {
          const { count } = await supabase
            .from('discount_usage')
            .select('*', { count: 'exact', head: true })
            .eq('discount_code_id', discount.id);

          return {
            ...discount,
            usage_count: count || 0,
          };
        })
      );

      setDiscounts(discountsWithUsage);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error('Error fetching discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discount_value || !formData.valid_until) {
      toast.error('Please fill in all required fields');
      return;
    }

    const loadingToast = toast.loading(editingDiscount ? 'Updating discount...' : 'Creating discount...');

    try {
      const discountData = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        min_order_amount: parseFloat(formData.min_order_amount) || 0,
        description: formData.description || null,
        is_active: formData.is_active,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: new Date(formData.valid_until).toISOString(),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        updated_at: new Date().toISOString(),
      };

      if (editingDiscount) {
        const { error } = await supabase
          .from('discount_codes')
          .update(discountData)
          .eq('id', editingDiscount.id);

        if (error) throw error;
        toast.success('Discount updated successfully!', { id: loadingToast });
      } else {
        const { error } = await supabase
          .from('discount_codes')
          .insert([discountData]);

        if (error) throw error;
        toast.success('Discount created successfully!', { id: loadingToast });
      }

      setShowModal(false);
      resetForm();
      fetchDiscounts();
    } catch (error: any) {
      console.error('Error saving discount:', error);
      toast.error(error.message || 'Error saving discount', { id: loadingToast });
    }
  };

  const handleEdit = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      max_discount_amount: discount.max_discount_amount || '',
      min_order_amount: discount.min_order_amount || '0',
      description: discount.description || '',
      is_active: discount.is_active,
      valid_from: new Date(discount.valid_from).toISOString().slice(0, 16),
      valid_until: new Date(discount.valid_until).toISOString().slice(0, 16),
      usage_limit: discount.usage_limit?.toString() || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting discount...');

    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Discount deleted successfully!', { id: loadingToast });
      fetchDiscounts();
    } catch (error: any) {
      console.error('Error deleting discount:', error);
      toast.error(error.message || 'Error deleting discount', { id: loadingToast });
    }
  };

  const handleToggleActive = async (discount: DiscountCode) => {
    const loadingToast = toast.loading('Updating discount status...');

    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !discount.is_active, updated_at: new Date().toISOString() })
        .eq('id', discount.id);

      if (error) throw error;

      toast.success(`Discount ${!discount.is_active ? 'activated' : 'deactivated'}!`, { id: loadingToast });
      fetchDiscounts();
    } catch (error: any) {
      console.error('Error updating discount:', error);
      toast.error(error.message || 'Error updating discount', { id: loadingToast });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      max_discount_amount: '',
      min_order_amount: '0',
      description: '',
      is_active: true,
      valid_from: new Date().toISOString().slice(0, 16),
      valid_until: '',
      usage_limit: '',
    });
    setEditingDiscount(null);
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

  const getStatusBadge = (discount: DiscountCode) => {
    const now = new Date();
    const validUntil = new Date(discount.valid_until);
    const validFrom = new Date(discount.valid_from);

    if (!discount.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          Inactive
        </span>
      );
    }

    if (now < validFrom) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          Scheduled
        </span>
      );
    }

    if (now > validUntil) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
          Expired
        </span>
      );
    }

    if (discount.usage_limit && discount.usage_count && discount.usage_count >= discount.usage_limit) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          Limit Reached
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
        Active
      </span>
    );
  };

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'active' && discount.is_active) ||
                         (statusFilter === 'inactive' && !discount.is_active);
    return matchesSearch && matchesStatus;
  });

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
            <Link href="/admin/discounts" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>local_offer</span>
              <p className="text-sm font-bold">Discounts</p>
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
              <h1 className="text-2xl font-bold">Discounts</h1>
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
                  Discount Management
                </p>
                <button 
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-[#131616] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                  <span className="truncate">Create Discount</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex justify-between items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 items-center w-full max-w-sm">
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">search</span>
                  <input 
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm text-[#131616] dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Search by code or description..." 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400 shrink-0" htmlFor="status-filter">
                    Filter by status:
                  </label>
                  <select 
                    className="bg-transparent border-0 focus:ring-0 text-sm font-medium text-[#131616] dark:text-white dark:bg-background-dark rounded-lg" 
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'All' | 'active' | 'inactive')}
                  >
                    <option>All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="px-4 py-3 @container">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Valid Period</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-gray-500">Loading discounts...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredDiscounts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            No discount codes found.
                          </td>
                        </tr>
                      ) : (
                        filteredDiscounts.map((discount) => (
                          <tr key={discount.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#131616] dark:text-white">
                              <span className="font-bold">{discount.code}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <span className="capitalize">{discount.discount_type}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {discount.discount_type === 'percentage' 
                                ? `${discount.discount_value}%`
                                : `€${discount.discount_value}`
                              }
                              {discount.max_discount_amount && discount.discount_type === 'percentage' && (
                                <span className="text-xs text-gray-400 ml-1">(max €{discount.max_discount_amount})</span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                              <p className="truncate">{discount.description || 'No description'}</p>
                              {discount.min_order_amount !== '0' && (
                                <p className="text-xs text-gray-400 mt-1">Min: €{discount.min_order_amount}</p>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex flex-col">
                                <span className="text-xs">
                                  {new Date(discount.valid_from).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-400">
                                  to {new Date(discount.valid_until).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {discount.usage_count || 0}
                              {discount.usage_limit && (
                                <span className="text-gray-400"> / {discount.usage_limit}</span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {getStatusBadge(discount)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEdit(discount)}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  title="Edit"
                                >
                                  <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button 
                                  onClick={() => handleToggleActive(discount)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                  title={discount.is_active ? 'Deactivate' : 'Activate'}
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    {discount.is_active ? 'toggle_on' : 'toggle_off'}
                                  </span>
                                </button>
                                <button 
                                  onClick={() => handleDelete(discount.id)}
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
                  {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
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
                      Discount Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="WELCOME10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.discount_type}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'fixed' | 'percentage' })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder={formData.discount_type === 'percentage' ? '10' : '5.00'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.discount_type === 'percentage' ? 'Percentage (e.g., 10 for 10%)' : 'Fixed amount in EUR'}
                    </p>
                  </div>

                  {formData.discount_type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Discount Amount (optional)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.max_discount_amount}
                        onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                        placeholder="50.00"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Order Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Usage Limit (optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                    rows={2}
                    placeholder="Discount description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valid From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.valid_from}
                      onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valid Until <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:ring-primary focus:border-primary"
                    />
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
                    {editingDiscount ? 'Update' : 'Create'} Discount
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
