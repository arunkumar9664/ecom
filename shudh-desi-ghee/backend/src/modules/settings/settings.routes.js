import { Router } from 'express';
import { getStoreSettings } from './settings.controller.js';

const router = Router();

router.get('/', getStoreSettings);

export default router;
