'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface RideRequest {
  id: string;
  rider_id: string;
  driver_id?: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_address: string;
  destination_lat: number;
  destination_lng: number;
  destination_address: string;
  distance_km?: number;
  estimated_duration_minutes?: number;
  estimated_fare?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  requested_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  notes?: string;
  payment_method?: string;
  email_sent?: boolean;
  assigned_driver_id?: string;
  assignment_expires_at?: string;
  queue_position?: number;
  assignment_attempts?: number;
  created_at: string;
  updated_at: string;
  rider_name?: string;
  driver_name?: string;
}

export default function Rides() {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
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
    fetchRides();
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

  const fetchRides = async () => {
    try {
      setLoading(true);
      
      // Fetch rides
      const { data: ridesData, error: ridesError } = await supabase
        .from('ride_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (ridesError) {
        console.error('Error fetching rides:', ridesError);
        return;
      }

      if (!ridesData || ridesData.length === 0) {
        setRides([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set([
        ...ridesData.map(ride => ride.rider_id),
        ...ridesData.filter(ride => ride.driver_id).map(ride => ride.driver_id)
      ])];

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Create a map of user profiles
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Format rides with user names
      const formattedRides = ridesData.map(ride => {
        const rider = profilesMap.get(ride.rider_id);
        const driver = ride.driver_id ? profilesMap.get(ride.driver_id) : null;
        
        return {
          ...ride,
          rider_name: rider?.full_name || 'Unknown Rider',
          driver_name: driver?.full_name || (ride.assigned_driver_id ? 'Assigned' : 'Unassigned'),
        };
      });

      setRides(formattedRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (rideId: string, newStatus: string) => {
    const loadingToast = toast.loading(`Updating ride status to ${newStatus}...`);
    
    try {
      const { error } = await supabase
        .from('ride_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', rideId);

      if (error) {
        console.error('Error updating ride status:', error);
        toast.error('Error updating ride status. Please try again.', { id: loadingToast });
        return;
      }

      toast.success(`Ride status updated to ${newStatus} successfully!`, { id: loadingToast });
      // Refresh rides
      fetchRides();
    } catch (error) {
      console.error('Error updating ride status:', error);
      toast.error('Error updating ride status. Please try again.', { id: loadingToast });
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`}>
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className={`${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200`}>
            In Progress
          </span>
        );
      case 'accepted':
        return (
          <span className={`${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200`}>
            Accepted
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200`}>
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200`}>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const filteredRides = rides.filter(ride => {
    const matchesSearch = (ride.rider_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (ride.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         ride.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.destination_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ride.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRides = filteredRides.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                <h1 className="text-2xl font-bold">Rides Management</h1>
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
                  <div>
                    <p className="text-[#131616] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                      Ride Requests
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredRides.length)} of {filteredRides.length} rides
                    </p>
                  </div>
                  <button 
                    onClick={fetchRides}
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
                      placeholder="Search by rider, driver, or address..." 
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
                      <option>Accepted</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="px-4 py-3 @container">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading rides...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rider</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Driver</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Route</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Distance</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Fare</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Requested</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {paginatedRides.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                No rides found.
                              </td>
                            </tr>
                          ) : (
                            paginatedRides.map((ride) => (
                            <tr key={ride.id}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#131616] dark:text-white">
                                {ride.rider_name || 'Unknown Rider'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {ride.driver_name || 'Unassigned'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="max-w-xs">
                                  <p className="truncate font-medium">{ride.pickup_address}</p>
                                  <p className="truncate text-xs">→ {ride.destination_address}</p>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {ride.distance_km ? `${ride.distance_km.toFixed(1)} km` : 'N/A'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {ride.estimated_fare ? `€${ride.estimated_fare}` : 'N/A'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  ride.payment_method === 'Cash' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {ride.payment_method === 'Cash' ? 'Cash' : 'Card'}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {getStatusBadge(ride.status)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(ride.requested_at)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  {ride.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={() => handleStatusChange(ride.id, 'accepted')}
                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                      >
                                        Accept
                                      </button>
                                      <span>/</span>
                                      <button 
                                        onClick={() => handleStatusChange(ride.id, 'cancelled')}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                  {ride.status === 'accepted' && (
                                    <button 
                                      onClick={() => handleStatusChange(ride.id, 'in_progress')}
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                    >
                                      Start
                                    </button>
                                  )}
                                  {ride.status === 'in_progress' && (
                                    <button 
                                      onClick={() => handleStatusChange(ride.id, 'completed')}
                                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                    >
                                      Complete
                                    </button>
                                  )}
                                  {(ride.status === 'completed' || ride.status === 'cancelled') && (
                                    <span className="text-gray-400">No actions</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {!loading && filteredRides.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  currentPage === pageNum
                                    ? 'bg-primary text-white'
                                    : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
