import { Router } from 'express';
import * as wishlistController from './wishlist.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.toggleWishlist);
router.delete('/:productId', wishlistController.deleteWishlistItem);

export default router;
