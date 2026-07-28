'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface EditableSubtaskItemProps {
  index: number;
  title: string;
  completed: boolean;
  onTitleChange: (index: number, newTitle: string) => void;
  onToggleComplete: (index: number) => void;
  onRemove: (index: number) => void;
  readOnly?: boolean;
}

export const EditableSubtaskItem: React.FC<EditableSubtaskItemProps> = ({
  index,
  title,
  completed,
  onTitleChange,
  onToggleComplete,
  onRemove,
  readOnly = false,
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-50/80 border border-gray-200 rounded-md px-3 py-1.5 transition hover:border-indigo-300">
      <input
        type="checkbox"
        checked={completed}
        disabled={readOnly}
        onChange={() => !readOnly && onToggleComplete(index)}
        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
      />
      <input
        type="text"
        value={title}
        disabled={readOnly}
        onChange={(e) => !readOnly && onTitleChange(index, e.target.value)}
        placeholder="Enter subtask title..."
        className={`flex-1 bg-transparent text-xs text-gray-900 outline-none transition disabled:text-gray-600 ${
          completed ? 'line-through text-gray-400' : ''
        }`}
      />
      {!readOnly && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-600 transition p-1"
          title="Remove subtask"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default EditableSubtaskItem;

