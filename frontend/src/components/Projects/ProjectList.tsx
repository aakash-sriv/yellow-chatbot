import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { CreateProject } from './CreateProject';
import { projectAPI } from '../../services/api';
import type { Project } from '../../types';
import toast from 'react-hot-toast';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data.projects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold ">My Projects</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#464E45] text-[#87BCAB] rounded-lg hover:opacity-90 transition"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className=" text-lg mb-4">No projects yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#464E45] text-[#87BCAB] rounded-lg hover:opacity-90 transition"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={fetchProjects}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProject
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
};
