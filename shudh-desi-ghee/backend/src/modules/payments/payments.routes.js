import { Router } from 'express';
import { createRazorpayOrder, verifyPaymentSignature } from './payments.controller.js';
import { paymentRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/create-order', paymentRateLimiter, createRazorpayOrder);
router.post('/verify', paymentRateLimiter, verifyPaymentSignature);

export default router;
