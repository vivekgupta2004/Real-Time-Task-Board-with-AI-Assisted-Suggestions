'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { taskFormSchema, TaskFormData } from '@/utils/task.validation';
import { useTaskStore } from '@/store/useTaskStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const formatForDateTimeLocal = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const TaskForm = () => {
  const { modalMode, selectedTask, createTask, updateTask, isSubmitting, closeModal } = useTaskStore();

  const minDateTime = formatForDateTimeLocal(new Date().toISOString());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (modalMode === 'edit' && selectedTask) {
      reset({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority || 'medium',
        dueDate: formatForDateTimeLocal(selectedTask.dueDate),
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [modalMode, selectedTask, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (modalMode === 'create') {
        await createTask(data);
        toast.success('Task created successfully!');
      } else if (modalMode === 'edit' && selectedTask) {
        await updateTask(selectedTask._id, data);
        toast.success('Task updated successfully!');
      }
    } catch (error: any) {
      const errorMsg = error.message || error.errors?.[0]?.message || 'Operation failed';
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Enter task title"
        {...register('title')}
        error={errors.title?.message}
      />

      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          placeholder="Enter task description"
          className={`w-full px-3 py-2 border rounded-md outline-none transition text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 ${
            errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
          {...register('description')}
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none transition text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500"
            {...register('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Input
          label="Due Date"
          type="datetime-local"
          min={minDateTime}
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
        >
          Cancel
        </button>
        <Button type="submit" isLoading={isSubmitting} className="w-auto px-6">
          {modalMode === 'create' ? 'Create Task' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
