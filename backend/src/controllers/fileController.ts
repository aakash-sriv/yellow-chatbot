import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { uploadFileToGemini } from '../services/openaiService.js';

export const uploadFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const { projectId } = req.body;

    if (!projectId) {
      res.status(400).json({ error: 'Project ID is required' });
      return;
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId as string },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Upload to Gemini
    const geminiFileUri = await uploadFileToGemini(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Save file metadata to database
    const file = await prisma.file.create({
      data: {
        projectId,
        filename: req.file.originalname,
        fileUrl: geminiFileUri,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        openaiFileId: geminiFileUri, // Store Gemini URI here too
      },
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file,
    });
  } catch (error: any) {
    console.error('Upload file error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message 
    });
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

    // Note: Gemini files auto-delete after 48 hours
    // No need to manually delete from Gemini

    await prisma.file.delete({
      where: { id },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};