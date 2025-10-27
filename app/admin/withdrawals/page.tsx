'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface WithdrawalRequest {
  id: string;
  driver_id: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  payment_method: string;
  bank_account_details?: {
    iban?: string;
    swift?: string;
    bank_name?: string;
    account_holder?: string;
    account_number?: string;
  };
  admin_notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  driver_name?: string;
  driver_email?: string;
  driver_iban?: string;
  driver_bank_name?: string;
  driver_account_holder?: string;
}

export default function Withdrawals() {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { signOut, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      
      // Fetch withdrawal requests
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdraw_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (withdrawalsError) {
        console.error('Error fetching withdrawals:', withdrawalsError);
        return;
      }

      if (!withdrawalsData || withdrawalsData.length === 0) {
        setWithdrawalRequests([]);
        return;
      }

      // Get unique driver IDs
      const driverIds = [...new Set(withdrawalsData.map(withdrawal => withdrawal.driver_id))];

      // Fetch driver profiles with bank details
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, iban, bank_name, account_holder')
        .in('id', driverIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Create a map of driver profiles
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Format withdrawals with driver names and bank details
      const formattedWithdrawals = withdrawalsData.map(withdrawal => {
        const driver = profilesMap.get(withdrawal.driver_id);
        
        return {
          ...withdrawal,
          driver_name: driver?.full_name || 'Unknown Driver',
          driver_email: driver?.email || 'Unknown Email',
          driver_iban: driver?.iban || 'N/A',
          driver_bank_name: driver?.bank_name || 'N/A',
          driver_account_holder: driver?.account_holder || 'N/A',
        };
      });

      setWithdrawalRequests(formattedWithdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const loadingToast = toast.loading('Approving withdrawal...');
    
    try {
      const { error } = await supabase
        .from('withdraw_requests')
        .update({ 
          status: 'approved',
          processed_by: profile?.id,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error approving withdrawal:', error);
        toast.error('Error approving withdrawal. Please try again.', { id: loadingToast });
        return;
      }

      toast.success('Withdrawal approved successfully!', { id: loadingToast });
      // Refresh withdrawals
      fetchWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast.error('Error approving withdrawal. Please try again.', { id: loadingToast });
    }
  };

  const handleReject = async (id: string) => {
    const loadingToast = toast.loading('Rejecting withdrawal...');
    
    try {
      const { error } = await supabase
        .from('withdraw_requests')
        .update({ 
          status: 'rejected',
          processed_by: profile?.id,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting withdrawal:', error);
        toast.error('Error rejecting withdrawal. Please try again.', { id: loadingToast });
        return;
      }

      toast.success('Withdrawal rejected successfully!', { id: loadingToast });
      // Refresh withdrawals
      fetchWithdrawals();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      toast.error('Error rejecting withdrawal. Please try again.', { id: loadingToast });
    }
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

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // Handle CSV export logic here
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'approved':
        return (
          <span className={`${baseClasses} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`}>
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200`}>
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200`}>
            Rejected
          </span>
        );
      case 'completed':
        return (
          <span className={`${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200`}>
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const filteredRequests = withdrawalRequests.filter(request => {
    const matchesSearch = request.driver_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.driver_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
                         request.status === statusFilter.toLowerCase();
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
            <Link href="/admin/withdrawals" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>paid</span>
              <p className="text-sm font-bold">Withdrawals</p>
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
              <h1 className="text-2xl font-bold">Withdrawals</h1>
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
              {/* Title and Export Button */}
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <p className="text-[#131616] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                  Withdrawal Management
                </p>
                <button 
                  onClick={handleExportCSV}
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-[#131616] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>download</span>
                  <span className="truncate">Export CSV</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex justify-between items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 items-center w-full max-w-sm">
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">search</span>
                  <input 
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm text-[#131616] dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Search by User ID, Name..." 
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
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option>All</option>
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                </div>
              </div>

              {/* Table */}
              <div className="px-4 py-3 @container">
                <div className="overflow-x-auto">
                  <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Driver ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Driver Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Bank Details</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Request Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Payment Method</th>
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
                              <p className="text-gray-500">Loading withdrawals...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            No withdrawal requests found.
                          </td>
                        </tr>
                      ) : (
                        filteredRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {request.driver_id.substring(0, 8)}...
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#131616] dark:text-white">
                              {request.driver_name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="max-w-xs">
                                <p className="truncate font-medium">{request.driver_bank_name}</p>
                                <p className="truncate text-xs">IBAN: {request.driver_iban}</p>
                                <p className="truncate text-xs">Holder: {request.driver_account_holder}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(request.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              €{request.amount}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                request.payment_method === 'bank_transfer' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {request.payment_method === 'bank_transfer' ? 'Bank Transfer' : 'Other'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {getStatusBadge(request.status)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              {request.status === 'pending' ? (
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleApprove(request.id)}
                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <span>/</span>
                                  <button 
                                    onClick={() => handleReject(request.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <a className="text-primary hover:text-primary/80 transition-colors" href="#">
                                  Review
                                </a>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" href="#">
                      Previous
                    </a>
                    <a className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" href="#">
                      Next
                    </a>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">97</span> results
                      </p>
                    </div>
                    <div>
                      <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <a className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" href="#">
                          <span className="sr-only">Previous</span>
                          <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </a>
                        <a aria-current="page" className="z-10 bg-primary/20 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">1</a>
                        <a className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">2</a>
                        <a className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium" href="#">3</a>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">...</span>
                        <a className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium" href="#">8</a>
                        <a className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" href="#">
                          <span className="sr-only">Next</span>
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}
