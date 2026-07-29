'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { taskFormSchema, TaskFormData, validateAiTitle, validateAiDescription } from '@/utils/task.validation';
import { useTaskStore } from '@/store/useTaskStore';
import { generateAISubtasksApi } from '@/services/ai.service';
import { Subtask } from '@/types/task';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AISubtaskButton from './AISubtaskButton';
import AISubtaskPreview from './AISubtaskPreview';
import { Lock, Loader2 } from 'lucide-react';

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
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastAiInput, setLastAiInput] = useState<{ title: string; description: string } | null>(null);

  const isReadOnly = modalMode === 'edit' && selectedTask?.status === 'completed';
  const minDateTime = formatForDateTimeLocal(new Date().toISOString());

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const watchTitle = watch('title');
  const watchDescription = watch('description');

  const isAiDisabled =
    isReadOnly ||
    isAiLoading ||
    !watchTitle ||
    watchTitle.trim().length === 0 ||
    !watchDescription ||
    watchDescription.trim().length === 0;

  useEffect(() => {
    if (modalMode === 'edit' && selectedTask) {
      reset({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority || 'medium',
        dueDate: formatForDateTimeLocal(selectedTask.dueDate),
      });
      // Clone subtasks to isolate modal draft changes from global store
      const clonedSubtasks = selectedTask.subtasks
        ? selectedTask.subtasks.map((s) => ({ ...s }))
        : [];
      setSubtasks(clonedSubtasks);
      setLastAiInput(null);
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
      setSubtasks([]);
      setLastAiInput(null);
    }
  }, [modalMode, selectedTask, reset]);


  const handleSuggestSubtasks = async () => {
    if (isReadOnly || isAiLoading) return;

    const isTitleValid = validateAiTitle(watchTitle);
    const isDescValid = validateAiDescription(watchDescription);

    if (!isTitleValid || !isDescValid) {
      toast.error('Please provide a proper Title and Description to generate AI subtasks.');
      return;
    }

    if (subtasks.length > 0) {
      toast('Subtasks have already been generated for this task.', { icon: 'ℹ️' });
      return;
    }

    const currentTitle = watchTitle.trim();
    const currentDesc = watchDescription.trim();

    setIsAiLoading(true);
    try {
      const generated = await generateAISubtasksApi({
        title: currentTitle,
        description: currentDesc,
      });

      if (generated && generated.length > 0) {
        setSubtasks(generated.map((s) => ({ title: s.title, completed: false })));
        setLastAiInput({ title: currentTitle, description: currentDesc });
        toast.success(`Generated ${generated.length} AI subtask suggestions!`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to generate AI subtasks';
      toast.error(errorMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubtaskTitleChange = (index: number, newTitle: string) => {
    if (isReadOnly) return;
    const updated = [...subtasks];
    updated[index].title = newTitle;
    setSubtasks(updated);
  };

  const handleToggleSubtask = (index: number) => {
    if (isReadOnly) return;
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index: number) => {
    if (isReadOnly) return;
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleAddSubtask = () => {
    if (isReadOnly) return;
    setSubtasks([...subtasks, { title: '', completed: false }]);
  };

  const onSubmit = async (data: TaskFormData) => {
    if (isReadOnly) {
      closeModal();
      return;
    }

    if (isAiLoading || isSubmitting) {
      return;
    }

    try {
      const validSubtasks = subtasks.filter((s) => s.title.trim().length > 0);

      if (modalMode === 'edit' && selectedTask) {
        const isTitleSame = data.title.trim() === selectedTask.title.trim();
        const isDescSame = data.description.trim() === selectedTask.description.trim();
        const isPrioritySame = (data.priority || 'medium') === (selectedTask.priority || 'medium');
        const isDueDateSame = formatForDateTimeLocal(data.dueDate) === formatForDateTimeLocal(selectedTask.dueDate);

        const existingSubtasks = selectedTask.subtasks || [];
        const isSubtasksSame =
          validSubtasks.length === existingSubtasks.length &&
          validSubtasks.every(
            (st, idx) =>
              st.title === existingSubtasks[idx]?.title && !!st.completed === !!existingSubtasks[idx]?.completed
          );

        if (isTitleSame && isDescSame && isPrioritySame && isDueDateSame && isSubtasksSame) {
          toast('No changes detected.', { icon: 'ℹ️' });
          closeModal();
          return;
        }
      }

      if (modalMode === 'create') {
        await createTask({ ...data, subtasks: validSubtasks });
        toast.success('Task created successfully!');
      } else if (modalMode === 'edit' && selectedTask) {
        await updateTask(selectedTask._id, { ...data, subtasks: validSubtasks });
        toast.success('Task updated successfully!');
      }
    } catch (error: any) {
      const errorMsg = error.message || error.errors?.[0]?.message || 'Operation failed';
      toast.error(errorMsg);
    }
  };

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs font-medium text-amber-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>This task is completed and read-only. Editing is disabled.</span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Task Details</label>
          {!isReadOnly && (
            <AISubtaskButton
              onClick={handleSuggestSubtasks}
              isLoading={isAiLoading}
              disabled={isAiDisabled}
            />
          )}
        </div>

        <Input
          label="Title"
          placeholder="Enter task title"
          disabled={isReadOnly || isAiLoading}
          {...register('title')}
          error={errors.title?.message}
        />
      </div>

      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          disabled={isReadOnly || isAiLoading}
          placeholder="Enter task description"
          className={`w-full px-3 py-2 border rounded-md outline-none transition text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed ${
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
            disabled={isReadOnly || isAiLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none transition text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
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
          disabled={isReadOnly || isAiLoading}
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />
      </div>

      <AISubtaskPreview
        subtasks={subtasks}
        onTitleChange={handleSubtaskTitleChange}
        onToggleComplete={handleToggleSubtask}
        onRemove={handleRemoveSubtask}
        onAddSubtask={handleAddSubtask}
        readOnly={isReadOnly || isAiLoading}
      />

      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
        {isAiLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-indigo-600" />
            <span>Generating AI subtasks, please wait...</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={isAiLoading || isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <Button
              type="submit"
              isLoading={isSubmitting || isAiLoading}
              disabled={isSubmitting || isAiLoading}
              className="w-auto px-6"
            >
              {isAiLoading
                ? 'Generating...'
                : modalMode === 'create'
                ? 'Create Task'
                : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default TaskForm;


