import type { Response } from 'express';
import { validationResult } from 'express-validator';
import type { AuthRequest } from '../middleware/auth.js';
import prisma from '../config/database.js';

export const createPrompt = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { content, projectId, role } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId as string },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const prompt = await prisma.prompt.create({
      data: {
        content,
        projectId,
        role: role || 'system',
      },
    });

    res.status(201).json({
      message: 'Prompt created successfully',
      prompt,
    });
  } catch (error) {
    console.error('Create prompt error:', error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
};

export const getPrompts = async (
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

    const prompts = await prisma.prompt.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ prompts });
  } catch (error) {
    console.error('Get prompts error:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
};

export const updatePrompt = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { content, role } = req.body;

    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        project: { userId: req.userId as string },
      },
    });

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(role && { role }),
      },
    });

    res.json({
      message: 'Prompt updated successfully',
      prompt: updatedPrompt,
    });
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
};

export const deletePrompt = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        project: { userId: req.userId as string },
      },
    });

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }

    await prisma.prompt.delete({
      where: { id },
    });

    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Delete prompt error:', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
};