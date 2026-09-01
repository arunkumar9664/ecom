import { Router } from 'express';
import { uploadImage } from './upload.controller.js';
import { requireAdmin } from '../../middleware/adminAuth.js';
import { uploadMiddleware } from '../../middleware/upload.js';

const router = Router();

router.post('/', requireAdmin, uploadMiddleware.any(), uploadImage);

export default router;
