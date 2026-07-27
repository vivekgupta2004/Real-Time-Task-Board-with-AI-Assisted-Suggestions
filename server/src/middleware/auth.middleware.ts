import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AppError } from '../utils/appError';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token is missing', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      throw new AppError('Invalid or expired access token', 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found or unauthenticated', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
