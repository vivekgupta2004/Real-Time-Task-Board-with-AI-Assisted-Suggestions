import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <span className="mt-3 text-sm font-medium text-gray-600">Verifying Session...</span>
    </div>
  );
};

export default LoadingScreen;
