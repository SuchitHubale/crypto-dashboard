import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-3 py-3 bg-[#0B0E11] border-t border-gray-700">
      <div className="relative">
        <div className={`flex items-end space-x-2 p-2 rounded-lg border transition-all duration-200 ${
          isFocused 
            ? 'border-blue-500 bg-gray-800/50' 
            : 'border-gray-700 bg-gray-800/30'
        }`}>
          {/* Input Field */}
          <div className="flex-1">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about crypto prices..."
              disabled={disabled}
              maxLength={maxLength}
              className="w-full px-2 py-1.5 bg-transparent border-0 focus:outline-none resize-none text-xs text-gray-100 placeholder-gray-500 disabled:opacity-50"
              style={{ minHeight: '32px', maxHeight: '100px' }}
            />
          </div>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={`flex-shrink-0 p-2 rounded-md transition-all duration-200 ${
              disabled || !input.trim()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600'
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {/* Character Counter & Hint */}
        <div className="flex items-center justify-between mt-1.5 px-1">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="h-3 w-3 text-gray-500" />
            <span className="text-[9px] text-gray-500">
              Enter to send
            </span>
          </div>
          {input.length > 0 && (
            <span className={`text-[9px] font-medium ${
              input.length > maxLength * 0.9 ? 'text-red-400' : 'text-gray-500'
            }`}>
              {input.length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChatInput;