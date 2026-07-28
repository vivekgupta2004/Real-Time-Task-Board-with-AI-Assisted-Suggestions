'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AISubtaskButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const AISubtaskButton: React.FC<AISubtaskButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition duration-150 cursor-pointer"
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      )}
      <span>{isLoading ? 'Generating AI Subtasks...' : 'Suggest Subtasks'}</span>
    </button>
  );
};

export default AISubtaskButton;
