'use client';

import React, { useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import TaskCard from './TaskCard';
import { sortTasks } from '@/utils/taskSort';
import { AlertTriangle, ClipboardList, RefreshCw } from 'lucide-react';

export const TaskList = () => {
  const { tasks, isLoading, error, searchQuery, statusFilter, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedTasks = sortTasks(filteredTasks);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-48 bg-white border border-gray-200 rounded-xl p-5 animate-pulse flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto my-8">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800">Failed to Load Tasks</h3>
        <p className="text-sm text-red-600 mt-1 mb-4">{error}</p>
        <button
          onClick={fetchTasks}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (sortedTasks.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center max-w-md mx-auto my-8">
        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-800">No Tasks Found</h3>
        <p className="text-sm text-gray-500 mt-1">
          {searchQuery || statusFilter !== 'all'
            ? 'Try adjusting your search query or status filter.'
            : 'You currently have no tasks created.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedTasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
