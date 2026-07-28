'use client';

import React from 'react';
import { Subtask } from '@/types/task';
import SubtaskItem from './SubtaskItem';
import { ListChecks } from 'lucide-react';

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onToggle: (taskId: string, subtaskId: string, currentCompleted: boolean) => void;
  isParentCompleted?: boolean;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  taskId,
  subtasks,
  onToggle,
  isParentCompleted = false,
}) => {
  if (!subtasks || subtasks.length === 0) return null;

  const total = subtasks.length;
  const completedCount = subtasks.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / total) * 100);

  return (
    <div className="mb-4 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/70">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
        <div className="flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5 text-indigo-600" />
          <span>Subtasks ({completedCount}/{total})</span>
        </div>
        <span className="text-indigo-600 font-bold">{progressPercent}%</span>
      </div>

      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            progressPercent === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask._id || subtask.title}
            taskId={taskId}
            subtask={subtask}
            onToggle={onToggle}
            isParentCompleted={isParentCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default SubtaskList;

