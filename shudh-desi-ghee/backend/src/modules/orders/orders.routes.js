import { Router } from 'express';
import * as ordersController from './orders.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { verifyAccessToken } from '../../utils/jwt.js';
import { writeRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Optional auth helper middleware for order creation
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = verifyAccessToken(token);
    } catch (e) {
      // Ignore token verification failure for guest checkouts
    }
  }
  next();
};

router.post('/', writeRateLimiter, optionalAuth, ordersController.createOrder);
router.get('/', requireAuth, ordersController.getUserOrders);
router.get('/:id', requireAuth, ordersController.getOrderById);
router.put('/:id/cancel', requireAuth, ordersController.cancelUserOrder);

export default router;
