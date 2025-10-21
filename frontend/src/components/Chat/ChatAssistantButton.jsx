import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import ChatPanel from './ChatPanel';

const ChatAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Chat Assistant"
      >
        <div className="relative">
          {/* Animated ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-60 group-hover:opacity-100 animate-pulse transition-opacity"></div>
          
          {/* Button */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full p-4 shadow-2xl transform transition-all duration-200 group-hover:scale-110">
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </div>

          {/* Badge */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>AI Assistant</span>
            </div>
            <div className="absolute top-full right-4 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </button>

      {/* Chat Popup Modal */}
      {isOpen && (
        <>
          {/* Semi-transparent overlay without blur */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Chat Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-full max-w-md animate-slideUp">
            <div className="bg-[#1E222D] rounded-xl shadow-2xl overflow-hidden border border-gray-700">
              <ChatPanel />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatAssistantButton;