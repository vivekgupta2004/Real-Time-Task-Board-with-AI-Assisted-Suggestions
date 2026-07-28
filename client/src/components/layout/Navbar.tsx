'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, User as UserIcon, Menu, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useRouter, usePathname } from 'next/navigation';
import NotificationBell from '@/components/notification/NotificationBell';
import toast from 'react-hot-toast';
import Link from 'next/link';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
  const { isLoading: tasksLoading, isSubmitting } = useTaskStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const isAnyLoading = authLoading || tasksLoading || isSubmitting;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">TaskBoard AI</span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  pathname === '/dashboard'
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </nav>
          )}
        </div>

        {/* Right Section Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {authLoading ? (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Loading...</span>
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <NotificationBell />

              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm font-semibold">
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

        {/* Mobile Header Right Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && <NotificationBell />}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Top Loading Progress Line */}
      {isAnyLoading && (
        <div className="w-full h-0.5 bg-indigo-100 overflow-hidden relative">
          <div className="h-full bg-indigo-600 animate-pulse w-full" />
        </div>
      )}

      {/* Mobile Slide-Down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-2">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  pathname === '/dashboard'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;


