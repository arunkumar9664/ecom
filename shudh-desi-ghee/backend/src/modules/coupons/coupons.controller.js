import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;

    if (!code) {
      return sendError(res, 400, 'Coupon code is required');
    }

    const uppercaseCode = code.toUpperCase().trim();
    const discount = await prisma.discountCode.findUnique({
      where: { code: uppercaseCode },
    });

    if (!discount || !discount.isActive) {
      return sendError(res, 400, 'Invalid or inactive promo code');
    }

    const subtotal = Number(cartSubtotal) || 0;
    if (subtotal < discount.minSpend) {
      return sendError(
        res,
        400,
        `Code ${discount.code} requires a minimum order value of ₹${discount.minSpend.toLocaleString('en-IN')}`
      );
    }

    const discountAmount = Math.round((subtotal * discount.discountPercent) / 100);

    return sendSuccess(
      res,
      200,
      {
        valid: true,
        code: discount.code,
        discountPercent: discount.discountPercent,
        discountAmount,
        description: discount.description,
      },
      `Coupon ${discount.code} applied!`
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getActiveCoupons = async (req, res) => {
  try {
    const discounts = await prisma.discountCode.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 200, { discounts }, 'Active coupons fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
