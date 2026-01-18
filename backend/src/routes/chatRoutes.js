import express from 'express';
import { createChat, getChats, getChatById, sendMessage, deleteChat, } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';
import { messageValidation } from '../utils/validators.js';
const router = express.Router();
router.use(authMiddleware);
router.post('/', createChat);
router.get('/project/:projectId', getChats);
router.get('/:id', getChatById);
router.post('/message', messageValidation, sendMessage);
router.delete('/:id', deleteChat);
export default router;
//# sourceMappingURL=chatRoutes.js.map