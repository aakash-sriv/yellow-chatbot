import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MessageSquare, FileText } from 'lucide-react';
import type { Project } from '../../types';
import { projectAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(project.id);
        toast.success('Project deleted successfully');
        onDelete();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className=" rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border "
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold ">{project.name}</h3>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 transition"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <p className=" mb-4 line-clamp-2">
        {project.description || 'No description'}
      </p>

      <div className="flex items-center space-x-4 text-sm ">
        <div className="flex items-center space-x-1">
          <MessageSquare size={16} />
          <span>{project._count?.chats || 0} chats</span>
        </div>
        <div className="flex items-center space-x-1">
          <FileText size={16} />
          <span>{project._count?.prompts || 0} prompts</span>
        </div>
      </div>

      <div className="mt-4 text-xs ">
        Created {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
