'use client';

import React, { useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import TaskCard from './TaskCard';
import Pagination from '@/components/common/Pagination';
import { AlertTriangle, ClipboardList, RefreshCw, SearchX, Plus } from 'lucide-react';

export const TaskList = () => {
  const {
    tasks,
    pagination,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    priorityFilter,
    fetchTasks,
    openCreateModal,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setPage,
  } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-52 bg-white border border-slate-200 rounded-2xl p-5 animate-pulse flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded-full w-1/3"></div>
              <div className="h-5 bg-slate-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/80 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto my-8 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-[1.8]" />
        <h3 className="text-lg font-bold text-red-900">Failed to Load Tasks</h3>
        <p className="text-sm text-red-700 mt-1 mb-5">{error}</p>
        <button
          onClick={() => fetchTasks()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >

          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    const hasActiveFilters = searchQuery || statusFilter !== 'all' || priorityFilter !== 'all';

    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-sm">
        {hasActiveFilters ? (
          <>
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Matching Tasks Found</h3>
            <p className="text-xs text-slate-500 mt-1.5 mb-5 leading-relaxed">
              We couldn't find any tasks matching your current search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Tasks Created Yet</h3>
            <p className="text-xs text-slate-500 mt-1.5 mb-5 leading-relaxed">
              Get started by creating your first task or using AI to generate subtasks automatically!
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default TaskList;


