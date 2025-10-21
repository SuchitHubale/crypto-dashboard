import React from 'react';
import { AlertCircle, RefreshCw, XCircle, Info } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  type = 'error',
  title,
  actions 
}) => {
  const typeConfig = {
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      buttonBg: 'bg-red-600 hover:bg-red-700',
      defaultTitle: 'Oops! Something went wrong'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
      defaultTitle: 'Warning'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      defaultTitle: 'Information'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 fade-in">
      <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 max-w-md w-full shadow-lg`}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${config.bgColor} rounded-full p-4 shadow-md`}>
            <IconComponent className={`h-12 w-12 ${config.iconColor}`} />
          </div>
        </div>
        
        {/* Title */}
        <h3 className={`text-xl font-bold ${config.titleColor} mb-3 text-center`}>
          {title || config.defaultTitle}
        </h3>
        
        {/* Message */}
        <p className={`${config.textColor} text-center mb-6 leading-relaxed`}>
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`flex items-center justify-center space-x-2 px-6 py-3 ${config.buttonBg} text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-medium`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          )}
          
          {actions && actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-6 py-3 ${action.variant === 'secondary' 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : config.buttonBg + ' text-white'
              } rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-medium`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Additional Info */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        If the problem persists, please contact support
      </p>
    </div>
  );
};

export default ErrorMessage;