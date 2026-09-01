import { Router } from 'express';
import { getPromoMessages } from './promo.controller.js';

const router = Router();

router.get('/', getPromoMessages);

export default router;
