import { Router } from 'express';
import { getHeroSlides } from './hero.controller.js';

const router = Router();

router.get('/', getHeroSlides);

export default router;
