import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
