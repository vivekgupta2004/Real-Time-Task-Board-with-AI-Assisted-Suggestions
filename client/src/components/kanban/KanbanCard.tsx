'use client';

import React from 'react';
import { Task, Subtask, TaskStatus } from '@/types/task';
import { useTaskStore } from '@/store/useTaskStore';
import toast from 'react-hot-toast';
import {
  Calendar,
  CheckCircle2,
  ListChecks,
  Pencil,
  Trash2,
  GripVertical,
  Check,
} from 'lucide-react';

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
}

const getPriorityStyle = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'medium':
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'low':
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
};

const formatDateWithDot = (dateStr?: string | Date | null): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';

  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, '0');

  return `${day} ${month} ${year} • ${formattedHours}:${minutes} ${ampm}`;
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onDragStart }) => {
  const { openEditModal, openDeleteModal, updateTask, toggleSubtask, isSubmitting } = useTaskStore();

  const subtasks: Subtask[] = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  const isCompleted = task.status === 'completed';
  const isPending = task.status === 'pending';

  const handleStatusSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newStatus = e.target.value as TaskStatus;
    if (newStatus === task.status) return;

    try {
      await updateTask(task._id, { status: newStatus });
      toast.success(
        newStatus === 'completed'
          ? 'Task marked as Completed!'
          : `Status changed to ${newStatus === 'in_progress' ? 'In Progress' : 'Pending'}`
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update status';
      toast.error(msg);
    }
  };

  return (
    <div
      draggable={!isSubmitting}
      onDragStart={(e) => onDragStart(e, task)}
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing ${
        isCompleted
          ? 'border-emerald-200/90 dark:border-emerald-900/60 bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md border ${getPriorityStyle(
            task.priority
          )}`}
        >
          {task.priority || 'medium'}
        </span>

        <div className="flex items-center gap-1.5">
          <select
            value={task.status}
            onChange={handleStatusSelect}
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg border outline-none cursor-pointer bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 shadow-2xs transition"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 cursor-grab ml-0.5" />
        </div>
      </div>

      {/* Title */}
      <h4
        onClick={() => openEditModal(task)}
        className={`text-sm font-bold leading-snug cursor-pointer transition ${
          isCompleted
            ? 'line-through text-slate-500 dark:text-slate-400'
            : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Dates Section */}
      <div className="mt-3 space-y-1 border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[11px]">
        {task.dueDate && (
          <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              <strong className="font-bold text-slate-800 dark:text-slate-200">Due: </strong>
              {formatDateWithDot(task.dueDate)}
            </span>
          </div>
        )}

        {isCompleted && task.completedAt && (
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              <strong className="font-bold">Completed: </strong>
              {formatDateWithDot(task.completedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Subtasks Section */}
      {totalSubtasks > 0 && (
        <div className="mt-3 bg-slate-50/90 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{completedSubtasks} / {totalSubtasks} Completed</span>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{subtaskProgress}%</span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2.5">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                subtaskProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
            {subtasks.map((st) => (
              <div
                key={st._id || st.title}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPending && !st.completed) {
                    toast.error('Move this task to In Progress before completing subtasks.');
                    return;
                  }
                  if (!isCompleted && st._id) {
                    toggleSubtask(task._id, st._id, !st.completed);
                  }
                }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border transition-all duration-150 ${
                  isCompleted || (isPending && !st.completed)
                    ? 'cursor-not-allowed opacity-80'
                    : 'cursor-pointer hover:bg-slate-100/90 dark:hover:bg-slate-800'
                } ${
                  st.completed
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 shrink-0 ${
                    st.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isPending
                      ? 'border-slate-300 bg-slate-100 cursor-not-allowed'
                      : 'border-slate-400 bg-white dark:bg-slate-900'
                  }`}
                >
                  {st.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <span
                  className={`text-xs font-semibold leading-tight select-none truncate ${
                    st.completed ? 'line-through text-emerald-800 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1">
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(task);
              }}
              className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Edit Task"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(task);
            }}
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
