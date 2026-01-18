import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { sendChatMessage } from '../services/openaiService.js';
export const createChat = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId: req.userId },
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
    }
    catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
};
export const getChats = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId: req.userId },
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
    }
    catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
};
export const getChatById = async (req, res) => {
    try {
        const id = req.params.id;
        const chat = await prisma.chat.findFirst({
            where: {
                id,
                project: { userId: req.userId },
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
    }
    catch (error) {
        console.error('Get chat error:', error);
        res.status(500).json({ error: 'Failed to fetch chat' });
    }
};
export const sendMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { chatId, content } = req.body;
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                project: { userId: req.userId },
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
                chatId: chatId,
                role: 'user',
                content,
            },
        });
        // Get system prompt
        const systemPrompt = chat.project.prompts.find((p) => p.role === 'system')?.content;
        // Format messages with proper type assertion
        const messages = chat.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        messages.push({ role: 'user', content });
        // Get AI response
        const aiResponse = await sendChatMessage(messages, systemPrompt);
        // Save assistant message
        const assistantMessage = await prisma.message.create({
            data: {
                chatId: chatId,
                role: 'assistant',
                content: aiResponse || 'No response generated',
            },
        });
        res.json({
            message: 'Message sent successfully',
            userMessage,
            assistantMessage,
        });
    }
    catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
export const deleteChat = async (req, res) => {
    try {
        const id = req.params.id;
        const chat = await prisma.chat.findFirst({
            where: {
                id,
                project: { userId: req.userId },
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
    }
    catch (error) {
        console.error('Delete chat error:', error);
        res.status(500).json({ error: 'Failed to delete chat' });
    }
};
//# sourceMappingURL=chatController.js.map