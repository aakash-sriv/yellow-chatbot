import React, { useEffect, useState, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { chatAPI } from '../../services/api';
import type { Message } from '../../types';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  chatId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getById(chatId);
      setMessages(response.data.chat.messages || []);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    setSending(true);
    try {
      const response = await chatAPI.sendMessage(chatId, content);
      setMessages([
        ...messages,
        response.data.userMessage,
        response.data.assistantMessage,
      ]);
      toast.success('Message sent!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="text-center  mt-12">
            <p className="text-xl mb-2">No messages yet</p>
            <p className="text-sm">Start a conversation with your AI assistant!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} loading={sending} />
    </div>
  );
};
