import jwt from 'jsonwebtoken';

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET environment variable is missing');
}
if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is missing');
}

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET;
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET;

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'customer',
      name: user.name,
    },
    getAccessSecret(),
    { expiresIn: '7d' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    getRefreshSecret(),
    { expiresIn: '30d' }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, getAccessSecret());
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};

