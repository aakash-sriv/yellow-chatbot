import { body } from 'express-validator';
export const registerValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name').optional().trim().isLength({ min: 1 }),
];
export const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];
export const projectValidation = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Project name is required'),
    body('description').optional().trim(),
];
export const promptValidation = [
    body('content').trim().notEmpty().withMessage('Prompt content is required'),
    body('projectId').isUUID().withMessage('Valid project ID is required'),
    body('role')
        .optional()
        .isIn(['system', 'user', 'assistant'])
        .withMessage('Role must be system, user, or assistant'),
];
export const messageValidation = [
    body('chatId').isUUID().withMessage('Valid chat ID is required'),
    body('content').trim().notEmpty().withMessage('Message content is required'),
];
//# sourceMappingURL=validators.js.map