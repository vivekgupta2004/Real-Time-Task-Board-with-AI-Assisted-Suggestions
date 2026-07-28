'use client';

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { Calendar, Clock, CheckCircle2, Pencil, Trash2, Check } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { openEditModal, openDeleteModal, completeTask } = useTaskStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompleted = task.status === 'completed';

  const formatLocalDateTime = (dateStr?: string | null): string => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeTask(task._id);
      toast.success(`Task "${task.title}" completed!`);
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to complete task';
      toast.error(errorMsg);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {task.status}
          </span>

          <div className="flex items-center gap-2">
            {task.priority && (
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  task.priority === 'high'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : task.priority === 'medium'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {task.priority}
              </span>
            )}

            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEditModal(task)}
                className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                title="Edit Task"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => openDeleteModal(task)}
                className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{task.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1" title="Due Date">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Due: {formatLocalDateTime(task.dueDate)}</span>
          </div>

          {!isCompleted && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-md text-xs font-medium shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCompleting ? 'Completing...' : 'Complete'}</span>
            </button>
          )}
        </div>

        {isCompleted && task.completedAt && (
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed on: {formatLocalDateTime(task.completedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
