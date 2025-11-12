'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const menuItems = [
    { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/admin/rides', icon: 'directions_car', label: 'Rides' },
    { href: '/admin/drivers', icon: 'local_taxi', label: 'Drivers' },
    { href: '/admin/withdrawals', icon: 'paid', label: 'Withdrawals' },
    { href: '/admin/applications', icon: 'description', label: 'Applications' },
    { href: '/admin/discounts', icon: 'local_offer', label: 'Discounts' },
    { href: '/admin/pricing', icon: 'attach_money', label: 'Pricing' },
    { href: '/admin/commissions', icon: 'percent', label: 'Commissions' },
    { href: '/admin/reports', icon: 'monitoring', label: 'Reports' },
  ];

  return (
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
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-primary/20'
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <p className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{
            backgroundImage: profile?.avatar_url
              ? `url(${profile.avatar_url})`
              : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZkuiPQz-9bU_xvPIJ-xdF7ktVgpng0Hxwto0kFab1hUZVGi8ygSPqpResjQ9sUgJJvu5RG0XtpZLQk836HvE_xCqvwX92lGLHjW9iC08hE3cwNYO1fToE5n51-ZFsgLLIvoH_C1db8xIooZXsEYoSznmoAmYECEVaOUlDhUohkZ6TLuiix-E1ydx6qeRqkBDtDoLsZxW9-fvcMw6s-9AY37wF1vrYvgREUFfePc6Dh5Qh27yfTXRxefJYi7cep7O8zNmRB7Do9-wd")',
          }}
        ></div>
        <div className="flex flex-col">
          <h1 className="text-base font-medium text-[#131616] dark:text-white">
            {profile?.full_name || 'Admin User'}
          </h1>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Administrator</p>
        </div>
      </div>
    </aside>
  );
}

