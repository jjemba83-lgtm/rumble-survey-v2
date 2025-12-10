// Survey Submission Endpoint
// POST /api/submit-survey
// Stores completed survey responses in Firebase

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

  const {
    token,
    user,
    answers,
    patterns,
    personalizedQuestion,
    personalizedResponse
  } = req.body;

  // Validate required fields
  if (!user || !answers || !patterns) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['user', 'answers', 'patterns']
    });
  }

  try {
    const db = getFirestoreDb();

    if (!db) {
      console.error('Firebase not configured - logging submission for testing');
      console.log('Survey Submission (mock mode):', {
        token,
        user,
        answers,
        patterns,
        personalizedQuestion,
        personalizedResponse,
        submittedAt: new Date().toISOString()
      });
      return res.status(200).json({
        success: true,
        mock: true,
        message: 'Mock mode - submission logged to console'
      });
    }

    const submittedAt = new Date();

    // Create submission document
    const submissionData = {
      // Link to invitation token (if provided)
      tokenId: token || null,

      // User demographics
      identifier: user.identifier || null,
      email: user.email || user.identifier || null,
      phone: user.phone || null,
      name: user.name || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      location: user.location || null,
      memberStatus: user.status || null,
      isFromUrl: user.isFromUrl || false,

      // Survey responses
      answers: answers,

      // Analyzed patterns
      patterns: {
        pricePreference: patterns.pricePreference || null,
        commitmentPreference: patterns.commitmentPreference || null,
        heroPreference: patterns.heroPreference || null,
        bookingPreference: patterns.bookingPreference || null,
        neitherCount: patterns.neitherCount || 0,
        totalChoices: patterns.totalChoices || 8,
        choiceDetails: patterns.choiceDetails || []
      },

      // Personalized follow-up
      personalizedQuestion: personalizedQuestion || null,
      personalizedResponse: personalizedResponse || null,

      // Metadata
      submittedAt: submittedAt,
      userAgent: req.headers['user-agent'] || null,
    };

    // Save submission to Firestore
    const submissionRef = await db.collection('submissions').add(submissionData);
    console.log('Survey submission saved:', submissionRef.id);

    // If token provided, mark invitation as completed
    if (token) {
      try {
        const invitationRef = db.collection('invitations').doc(token);
        const invitationDoc = await invitationRef.get();

        if (invitationDoc.exists) {
          await invitationRef.update({
            status: 'completed',
            completedAt: submittedAt,
            submissionId: submissionRef.id
          });
          console.log('Invitation marked as completed:', token);
        }
      } catch (tokenError) {
        // Don't fail the submission if token update fails
        console.error('Failed to update invitation status:', tokenError);
      }
    }

    return res.status(200).json({
      success: true,
      submissionId: submissionRef.id,
      message: 'Survey submitted successfully'
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit survey',
      details: error.message
    });
  }
}
