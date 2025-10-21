import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Sparkles, Zap } from 'lucide-react';
import { chatService } from '../../services/chatService.js';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { SAMPLE_QUERIES } from '../../utils/constants.js';

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! I'm your crypto assistant. Ask me about cryptocurrency prices, trends, market cap, and more!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (query) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: query,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show loading
    setIsLoading(true);

    try {
      // Call chat API
      const response = await chatService.sendQuery(query);
      
      // Add bot response
      const botMessage = {
        type: 'bot',
        text: response.response.answer,
        data: response.response.data,
        chartData: response.response.chartData,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        type: 'bot',
        text: `Sorry, I encountered an error: ${error.message}`,
        error: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuery = (query) => {
    handleSendMessage(query);
  };

  return (
    <div className="w-full bg-[#1E222D] flex flex-col h-[550px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0B0E11] border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-2">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>AI Assistant</span>
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              </h2>
              <p className="text-[10px] text-gray-400">Ask about crypto prices & trends</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
            <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-medium text-green-400">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#131722]">
        {messages.map((message, index) => (
          <div key={index} className="fade-in">
            <ChatMessage message={message} />
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-2 fade-in">
            <div className="flex-shrink-0 rounded-full p-1.5 bg-gradient-to-br from-blue-600 to-blue-700">
              <MessageCircle className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-700">
              <div className="flex items-center space-x-1">
                <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample Queries */}
      {messages.length === 1 && !isLoading && (
        <div className="px-3 pb-3 border-t border-gray-700 pt-3 bg-[#0B0E11]">
          <div className="flex items-center space-x-1.5 mb-2">
            <Zap className="h-3.5 w-3.5 text-blue-400" />
            <p className="text-[10px] font-semibold text-gray-300">Quick Actions</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_QUERIES.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(query)}
                className="text-[10px] px-2.5 py-1.5 bg-gray-800/50 hover:bg-blue-600/20 border border-gray-700 hover:border-blue-500/50 rounded-md text-gray-300 hover:text-blue-400 transition-all duration-200 font-medium"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatPanel;