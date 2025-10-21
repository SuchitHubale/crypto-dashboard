import React from 'react';
import { Bot, User, AlertCircle } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex items-start space-x-2 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 rounded-lg p-1.5 ${
          isBot 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
            : 'bg-gradient-to-br from-gray-600 to-gray-700'
        }`}>
          {isBot ? (
            <Bot className="h-3.5 w-3.5 text-white" />
          ) : (
            <User className="h-3.5 w-3.5 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col space-y-1">
          <div className={`rounded-xl px-3 py-2 ${
            message.error
              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
              : isBot 
                ? 'bg-gray-800/50 text-gray-100 border border-gray-700' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
          }`}>
            {message.error && (
              <div className="flex items-center space-x-1.5 mb-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                <span className="text-[10px] font-semibold text-red-400">Error</span>
              </div>
            )}
            <p className="text-xs leading-relaxed whitespace-pre-line">{message.text}</p>
          </div>
          
          {/* Timestamp */}
          <p className={`text-[9px] px-2 ${isBot ? 'text-gray-500' : 'text-gray-500 text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;