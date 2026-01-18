import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
export declare const createChat: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getChats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getChatById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const sendMessage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteChat: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=chatController.d.ts.map