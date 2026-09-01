import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../../config/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async ({ name, email, phone, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash,
      provider: 'email',
      role: 'customer',
    },
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

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, token, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (dbErr) {
    console.error('Login DB query error:', dbErr);
    const serverErr = new Error('Server temporarily unavailable, please try again');
    serverErr.isServerError = true;
    throw serverErr;
  }

  if (!user) {
    const authErr = new Error('Invalid email or password');
    authErr.isCredentialError = true;
    throw authErr;
  }

  if (!user.passwordHash || user.provider === 'google') {
    const authErr = new Error("This account was created with Google Sign-In. Please use 'Continue with Google' to sign in.");
    authErr.isCredentialError = true;
    throw authErr;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    const authErr = new Error('Invalid email or password');
    authErr.isCredentialError = true;
    throw authErr;
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    provider: user.provider,
    createdAt: user.createdAt,
  };

  const token = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  return { user: userPayload, token, refreshToken };
};

export const googleAuth = async (credential) => {
  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    // If audience check fails or verification fails in dev without env vars
    console.error('Google token verification error:', err);
    throw new Error('Invalid Google ID token');
  }

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Google payload missing email');
  }

  const { email, name, picture } = payload;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name || 'Google User',
        email,
        avatar: picture || null,
        provider: 'google',
        passwordHash: null,
        role: 'customer',
      },
    });
  } else if (!user.avatar && picture) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { avatar: picture },
    });
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    provider: user.provider,
    createdAt: user.createdAt,
  };

  const token = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  return { user: userPayload, token, refreshToken };
};

export const refreshTokens = async (token) => {
  const decoded = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw new Error('User not found');
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
  };

  const newAccessToken = generateAccessToken(userPayload);
  const newRefreshToken = generateRefreshToken(userPayload);

  return { token: newAccessToken, refreshToken: newRefreshToken };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
      provider: true,
      createdAt: true,
      addresses: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
