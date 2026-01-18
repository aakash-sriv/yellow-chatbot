import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
export declare const createPrompt: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPrompts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePrompt: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePrompt: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=promptController.d.ts.map