import express from 'express';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();
router.use(authMiddleware);
router.post('/upload', uploadFile);
router.get('/project/:projectId', getFiles);
router.delete('/:id', deleteFile);
export default router;
//# sourceMappingURL=fileRoutes.js.map