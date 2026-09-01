import prisma, { withQueryTimeout } from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getHeroSlides = async (req, res) => {
  try {
    const heroSlides = await withQueryTimeout(
      () => prisma.heroSlide.findMany({
        orderBy: { order: 'asc' },
      }),
      8000,
      'GET /api/hero-slides'
    );
    return sendSuccess(res, 200, { heroSlides }, 'Hero slides fetched successfully');
  } catch (error) {
    console.error('🔥 GET /api/hero-slides error:', error?.message || error, error?.stack || '');
    if (error.isTimeout || error.message?.includes('timeout')) {
      return sendError(res, 503, 'Database query timeout after 8s');
    }
    return sendError(res, 500, error.message);
  }
};
