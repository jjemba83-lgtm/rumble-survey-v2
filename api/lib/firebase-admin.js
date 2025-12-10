// Firebase Admin SDK Configuration
// Used for backend/serverless function operations
import admin from 'firebase-admin';

let db = null;

function getFirestoreDb() {
  if (db) {
    return db;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Firebase Admin: Missing environment variables');
    return null;
  }

  // Handle different private key formats
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    db = admin.firestore();
    return db;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    return null;
  }
}

export { getFirestoreDb };
