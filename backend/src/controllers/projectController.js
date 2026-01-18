import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
export const createProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { name, description } = req.body;
        const project = await prisma.project.create({
            data: {
                name,
                description: description || null,
                userId: req.userId,
            },
        });
        res.status(201).json({
            message: 'Project created successfully',
            project,
        });
    }
    catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};
export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: { userId: req.userId },
            include: {
                _count: {
                    select: {
                        prompts: true,
                        chats: true,
                        files: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ projects });
    }
    catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
export const getProjectById = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await prisma.project.findFirst({
            where: {
                id,
                userId: req.userId,
            },
            include: {
                prompts: true,
                chats: {
                    include: {
                        _count: {
                            select: { messages: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                files: true,
            },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({ project });
    }
    catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};
export const updateProject = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;
        const project = await prisma.project.findFirst({
            where: { id, userId: req.userId },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
            },
        });
        res.json({
            message: 'Project updated successfully',
            project: updatedProject,
        });
    }
    catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};
export const deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await prisma.project.findFirst({
            where: { id, userId: req.userId },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        await prisma.project.delete({
            where: { id },
        });
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
//# sourceMappingURL=projectController.js.map