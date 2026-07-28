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
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isButtonDisabled}
      title={disabled ? 'Enter both title and description to generate AI subtasks.' : 'Click to generate AI subtasks'}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 ${
        isButtonDisabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 opacity-70 shadow-none'
          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white cursor-pointer hover:from-purple-700 hover:to-indigo-700 hover:shadow-md'
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
      ) : (
        <Sparkles className={`w-3.5 h-3.5 ${disabled ? 'text-gray-400' : 'text-amber-300 animate-pulse'}`} />
      )}
      <span>{isLoading ? 'Generating Subtasks...' : 'Suggest Subtasks'}</span>
    </button>
  );
};

export default AISubtaskButton;

