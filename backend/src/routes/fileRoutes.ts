import express from 'express';
import multer from 'multer';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, PDFs, audio, video
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'video/mp4', 'video/mpeg', 'video/quicktime'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: images, PDFs, audio, video'));
    }
  },
});

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/project/:projectId', getFiles);
router.delete('/:id', deleteFile);

export default router;