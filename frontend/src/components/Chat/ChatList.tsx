import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { chatAPI } from '../../services/api';
import type { Chat } from '../../types';
import toast from 'react-hot-toast';

interface ChatListProps {
  projectId: string;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onChatCreated: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  projectId,
  selectedChatId,
  onSelectChat,
  onChatCreated,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getByProject(projectId);
      setChats(response.data.chats);
    } catch (error) {
      toast.error('Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await chatAPI.create(projectId);
      toast.success('New chat created');
      await fetchChats();
      onSelectChat(response.data.chat.id);
      onChatCreated();
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat?')) {
      try {
        await chatAPI.delete(chatId);
        toast.success('Chat deleted');
        fetchChats();
        if (selectedChatId === chatId) {
          onSelectChat('');
        }
      } catch (error) {
        toast.error('Failed to delete chat');
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, [projectId]);

  if (loading) {
    return <div className="p-4 text-center ">Loading chats...</div>;
  }

  return (
    <div className=" border-r  h-full flex flex-col">
      <div className="p-4 border-b ">
        <button
          onClick={handleCreateChat}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#464E45] text-[#87BCAB] rounded-lg hover:bg-[#87BCAB] hover:text-[#464E45] transition"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center  py-8 px-4">
            No chats yet. Create one to start!
          </p>
        ) : (
          chats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-4 border-b  cursor-pointer hover: transition flex items-center justify-between ${selectedChatId === chat.id ? 'bg-[#87BCAB] border-l-4 border-l-[#464E45]' : ''
                }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <MessageSquare size={18} className="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium  truncate">
                    Chat {index + 1}
                  </p>
                  <p className="text-xs ">
                    {chat._count?.messages || 0} messages
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
