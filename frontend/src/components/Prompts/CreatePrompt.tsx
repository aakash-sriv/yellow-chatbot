import React, { useState } from 'react';
import { X } from 'lucide-react';
import { promptAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface CreatePromptProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePrompt: React.FC<CreatePromptProps> = ({
  projectId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    role: 'system',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await promptAPI.create({ ...formData, role: 'system', projectId });
      toast.success('Prompt created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold ">Create Prompt</h2>
          <button
            onClick={onClose}
            className=" hover: transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selection removed as per user request */}

          <div>
            <label className="block text-sm font-medium  mb-2">
              Prompt Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="You are a helpful AI assistant that..."
              rows={8}
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border   rounded-lg hover: transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#464E45] text-[#87BCAB] rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
