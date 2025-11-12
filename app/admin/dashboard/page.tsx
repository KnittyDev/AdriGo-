'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface DashboardStats {
  totalRides: number;
  totalUsers: number;
  totalDrivers: number;
  totalEarnings: number;
  pendingWithdrawals: number;
  completedRides: number;
  activeDrivers: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRides: 0,
    totalUsers: 0,
    totalDrivers: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0,
    completedRides: 0,
    activeDrivers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { signOut, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
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

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch rides count
      const { count: ridesCount } = await supabase
        .from('ride_requests')
        .select('*', { count: 'exact', head: true });

      // Fetch completed rides count
      const { count: completedRidesCount } = await supabase
        .from('ride_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Fetch total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch drivers count
      const { count: driversCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'driver');

      // Fetch active drivers count
      const { count: activeDriversCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'driver')
        .eq('driver_status', 'available');

      // Fetch pending withdrawals count
      const { count: pendingWithdrawalsCount } = await supabase
        .from('withdraw_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total revenue from completed rides
      const { data: revenueData } = await supabase
        .from('ride_requests')
        .select('estimated_fare')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, ride) => sum + (parseFloat(ride.estimated_fare) || 0), 0) || 0;

      setStats({
        totalRides: ridesCount || 0,
        totalUsers: usersCount || 0,
        totalDrivers: driversCount || 0,
        totalEarnings: totalRevenue,
        pendingWithdrawals: pendingWithdrawalsCount || 0,
        completedRides: completedRidesCount || 0,
        activeDrivers: activeDriversCount || 0,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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

  const StatCard = ({ title, value, icon, color, trend, trendValue }: { 
    title: string; 
    value: string | number; 
    icon: string; 
    color: string; 
    trend?: string; 
    trendValue?: string; 
  }) => (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} shadow-lg`}>
            <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
              trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              <span className="material-symbols-outlined text-sm">
                {trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat'}
              </span>
              {trendValue}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="relative flex min-h-screen w-full flex-col group/design-root bg-background-light dark:bg-background-dark">
        <div className="flex flex-1">
          <AdminSidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="relative bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
              <div className="relative flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Welcome back, {profile?.full_name || 'Admin'}! Here's what's happening today.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="relative flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                    <span className="material-symbols-outlined text-xl">notifications</span>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-all duration-300 hover:-translate-y-0.5"
                    title="Logout"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                  </button>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg border-2 border-white dark:border-gray-800 overflow-hidden">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full" 
                           style={{backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRMBgSmW9laNC9jMDC3v7VWFSBvTSQhWodUSCzPrPz_Zood2K2bqE2kznrCdT-yJ3pEL5yHfus-VOVr8cR9MhZCfRywfY0P9kreMzC22Ql6fyrfyYvysK8HPy5sn6_pP8o-nfKBsiZuCYFXr5Cs7UG5Cy3v780kQQc4uoIO0bC6_HBF0cmewZaRwYRS3GZg0-W9QanD-dYIxoGKCqx7KxsSgmqyYYQ_Fe-kO9psSDBi_HWkJaOBETsK0duzc3k7kxEfcQcUMhEmXBC")'}}></div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Rides"
                    value={loading ? '...' : stats.totalRides}
                    icon="directions_car"
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    trend="up"
                    trendValue="+12%"
                  />
                  <StatCard
                    title="Total Users"
                    value={loading ? '...' : stats.totalUsers}
                    icon="group"
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    trend="up"
                    trendValue="+8%"
                  />
                  <StatCard
                    title="Active Drivers"
                    value={loading ? '...' : stats.activeDrivers}
                    icon="local_taxi"
                    color="bg-gradient-to-br from-yellow-500 to-orange-500"
                    trend="up"
                    trendValue="+5%"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={loading ? '...' : `€${stats.totalRevenue.toFixed(2)}`}
                    icon="euro"
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    trend="up"
                    trendValue="+15%"
                  />
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    title="Completed Rides"
                    value={loading ? '...' : stats.completedRides}
                    icon="check_circle"
                    color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    trend="up"
                    trendValue="+10%"
                  />
                  <StatCard
                    title="Pending Withdrawals"
                    value={loading ? '...' : stats.pendingWithdrawals}
                    icon="pending"
                    color="bg-gradient-to-br from-orange-500 to-red-500"
                    trend="down"
                    trendValue="-3%"
                  />
                  <StatCard
                    title="Total Drivers"
                    value={loading ? '...' : stats.totalDrivers}
                    icon="person"
                    color="bg-gradient-to-br from-cyan-500 to-blue-500"
                    trend="up"
                    trendValue="+7%"
                  />
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your platform efficiently</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">flash_on</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/rides" className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                          <span className="material-symbols-outlined text-white text-xl">directions_car</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manage Rides</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">View and manage ride requests</p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                          <span>View Rides</span>
                          <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                      </div>
                    </Link>
                    
                    <Link href="/admin/withdrawals" className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                          <span className="material-symbols-outlined text-white text-xl">paid</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Withdrawals</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Review withdrawal requests</p>
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                          <span>Review Requests</span>
                          <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                      </div>
                    </Link>
                    
                    <Link href="/admin/drivers" className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                          <span className="material-symbols-outlined text-white text-xl">local_taxi</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Driver Management</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">View and manage all drivers</p>
                        <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                          <span>Manage Drivers</span>
                          <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Latest platform activities</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">history</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">directions_car</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">New ride request</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">paid</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Withdrawal approved</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                      </div>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">person_add</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">New driver registered</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                      </div>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">New</span>
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
