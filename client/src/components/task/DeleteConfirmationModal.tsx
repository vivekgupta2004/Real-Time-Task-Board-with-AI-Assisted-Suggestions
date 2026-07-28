'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import toast from 'react-hot-toast';

export const DeleteConfirmationModal = () => {
  const { isDeleteModalOpen, taskToDelete, deleteTask, isSubmitting, closeDeleteModal } = useTaskStore();

  if (!isDeleteModalOpen || !taskToDelete) return null;

  const handleDelete = async () => {
    try {
      await deleteTask(taskToDelete._id);
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to delete task';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-900">Delete Task</h2>
          </div>
          <button
            onClick={closeDeleteModal}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-900">&quot;{taskToDelete.title}&quot;</span>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-md transition flex items-center gap-2"
          >
            {isSubmitting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
