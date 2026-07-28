'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export const DeleteConfirmationModal = () => {
  const { isDeleteModalOpen, taskToDelete, deleteTask, isSubmitting, closeDeleteModal } = useTaskStore();

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete._id);
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to delete task';
      toast.error(errorMsg);
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-2 text-rose-600">
      <AlertTriangle className="w-5 h-5" />
      <h2 className="text-lg font-extrabold text-slate-900">Delete Task</h2>
    </div>
  );

  return (
    <Modal
      isOpen={isDeleteModalOpen && Boolean(taskToDelete)}
      onClose={closeDeleteModal}
      title={modalTitle}
      maxWidth="max-w-md"
    >
      <p className="text-sm text-slate-600 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-900">&quot;{taskToDelete?.title}&quot;</span>? This action cannot be undone.
      </p>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={closeDeleteModal}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition flex items-center gap-2 shadow-sm"
        >
          {isSubmitting ? 'Deleting...' : 'Delete Task'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;

