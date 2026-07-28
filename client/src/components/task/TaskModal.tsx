'use client';

import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import TaskForm from './TaskForm';
import Modal from '@/components/ui/Modal';

export const TaskModal = () => {
  const { isModalOpen, modalMode, closeModal } = useTaskStore();

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={modalMode === 'create' ? 'Create New Task' : 'Edit Task'}
      maxWidth="max-w-lg"
    >
      <TaskForm />
    </Modal>
  );
};

export default TaskModal;

