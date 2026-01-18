import React from 'react';
import { Bot, User } from 'lucide-react';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-[#464E45]' : ''
          }`}
        >
          {isUser ? <User size={18} className="text-[#87BCAB]" /> : <Bot size={18} className="text-[#87BCAB]" />}
        </div>

        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-[#464E45] text-[#87BCAB] rounded-br-none'
              : '  rounded-bl-none'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <p className={`text-xs mt-1 ${isUser ? '' : ''}`}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};
