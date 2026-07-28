import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from '../config/firebase';
import { emitToUser } from '../socket/socket';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const memoryNotifications: INotification[] = [];

export const createNotification = async (params: CreateNotificationParams): Promise<INotification> => {
  const { userId, title, message, type } = params;
  const now = new Date().toISOString();

  let notificationId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    const db = getDb();
    if (db) {
      const docRef = await db.collection('notifications').add({
        userId,
        title,
        message,
        type,
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });
      notificationId = docRef.id;
    }
  } catch (error) {
    console.error('Failed to store notification in Firestore:', error);
  }

  const notification: INotification = {
    _id: notificationId,
    userId,
    title,
    message,
    type,
    isRead: false,
    createdAt: now,
  };

  memoryNotifications.unshift(notification);

  try {
    emitToUser(userId, 'notification:new', notification);
  } catch (error) {
    console.error('Failed to emit notification socket event:', error);
  }

  return notification;
};

export const getUserNotifications = async (userId: string): Promise<INotification[]> => {
  try {
    const db = getDb();
    if (db) {
      const snapshot = await db
        .collection('notifications')
        .where('userId', '==', userId)
        .get();

      const items: INotification[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
        return {
          _id: doc.id,
          userId: data.userId,
          title: data.title,
          message: data.message,
          type: data.type || 'info',
          isRead: !!data.isRead,
          createdAt,
        };
      });

      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return items;
    }
  } catch (error) {
    console.error('Firestore query failed, using memory fallback:', error);
  }

  return memoryNotifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const markNotificationRead = async (userId: string, notificationId: string): Promise<void> => {
  try {
    const db = getDb();
    if (db) {
      const docRef = db.collection('notifications').doc(notificationId);
      const doc = await docRef.get();
      if (doc.exists && doc.data()?.userId === userId) {
        await docRef.update({ isRead: true });
      }
    }
  } catch (error) {
    console.error('Failed to mark notification read in Firestore:', error);
  }

  const memNotif = memoryNotifications.find((n) => n._id === notificationId && n.userId === userId);
  if (memNotif) {
    memNotif.isRead = true;
  }

  try {
    emitToUser(userId, 'notification:read', {
      userId,
      notificationId,
      isRead: true,
    });
  } catch (error) {
    console.error('Failed to emit notification:read socket event:', error);
  }
};

export const markAllNotificationsRead = async (userId: string): Promise<void> => {
  try {
    const db = getDb();
    if (db) {
      const snapshot = await db
        .collection('notifications')
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();
    }
  } catch (error) {
    console.error('Failed to mark all notifications read in Firestore:', error);
  }

  memoryNotifications.forEach((n) => {
    if (n.userId === userId) {
      n.isRead = true;
    }
  });

  try {
    emitToUser(userId, 'notification:read-all', {
      userId,
    });
  } catch (error) {
    console.error('Failed to emit notification:read-all socket event:', error);
  }
};
