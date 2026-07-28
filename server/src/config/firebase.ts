import * as admin from 'firebase-admin';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { AppError } from '../utils/appError';

let db: Firestore | null = null;

const parsePrivateKey = (rawKey: string): string => {
  let key = rawKey.trim();

  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  return key.replace(/\\n/g, '\n').trim();
};

export const initializeFirebase = (): Firestore => {
  if (db) return db;

  try {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !rawPrivateKey) {
        throw new AppError(
          'Missing Firebase environment variables. Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env',
          500
        );
      }

      const privateKey = parsePrivateKey(rawPrivateKey);

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    db = getFirestore();
    console.log('✅ Firebase Admin initialized using environment variables');
    return db;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('❌ Firebase Admin Initialization Error:', error);
    throw new AppError('Failed to initialize Firebase Admin SDK', 500);
  }
};

export const getDb = (): Firestore => {
  return initializeFirebase();
};

export default admin;