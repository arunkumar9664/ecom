import prisma, { withQueryTimeout } from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await withQueryTimeout(
      () => prisma.category.findMany(),
      8000,
      'GET /api/categories'
    );
    return sendSuccess(res, 200, { categories }, 'Categories fetched successfully');
  } catch (error) {
    console.error('🔥 GET /api/categories error:', error?.message || error, error?.stack || '');
    if (error.isTimeout || error.message?.includes('timeout')) {
      return sendError(res, 503, 'Database query timeout after 8s');
    }
    return sendError(res, 500, error.message);
  }
};
