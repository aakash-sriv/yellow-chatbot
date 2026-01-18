import type { Response } from 'express';
import { validationResult } from 'express-validator';
import type { AuthRequest } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { sendChatMessage } from '../services/openaiService.js';

export const createChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId as string },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const chat = await prisma.chat.create({
      data: { projectId },
      include: { messages: true },
    });

    res.status(201).json({
      message: 'Chat created successfully',
      chat,
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

export const getChats = async (
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

    const chats = await prisma.chat.findMany({
      where: { projectId },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

export const getChatById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        project: { userId: req.userId as string },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        project: true,
      },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { chatId, content } = req.body;

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId as string,
        project: { userId: req.userId as string },
      },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        project: { include: { prompts: true } },
      },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        chatId: chatId as string,
        role: 'user',
        content,
      },
    });

    // Get system prompt
    const systemPrompt = chat.project.prompts.find(
      (p) => p.role === 'system'
    )?.content;

    // Get other prompts (user/assistant) to seed the conversation
    const contextPrompts = chat.project.prompts
      .filter(p => p.role !== 'system')
      .map(p => ({
        role: p.role as 'user' | 'assistant',
        content: p.content
      }));

    // Format messages with proper type assertion
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      ...contextPrompts, // Inject context prompts first
      ...chat.messages.map((m) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      }))
    ];

    messages.push({ role: 'user', content });

    // Get AI response
    const aiResponse = await sendChatMessage(messages, systemPrompt);

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        chatId: chatId as string,
        role: 'assistant',
        content: aiResponse || 'No response generated',
      },
    });

    res.json({
      message: 'Message sent successfully',
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const deleteChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        project: { userId: req.userId as string },
      },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    await prisma.chat.delete({
      where: { id },
    });

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};