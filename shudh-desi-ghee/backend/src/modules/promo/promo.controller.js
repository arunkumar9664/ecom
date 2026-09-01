import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getPromoMessages = async (req, res) => {
  try {
    const promoMessages = await prisma.promoMessage.findMany({
      orderBy: { order: 'asc' },
    });
    return sendSuccess(res, 200, { promoMessages }, 'Promo messages fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
