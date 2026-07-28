import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from '../config/firebase';
import { emitToUser } from '../socket/socket';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: string;
}

export const createNotification = async (params: CreateNotificationParams): Promise<void> => {
  const { userId, title, message, type } = params;

  try {
    const db = getDb();
    if (db) {
      await db.collection('notifications').add({
        userId,
        title,
        message,
        type,
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Failed to store notification in Firestore:', error);
  }

  try {
    emitToUser(userId, 'notification:new', {
      title,
      message,
      type,
    });
  } catch (error) {
    console.error('Failed to emit notification socket event:', error);
  }
};
