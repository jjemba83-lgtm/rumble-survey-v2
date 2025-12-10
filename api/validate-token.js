// Token Validation Endpoint
// POST /api/validate-token
// Validates a survey invitation token and returns client info

import { getFirestoreDb } from './lib/firebase-admin.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const db = getFirestoreDb();

    if (!db) {
      console.error('Firebase not configured - returning mock response for testing');
      // Mock mode for testing without Firebase
      return res.status(200).json({
        valid: true,
        mock: true,
        client: {
          email: 'test@example.com',
          name: 'Test User',
          location: 'Montclair',
        },
        message: 'Mock mode - Firebase not configured'
      });
    }

    // Look up token in invitations collection
    const invitationRef = db.collection('invitations').doc(token);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return res.status(404).json({
        valid: false,
        error: 'Invalid invitation token'
      });
    }

    const invitation = invitationDoc.data();

    // Check if already completed
    if (invitation.status === 'completed') {
      return res.status(410).json({
        valid: false,
        error: 'This survey has already been completed',
        completedAt: invitation.completedAt?.toDate?.() || invitation.completedAt
      });
    }

    // Check if expired (optional - if you set expiration dates)
    if (invitation.expiresAt) {
      const expiresAt = invitation.expiresAt.toDate ? invitation.expiresAt.toDate() : new Date(invitation.expiresAt);
      if (expiresAt < new Date()) {
        return res.status(410).json({
          valid: false,
          error: 'This invitation has expired'
        });
      }
    }

    // Token is valid - return client info
    return res.status(200).json({
      valid: true,
      client: {
        email: invitation.email || null,
        phone: invitation.phone || null,
        name: invitation.name || null,
        firstName: invitation.firstName || null,
        lastName: invitation.lastName || null,
        location: invitation.location || null,
        memberStatus: invitation.memberStatus || null,
      }
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(500).json({
      error: 'Failed to validate token',
      details: error.message
    });
  }
}
