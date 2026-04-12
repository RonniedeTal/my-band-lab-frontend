import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-dark-bg">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
