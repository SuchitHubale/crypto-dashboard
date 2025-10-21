import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const Loader = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeConfig = {
    sm: {
      spinner: 'h-8 w-8',
      icon: 'h-4 w-4',
      text: 'text-sm',
      padding: 'p-4'
    },
    md: {
      spinner: 'h-12 w-12',
      icon: 'h-6 w-6',
      text: 'text-base',
      padding: 'p-8'
    },
    lg: {
      spinner: 'h-20 w-20',
      icon: 'h-10 w-10',
      text: 'text-lg',
      padding: 'p-12'
    }
  };

  const config = sizeConfig[size];

  const LoaderContent = () => (
    <div className={`flex flex-col items-center justify-center ${config.padding} fade-in`}>
      {/* Animated Gradient Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary rounded-full blur-lg opacity-50 animate-pulse"></div>
        
        {/* Spinner */}
        <div className={`relative ${config.spinner} rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg`}>
          <Loader2 className={`${config.icon} text-white animate-spin`} />
        </div>
      </div>
      
      {/* Loading Text */}
      {text && (
        <div className="mt-6 text-center">
          <p className={`${config.text} font-semibold text-gray-900 mb-1`}>{text}</p>
          <div className="flex items-center justify-center space-x-1">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        </div>
      )}
      
      {/* Loading Dots */}
      <div className="flex items-center space-x-1 mt-4">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <LoaderContent />
        </div>
      </div>
    );
  }

  return <LoaderContent />;
};

export default Loader;