import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { PromptList } from '../components/Prompts/PromptList';
import { ChatList } from '../components/Chat/ChatList';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { projectAPI } from '../services/api';
import type { Project } from '../types';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    if (!id) return;
    try {
      const response = await projectAPI.getById(id);
      setProject(response.data.project);
    } catch (error) {
      toast.error('Failed to fetch project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen  flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        <div className="mb-6 flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2  hover: transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="border-l  h-6"></div>
          <h1 className="text-3xl font-bold ">{project.name}</h1>
        </div>

        <div className="mb-6">
          <PromptList projectId={project.id} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px] w-full">
          <div className="lg:col-span-1 rounded-xl shadow-md overflow-hidden min-w-0">
            <ChatList
              projectId={project.id}
              selectedChatId={selectedChatId}
              onSelectChat={setSelectedChatId}
              onChatCreated={() => { }}
            />
          </div>

          <div className="lg:col-span-3 rounded-xl shadow-md overflow-hidden min-w-0">
            {selectedChatId ? (
              <ChatInterface chatId={selectedChatId} />
            ) : (
              <div className="flex items-center justify-center h-full ">
                <div className="text-center">
                  <p className="text-xl mb-2">No chat selected</p>
                  <p className="text-sm">Create or select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
