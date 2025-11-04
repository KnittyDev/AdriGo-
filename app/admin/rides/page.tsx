'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
              <Link href="/admin/rides" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>directions_car</span>
                <p className="text-sm font-bold">Rides</p>
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
                  <p className="text-[#131616] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    Ride Requests
                  </p>
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
                          {filteredRides.map((ride) => (
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
                          ))}
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
    </ProtectedRoute>
  );
}
