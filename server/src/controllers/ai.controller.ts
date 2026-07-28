import { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/ai.service';

export const getTaskSuggestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suggestion = await aiService.generateTaskSuggestion(req.body);
    res.status(200).json({
      success: true,
      data: suggestion,
    });
  } catch (error) {
    next(error);
  }
};
