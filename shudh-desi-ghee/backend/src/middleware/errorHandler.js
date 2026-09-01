import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error Handler:', err);

  if (err.name === 'ZodError') {
    return sendError(res, 400, 'Validation Error', err.errors);
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return sendError(res, 401, err.message || 'Unauthorized');
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, statusCode, message);
};
