import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
export declare const uploadFile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFiles: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteFile: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=fileController.d.ts.map