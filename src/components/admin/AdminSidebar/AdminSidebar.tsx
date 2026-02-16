'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Settings,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const adminRoutes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    color: 'text-sky-500',
  },
  {
    label: 'Manage Users',
    icon: Users,
    href: '/admin/users',
    color: 'text-violet-500',
  },
  {
    label: 'Services',
    icon: CalendarDays,
    href: '/admin/services',
    color: 'text-violet-500',
  },
  {
    label: 'All Bookings',
    icon: CalendarDays,
    href: '/admin/bookings',
    color: 'text-pink-700',
  },
  {
    label: 'Payment History',
    icon: CreditCard,
    href: '/admin/payments',
    color: 'text-orange-500',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'text-gray-500',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14 ">
          <div className="relative w-8 h-8 mr-4">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold ">
            Care<span className="text-primary">Admin</span>
          </h1>
        </Link>

        <div className="space-y-1 mt-12">
          {adminRoutes.map(route => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400',
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="destructive"
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
