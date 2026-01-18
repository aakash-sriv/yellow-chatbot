import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, loading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t  p-4 ">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-6 py-2 bg-[#464E45] text-[#87BCAB] rounded-lg hover:bg-[#87BCAB] hover:text-[#464E45] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Send size={18} />
          <span>{loading ? 'Sending...' : 'Send'}</span>
        </button>
      </div>
    </form>
  );
};
