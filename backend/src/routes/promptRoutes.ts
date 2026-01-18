import express from 'express';
import {
  createPrompt,
  getPrompts,
  updatePrompt,
  deletePrompt,
} from '../controllers/promptController.js';
import { authMiddleware } from '../middleware/auth.js';
import { promptValidation } from '../utils/validators.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', promptValidation, createPrompt);
router.get('/project/:projectId', getPrompts);
router.put('/:id', updatePrompt);
router.delete('/:id', deletePrompt);

export default router;