'use client';

import React from 'react';
import { Subtask } from '@/types/task';
import { Check } from 'lucide-react';

interface SubtaskItemProps {
  taskId: string;
  subtask: Subtask;
  onToggle: (taskId: string, subtaskId: string, currentCompleted: boolean) => void;
  isParentCompleted?: boolean;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({
  taskId,
  subtask,
  onToggle,
  isParentCompleted = false,
}) => {
  const isCompleted = subtask.completed;

  const handleClick = () => {
    if (!isParentCompleted && subtask._id) {
      onToggle(taskId, subtask._id, isCompleted);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-150 group ${
        isParentCompleted ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
      } ${
        isCompleted
          ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          : 'bg-gray-50/70 border-gray-200/80 text-gray-800 hover:bg-indigo-50/60 hover:border-indigo-300'
      }`}
    >
      <div
        className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 ${
          isCompleted
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'border-gray-400 bg-white group-hover:border-indigo-500'
        }`}
      >
        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>

      <span
        className={`text-xs font-medium leading-tight select-none transition ${
          isCompleted ? 'line-through text-emerald-800/70' : 'text-gray-800'
        }`}
      >
        {subtask.title}
      </span>
    </div>
  );
};

export default SubtaskItem;

