import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

export const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Unauthorized: Admin token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (decoded.role !== 'admin') {
      return sendError(res, 403, 'Forbidden: Admin access required');
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('🔒 requireAdmin verification error:', error.message);
    return sendError(res, 401, 'Unauthorized: Invalid or expired admin token');
  }
};
