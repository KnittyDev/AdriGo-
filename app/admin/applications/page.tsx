'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DriverApplication {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  birth_date: string;
  city: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_color: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const { signOut, profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
    }
  };

  useEffect(() => {
    fetchApplications();
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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      const { data: applicationsData, error } = await supabase
        .from('driver_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast.error('Error fetching applications');
        return;
      }

      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string, notes?: string) => {
    const loadingToast = toast.loading(`Updating application status to ${newStatus}...`);
    
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus !== 'pending') {
        updateData.reviewed_by = profile?.id;
        updateData.reviewed_at = new Date().toISOString();
      }

      if (notes) {
        updateData.admin_notes = notes;
      }

      const { error } = await supabase
        .from('driver_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application status:', error);
        toast.error('Error updating application status. Please try again.', { id: loadingToast });
        return;
      }

      toast.success(`Application status updated to ${newStatus} successfully!`, { id: loadingToast });
      setIsModalOpen(false);
      setSelectedApplication(null);
      setAdminNotes('');
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Error updating application status. Please try again.', { id: loadingToast });
    }
  };

  const openModal = (application: DriverApplication) => {
    setSelectedApplication(application);
    setAdminNotes(application.admin_notes || '');
    setIsModalOpen(true);
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
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200`}>
            Rejected
          </span>
        );
      case 'under_review':
        return (
          <span className={`${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200`}>
            Under Review
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200`}>
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || application.status === statusFilter.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
              <Link href="/admin/applications" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                <p className="text-sm font-bold">Applications</p>
              </Link>
              <Link href="/admin/discounts" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">local_offer</span>
                <p className="text-sm font-medium">Discounts</p>
              </Link>
              <Link href="/admin/pricing" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/20">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">attach_money</span>
                <p className="text-sm font-medium">Pricing</p>
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
                <h1 className="text-2xl font-bold">Driver Applications</h1>
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
                {/* Title and Actions */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <p className="text-[#131616] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    Driver Applications
                  </p>
                  <button 
                    onClick={fetchApplications}
                    className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-[#131616] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>refresh</span>
                    <span className="truncate">Refresh</span>
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex justify-between items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2 items-center w-full max-w-sm">
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">search</span>
                    <input 
                      className="w-full bg-transparent border-0 focus:ring-0 text-sm text-[#131616] dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                      placeholder="Search by name, email, phone, city, or plate..." 
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
                      <option>Under Review</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="px-4 py-3 @container">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading applications...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">City</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Vehicle</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Applied</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 min-w-[200px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredApplications.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                No applications found.
                              </td>
                            </tr>
                          ) : (
                            filteredApplications.map((application) => (
                              <tr key={application.id}>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <p className="text-sm font-medium text-[#131616] dark:text-white">
                                      {application.full_name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Age: {calculateAge(application.birth_date)}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <p className="text-sm text-[#131616] dark:text-white">{application.email}</p>
                                    {application.phone_number && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{application.phone_number}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {application.city}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="max-w-xs">
                                    <p className="truncate font-medium">{application.vehicle_brand} {application.vehicle_model}</p>
                                    <p className="truncate text-xs">{application.vehicle_plate} • {application.vehicle_color}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  {getStatusBadge(application.status)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(application.created_at)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {application.status === 'pending' || application.status === 'under_review' ? (
                                      <>
                                        <button
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to approve ${application.full_name}'s application?`)) {
                                              handleStatusChange(application.id, 'approved');
                                            }
                                          }}
                                          className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                                          title="Approve"
                                        >
                                          <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                                          <span className="hidden sm:inline">Approve</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to reject ${application.full_name}'s application?`)) {
                                              handleStatusChange(application.id, 'rejected');
                                            }
                                          }}
                                          className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                                          title="Reject"
                                        >
                                          <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>close</span>
                                          <span className="hidden sm:inline">Reject</span>
                                        </button>
                                      </>
                                    ) : null}
                                    <button 
                                      onClick={() => openModal(application)}
                                      className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
                                      title="View Details"
                                    >
                                      <span className="material-symbols-outlined text-sm">visibility</span>
                                      <span className="hidden sm:inline">View</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-background-dark rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#131616] dark:text-white">Review Application</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-[#131616] dark:text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{calculateAge(selectedApplication.birth_date)} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{new Date(selectedApplication.birth_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-bold text-[#131616] dark:text-white mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Brand</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.vehicle_brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.vehicle_model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">License Plate</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.vehicle_plate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Color</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{selectedApplication.vehicle_color}</p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h3 className="text-lg font-bold text-[#131616] dark:text-white mb-4">Application Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Applied Date</p>
                    <p className="text-base font-medium text-[#131616] dark:text-white">{formatDate(selectedApplication.created_at)}</p>
                  </div>
                  {selectedApplication.reviewed_at && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reviewed Date</p>
                      <p className="text-base font-medium text-[#131616] dark:text-white">{formatDate(selectedApplication.reviewed_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label htmlFor="adminNotes" className="block text-sm font-medium text-[#131616] dark:text-white mb-2">
                  Admin Notes
                </label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Add notes about this application..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleStatusChange(selectedApplication.id, 'under_review', adminNotes)}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Mark as Under Review
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApplication.id, 'approved', adminNotes)}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApplication.id, 'rejected', adminNotes)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
