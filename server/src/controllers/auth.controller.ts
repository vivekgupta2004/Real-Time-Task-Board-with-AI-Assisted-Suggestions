import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  logoutAllDevices,
} from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await registerUser(req.body);
    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: tokenInput } = req.body;
    const { accessToken, refreshToken } = await refreshTokens(tokenInput);
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await logoutUser(req.user!._id.toString());
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await logoutAllDevices(req.user!._id.toString());
    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    });
  } catch (error) {
    next(error);
  }
};
