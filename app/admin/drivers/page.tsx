'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Driver {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
  rating: string;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_plate: string | null;
  vehicle_color: string | null;
  driver_status: 'offline' | 'available' | 'on_trip';
  verified: boolean;
  current_lat: number | null;
  current_lng: number | null;
  total_trips: number;
  total_earnings: string;
  created_at: string;
  updated_at: string;
  verification_status: string;
  trips_count?: number;
  earnings_from_wallet?: number;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'available' | 'offline' | 'on_trip'>('All');
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'verified' | 'unverified'>('All');
  const { signOut, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Sekme değiştirip tekrar geldiğinde sayfayı yenile
  useEffect(() => {
    let wasHidden = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasHidden = true;
      } else if (wasHidden && !document.hidden) {
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      
      const { data: driversData, error: driversError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'driver')
        .order('created_at', { ascending: false });

      if (driversError) {
        console.error('Error fetching drivers:', driversError);
        toast.error('Error fetching drivers');
        return;
      }

      if (!driversData || driversData.length === 0) {
        setDrivers([]);
        return;
      }

      // Get driver IDs
      const driverIds = driversData.map(driver => driver.id);

      // Fetch trips count for each driver
      const { data: tripsData, error: tripsError } = await supabase
        .from('ride_requests')
        .select('driver_id')
        .eq('status', 'completed')
        .in('driver_id', driverIds)
        .not('driver_id', 'is', null);

      if (tripsError) {
        console.error('Error fetching trips:', tripsError);
      }

      // Count trips per driver
      const tripsCountMap = new Map<string, number>();
      tripsData?.forEach(ride => {
        if (ride.driver_id) {
          tripsCountMap.set(ride.driver_id, (tripsCountMap.get(ride.driver_id) || 0) + 1);
        }
      });

      // Fetch earnings from wallet_transactions (only ride_earning and ride_earnings)
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_transactions')
        .select('user_id, amount, transaction_type')
        .in('user_id', driverIds)
        .in('transaction_type', ['ride_earning', 'ride_earnings']);

      if (walletError) {
        console.error('Error fetching wallet transactions:', walletError);
      }

      // Calculate earnings per driver (sum of ride_earning transactions)
      const earningsMap = new Map<string, number>();
      walletData?.forEach(transaction => {
        if (transaction.user_id && transaction.amount) {
          const amount = parseFloat(transaction.amount.toString());
          // Sum all ride_earning transactions (they should be positive)
          earningsMap.set(
            transaction.user_id,
            (earningsMap.get(transaction.user_id) || 0) + amount
          );
        }
      });

      // Combine driver data with trips and earnings
      const driversWithStats = driversData.map(driver => ({
        ...driver,
        trips_count: tripsCountMap.get(driver.id) || 0,
        earnings_from_wallet: earningsMap.get(driver.id) || 0,
      }));

      setDrivers(driversWithStats);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Error fetching drivers');
    } finally {
      setLoading(false);
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

  const getStatusBadge = (driver: Driver) => {
    const statusColors = {
      available: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      offline: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
      on_trip: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[driver.driver_status]}`}>
        {driver.driver_status === 'available' ? 'Available' : driver.driver_status === 'on_trip' ? 'On Trip' : 'Offline'}
      </span>
    );
  };

  const getVerificationBadge = (driver: Driver) => {
    if (driver.verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
        Unverified
      </span>
    );
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || driver.driver_status === statusFilter;
    const matchesVerification = 
      verificationFilter === 'All' || 
      (verificationFilter === 'verified' && driver.verified) ||
      (verificationFilter === 'unverified' && !driver.verified);
    
    return matchesSearch && matchesStatus && matchesVerification;
  });

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
              <h1 className="text-2xl font-bold">Drivers</h1>
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
              {/* Title */}
              <div className="mb-6">
                <p className="text-[#131616] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                  Driver Management
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Total Drivers: {filteredDrivers.length}
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex gap-2 items-center w-full max-w-sm">
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">search</span>
                  <input 
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm text-[#131616] dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Search by name, email, phone, or plate..." 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400 shrink-0" htmlFor="status-filter">
                      Status:
                    </label>
                    <select 
                      className="bg-transparent border-0 focus:ring-0 text-sm font-medium text-[#131616] dark:text-white dark:bg-background-dark rounded-lg" 
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'All' | 'available' | 'offline' | 'on_trip')}
                    >
                      <option>All</option>
                      <option value="available">Available</option>
                      <option value="offline">Offline</option>
                      <option value="on_trip">On Trip</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400 shrink-0" htmlFor="verification-filter">
                      Verification:
                    </label>
                    <select 
                      className="bg-transparent border-0 focus:ring-0 text-sm font-medium text-[#131616] dark:text-white dark:bg-background-dark rounded-lg" 
                      id="verification-filter"
                      value={verificationFilter}
                      onChange={(e) => setVerificationFilter(e.target.value as 'All' | 'verified' | 'unverified')}
                    >
                      <option>All</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="px-4 py-3 @container">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Driver</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Vehicle</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Verification</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Trips</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-gray-500">Loading drivers...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredDrivers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            No drivers found.
                          </td>
                        </tr>
                      ) : (
                        filteredDrivers.map((driver) => (
                          <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                                  style={{backgroundImage: driver.avatar_url ? `url(${driver.avatar_url})` : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZkuiPQz-9bU_xvPIJ-xdF7ktVgpng0Hxwto0kFab1hUZVGi8ygSPqpResjQ9sUgJJvu5RG0XtpZLQk836HvE_xCqvwX92lGLHjW9iC08hE3cwNYO1fToE5n51-ZFsgLLIvoH_C1db8xIooZXsEYoSznmoAmYECEVaOUlDhUohkZ6TLuiix-E1ydx6qeRqkBDtDoLsZxW9-fvcMw6s-9AY37wF1vrYvgREUFfePc6Dh5Qh27yfTXRxefJYi7cep7O8zNmRB7Do9-wd")'}}
                                ></div>
                                <div>
                                  <p className="text-sm font-medium text-[#131616] dark:text-white">
                                    {driver.full_name || 'No name'}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ID: {driver.id.slice(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p>{driver.email || '-'}</p>
                                <p className="text-xs">{driver.phone_number || '-'}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {driver.vehicle_make && driver.vehicle_model ? (
                                  <>
                                    <p className="font-medium">{driver.vehicle_make} {driver.vehicle_model}</p>
                                    <p className="text-xs">{driver.vehicle_plate || '-'}</p>
                                    <p className="text-xs">{driver.vehicle_color || '-'}</p>
                                  </>
                                ) : (
                                  <p>-</p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {getStatusBadge(driver)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {getVerificationBadge(driver)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                <span>{parseFloat(driver.rating).toFixed(1)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {driver.trips_count || 0}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              €{(driver.earnings_from_wallet || 0).toFixed(2)}
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
      </div>
    </ProtectedRoute>
  );
}

