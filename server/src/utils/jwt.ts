import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable is missing');
  }
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
  return jwt.sign({ userId }, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
};

export const generateRefreshToken = (userId: string, tokenVersion: number): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is missing');
  }
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  return jwt.sign({ userId, tokenVersion }, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable is missing');
  }
  return jwt.verify(token, secret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is missing');
  }
  return jwt.verify(token, secret) as RefreshTokenPayload;
};
