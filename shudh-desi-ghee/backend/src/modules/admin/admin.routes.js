import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { requireAdmin } from '../../middleware/adminAuth.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// PUBLIC ADMIN AUTH LOGIN (NO AUTH MIDDLEWARE REQUIRED)
router.post('/login', adminRateLimiter, adminController.adminLogin);

// PROTECTED ADMIN ROUTES (Require valid admin JWT)
router.get('/verify', requireAdmin, adminController.verifyAdmin);

// Products
router.post('/products', requireAdmin, adminController.createProduct);
router.put('/products/:id', requireAdmin, adminController.updateProduct);
router.delete('/products/:id', requireAdmin, adminController.deleteProduct);

// Categories
router.post('/categories', requireAdmin, adminController.createCategory);
router.put('/categories/:id', requireAdmin, adminController.updateCategory);
router.delete('/categories/:id', requireAdmin, adminController.deleteCategory);

// Hero Slides
router.put('/hero-slides', requireAdmin, adminController.updateHeroSlides);
router.post('/hero-slides', requireAdmin, adminController.addHeroSlide);
router.delete('/hero-slides/:id', requireAdmin, adminController.deleteHeroSlide);

// Promo Messages
router.put('/promo-messages', requireAdmin, adminController.updatePromoMessages);
router.post('/promo-messages', requireAdmin, adminController.addPromoMessage);
router.delete('/promo-messages/:id', requireAdmin, adminController.deletePromoMessage);

// Orders
router.get('/orders', requireAdmin, adminController.getAllOrders);
router.put('/orders/:id/status', requireAdmin, adminController.updateOrderStatus);
router.put('/orders/:id/cancel', requireAdmin, adminController.cancelAdminOrder);

// Discount Codes
router.get('/discounts', requireAdmin, adminController.getAllDiscountCodes);
router.post('/discounts', requireAdmin, adminController.addDiscountCode);
router.put('/discounts/:code', requireAdmin, adminController.updateDiscountCode);
router.delete('/discounts/:code', requireAdmin, adminController.deleteDiscountCode);

// Store Settings
router.put('/store-settings', requireAdmin, adminController.updateStoreSettings);

// Registered Customers
router.get('/customers', requireAdmin, adminController.getAllCustomers);

export default router;
