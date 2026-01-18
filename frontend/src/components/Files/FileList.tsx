import React, { useEffect, useState } from 'react';
import { Upload, Trash2, FileText, Image, Film, Music } from 'lucide-react';
import { FileUpload } from './FileUpload';
import axios from 'axios';
import toast from 'react-hot-toast';

interface File {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface FileListProps {
  projectId: string;
}

export const FileList: React.FC<FileListProps> = ({ projectId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await axios.get(`${API_URL}/files/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFiles(response.data.files);
    } catch (error) {
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this file?')) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      await axios.delete(`${API_URL}/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('File deleted');
      fetchFiles();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} />;
    if (type.startsWith('video/')) return <Film size={20} />;
    if (type.startsWith('audio/')) return <Music size={20} />;
    return <FileText size={20} />;
  };

  if (loading) return <div className="text-center py-4">Loading files...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Files</h3>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          <Upload size={16} />
          <span>Upload File</span>
        </button>
      </div>

      {files.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No files uploaded yet</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.fileType)}
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.filename}</p>
                  <p className="text-xs text-gray-500">
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <FileUpload
          projectId={projectId}
          onClose={() => setShowUpload(false)}
          onSuccess={fetchFiles}
        />
      )}
    </div>
  );
};