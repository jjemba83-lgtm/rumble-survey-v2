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
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Firebase Admin: Missing environment variables');
    console.error('  FIREBASE_PROJECT_ID:', projectId ? 'set' : 'MISSING');
    console.error('  FIREBASE_CLIENT_EMAIL:', clientEmail ? 'set' : 'MISSING');
    console.error('  FIREBASE_PRIVATE_KEY:', privateKey ? 'set' : 'MISSING');
    return null;
  }

  // Initialize only once
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
}

export { getFirestoreDb };
