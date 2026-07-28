import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="w-full h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-indigo-600" />
        <span className="font-semibold text-lg text-gray-800">Task Board</span>
      </div>
      <div className="text-sm text-gray-500">
        Placeholder Navbar
      </div>
    </header>
  );
};

export default Navbar;
