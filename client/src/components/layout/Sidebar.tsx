import React from 'react';
import { CheckSquare, User, Settings } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r border-gray-200 bg-gray-50 p-4 hidden md:block">
      <nav className="space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer">
          <CheckSquare className="h-4 w-4" />
          <span>Tasks</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
