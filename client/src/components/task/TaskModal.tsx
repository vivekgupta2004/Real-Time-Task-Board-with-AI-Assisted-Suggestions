'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import TaskForm from './TaskForm';

export const TaskModal = () => {
  const { isModalOpen, modalMode, closeModal } = useTaskStore();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {modalMode === 'create' ? 'Create New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TaskForm />
      </div>
    </div>
  );
};

export default TaskModal;
