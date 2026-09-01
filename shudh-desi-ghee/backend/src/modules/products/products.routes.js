import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  submitProductReview, 
  getProductReviews 
} from './products.controller.js';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', optionalAuth, getProductReviews);
router.post('/:id/reviews', requireAuth, submitProductReview);

export default router;
