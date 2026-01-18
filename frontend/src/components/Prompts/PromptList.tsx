import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CreatePrompt } from './CreatePrompt';
import { promptAPI } from '../../services/api';
import type { Prompt } from '../../types';
import toast from 'react-hot-toast';

interface PromptListProps {
  projectId: string;
}

export const PromptList: React.FC<PromptListProps> = ({ projectId }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPrompts = async () => {
    try {
      const response = await promptAPI.getByProject(projectId);
      setPrompts(response.data.prompts);
    } catch (error) {
      toast.error('Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await promptAPI.delete(id);
        toast.success('Prompt deleted');
        fetchPrompts();
      } catch (error) {
        toast.error('Failed to delete prompt');
      }
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [projectId]);

  if (loading) {
    return <div className="text-center py-4">Loading prompts...</div>;
  }

  return (
    <div className=" rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold ">System Prompts</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-[#464E45] text-[#87BCAB] rounded-lg hover:bg-[#87BCAB] hover:text-[#464E45] transition text-sm"
        >
          <Plus size={16} />
          <span>Add Prompt</span>
        </button>
      </div>

      {prompts.length === 0 ? (
        <p className=" text-center py-4">
          No prompts yet. Create one to customize your AI!
        </p>
      ) : (
        <div className="space-y-3">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border  rounded-lg p-4 hover:border-[#87BCAB] transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-2 py-1 bg-blue-100  text-xs font-semibold rounded">
                  {prompt.role.toUpperCase()}
                </span>
                <button
                  onClick={() => handleDelete(prompt.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className=" whitespace-pre-wrap">{prompt.content}</p>
              <p className="text-xs  mt-2">
                Created {new Date(prompt.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreatePrompt
          projectId={projectId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchPrompts}
        />
      )}
    </div>
  );
};
