import * as admin from "firebase-admin";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../serviceAccountKey.json";

let db: Firestore | null = null;

export const initializeFirebase = (): Firestore => {
  if (db) return db;

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
      });
    }

    db = getFirestore();

    console.log("✅ Firebase Admin initialized");

    return db;
  } catch (error) {
    console.error("❌ Firebase Initialization Error");
    console.error(error);
    throw error;
  }
};

export const getDb = (): Firestore => {
  return initializeFirebase();
};

export default admin;