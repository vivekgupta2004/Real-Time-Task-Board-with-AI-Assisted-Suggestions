'use client';

import React from 'react';
import { LayoutDashboard, LogOut, User as UserIcon, Home } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/notification/NotificationBell';
import toast from 'react-hot-toast';
import Link from 'next/link';

export const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b border-gray-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">TaskBoard AI</span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationBell />

            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200/80">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
              </div>
              <span className="text-xs font-semibold text-slate-800 max-w-[100px] sm:max-w-[150px] truncate">
                {user.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
            <Link href="/login" className="px-3.5 py-1.5 text-slate-700 hover:text-indigo-600 transition">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

