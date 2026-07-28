'use client';

import React from 'react';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="w-full h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-indigo-600" />
        <span className="font-semibold text-lg text-gray-800">Task Board</span>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm font-medium">
            <a href="/login" className="text-gray-600 hover:text-indigo-600 transition">
              Sign In
            </a>
            <a
              href="/signup"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
