'use client';

import React, { useEffect, useState } from 'react';
import { Search, ListFilter, Plus, ArrowUpDown, ShieldAlert, Kanban, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskStatus } from '@/types/task';

export const DashboardHeader = () => {
  const { user } = useAuthStore();
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    order,
    setSort,
    viewMode,
    setViewMode,
    openCreateModal,
  } = useTaskStore();

  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Debounce search input (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchQuery) {
        setSearchQuery(searchTerm);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, searchQuery, setSearchQuery]);

  const currentSortKey = `${sortBy}_${order}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [newSortBy, newOrder] = value.split('_');
    setSort(newSortBy, newOrder as 'asc' | 'desc');
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            <span className="text-slate-800">Welcome back, </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user?.name || 'User'}</span> 👋
          </h1>
          <p className="text-sm font-bold text-slate-800 mt-1">
            Manage and track your tasks in real time.
          </p>
        </div>





        <div className="flex items-center gap-3">
          {/* View Mode Toggle Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid List View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input with Debounce */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <div className="flex items-center gap-1 px-2 text-xs font-bold text-slate-500">
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Status:</span>
            </div>
            {[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Completed', value: 'completed' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setStatusFilter(item.value as 'all' | TaskStatus)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  statusFilter === item.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <div className="flex items-center gap-1 px-2 text-xs font-bold text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Priority:</span>
            </div>
            {[
              { label: 'All', value: 'all' },
              { label: 'Low', value: 'low' },
              { label: 'Med', value: 'medium' },
              { label: 'High', value: 'high' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPriorityFilter(item.value as 'all' | 'low' | 'medium' | 'high')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  priorityFilter === item.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={currentSortKey}
              onChange={handleSortChange}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="dueDate_asc">Due Date (Soonest)</option>
              <option value="priority_asc">Priority (High to Low)</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

