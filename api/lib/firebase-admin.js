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

  // Debug logging
  console.log('Firebase Admin Init:');
  console.log('  FIREBASE_PROJECT_ID:', projectId ? `set (${projectId})` : 'MISSING');
  console.log('  FIREBASE_CLIENT_EMAIL:', clientEmail ? `set (${clientEmail.substring(0, 20)}...)` : 'MISSING');
  console.log('  FIREBASE_PRIVATE_KEY:', privateKey ? `set (${privateKey.substring(0, 50)}...)` : 'MISSING');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Firebase Admin: Missing environment variables - running in mock mode');
    return null;
  }

  // Handle different private key formats
  // Remove surrounding quotes if present
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  // Convert escaped newlines to actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  console.log('  Private key format check:');
  console.log('    Starts with BEGIN:', privateKey.includes('-----BEGIN PRIVATE KEY-----'));
  console.log('    Ends with END:', privateKey.includes('-----END PRIVATE KEY-----'));

  try {
    // Initialize only once
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('  Firebase Admin initialized successfully!');
    }

    db = admin.firestore();
    return db;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    return null;
  }
}

export { getFirestoreDb };
