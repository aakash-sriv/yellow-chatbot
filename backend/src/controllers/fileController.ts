import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import prisma from '../config/database.js';

export const uploadFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // File upload logic would go here
    // For now, returning a placeholder
    res.status(501).json({ 
      error: 'File upload not implemented yet',
      message: 'This feature requires AWS S3 or similar storage setup'
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const getFiles = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId as string },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const files = await prisma.file.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

export const deleteFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const file = await prisma.file.findFirst({
      where: {
        id,
        project: { userId: req.userId as string },
      },
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    await prisma.file.delete({
      where: { id },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};