import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../../config/db.js';
import { registerSchema, loginSchema, googleAuthSchema } from './auth.schema.js';
import * as authService from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { sendEmail } from '../../config/email.js';
import { getForgotPasswordEmailTemplate, getGoogleAccountForgotPasswordEmailTemplate } from '../../utils/emailTemplates.js';

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);
    return sendSuccess(res, 201, result, 'User registered successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);
    return sendSuccess(res, 200, result, 'Logged in successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    if (error.isCredentialError) {
      return sendError(res, 401, error.message);
    }
    console.error('Customer login error:', error);
    return sendError(res, 500, error.isServerError ? error.message : 'Server temporarily unavailable, please try again');
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = googleAuthSchema.parse(req.body);
    const result = await authService.googleAuth(credential);
    return sendSuccess(res, 200, result, 'Google login successful');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 401, error.message);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    if (!refreshToken) {
      return sendError(res, 400, 'Refresh token required');
    }
    const result = await authService.refreshTokens(refreshToken);
    return sendSuccess(res, 200, result, 'Token refreshed successfully');
  } catch (error) {
    return sendError(res, 401, error.message || 'Invalid refresh token');
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, 200, {}, 'Logged out successfully');
};

export const me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, 200, { user }, 'User details fetched');
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        provider: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, 200, { user }, 'Profile updated successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Current password and new password are required');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters long');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (!user.passwordHash || user.provider === 'google') {
      return sendError(res, 400, 'This account uses Google Sign-In and has no password to change');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return sendError(res, 400, 'Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return sendSuccess(res, 200, {}, 'Password changed successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const genericMsg = 'If an account exists for this email, a reset link has been sent';

    if (!email || typeof email !== 'string') {
      return sendSuccess(res, 200, {}, genericMsg);
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (user && user.provider === 'email' && user.passwordHash) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

      const { html, text } = getForgotPasswordEmailTemplate({ resetUrl, userName: user.name });

      // Safe fire-and-forget email dispatch
      sendEmail({
        to: user.email,
        subject: 'Reset Your Password | SURANGHI NAAR',
        html,
        text,
      }).catch((err) => console.error('Forgot password email error:', err));
    } else if (user) {
      // User exists, but is Google-only (no password hash or provider is google)
      const { html, text } = getGoogleAccountForgotPasswordEmailTemplate({ userName: user.name });

      sendEmail({
        to: user.email,
        subject: 'Google Account Sign-In Notice | SURANGHI NAAR',
        html,
        text,
      }).catch((err) => console.error('Forgot password email error:', err));
    }

    return sendSuccess(res, 200, {}, genericMsg);
  } catch (error) {
    console.error('Forgot password error:', error);
    return sendSuccess(res, 200, {}, 'If an account exists for this email, a reset link has been sent');
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendError(res, 400, 'Token and new password are required');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long');
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: String(token),
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return sendError(res, 400, 'This reset link is invalid or has expired — please request a new one');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return sendSuccess(res, 200, {}, 'Password reset successfully — please log in');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
