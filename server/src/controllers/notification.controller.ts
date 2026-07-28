import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id.toString();
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json({
      status: 'success',
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id.toString();
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await notificationService.markNotificationRead(userId, id);
    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id.toString();
    await notificationService.markAllNotificationsRead(userId);
    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
