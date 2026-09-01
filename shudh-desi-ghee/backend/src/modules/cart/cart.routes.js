import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.deleteCartItem);
router.delete('/', cartController.clearCart);

export default router;
