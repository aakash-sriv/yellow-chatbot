import React from 'react';
import { Navbar } from '../components/Layout/Navbar';
import { ProjectList } from '../components/Projects/ProjectList';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectList />
      </div>
    </div>
  );
};
