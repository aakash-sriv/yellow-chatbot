import { body } from 'express-validator';
import type { ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').optional().trim().isLength({ min: 1 }),
];

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const projectValidation: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Project name is required'),
  body('description').optional().trim(),
];

export const promptValidation: ValidationChain[] = [
  body('content').trim().notEmpty().withMessage('Prompt content is required'),
  body('projectId').isUUID().withMessage('Valid project ID is required'),
  body('role')
    .optional()
    .isIn(['system', 'user', 'assistant'])
    .withMessage('Role must be system, user, or assistant'),
];

export const messageValidation: ValidationChain[] = [
  body('chatId').isUUID().withMessage('Valid chat ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
];