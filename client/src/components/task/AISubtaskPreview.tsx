'use client';

import React from 'react';
import { Subtask } from '@/types/task';
import EditableSubtaskItem from './EditableSubtaskItem';
import { Plus, ListChecks } from 'lucide-react';

interface AISubtaskPreviewProps {
  subtasks: Subtask[];
  onTitleChange: (index: number, newTitle: string) => void;
  onToggleComplete: (index: number) => void;
  onRemove: (index: number) => void;
  onAddSubtask: () => void;
}

export const AISubtaskPreview: React.FC<AISubtaskPreviewProps> = ({
  subtasks,
  onTitleChange,
  onToggleComplete,
  onRemove,
  onAddSubtask,
}) => {
  if (subtasks.length === 0) return null;

  return (
    <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <ListChecks className="w-4 h-4 text-indigo-600" />
          <span>Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})</span>
        </div>
        <button
          type="button"
          onClick={onAddSubtask}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subtask</span>
        </button>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {subtasks.map((subtask, index) => (
          <EditableSubtaskItem
            key={subtask._id || `subtask-${index}`}
            index={index}
            title={subtask.title}
            completed={subtask.completed}
            onTitleChange={onTitleChange}
            onToggleComplete={onToggleComplete}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default AISubtaskPreview;
