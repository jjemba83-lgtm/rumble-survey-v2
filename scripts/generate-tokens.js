#!/usr/bin/env node
/**
 * Token Generation Script for Rumble Survey
 *
 * This script reads a CSV of clients and creates invitation tokens.
 * Uses clientId as the token (if provided) or generates UUIDs.
 *
 * Usage:
 *   node scripts/generate-tokens.js input.csv [--upload]
 *
 * Input CSV format (columns):
 *   clientId (optional - used as token if provided, otherwise UUID generated)
 *   email, phone, name, firstName, lastName, location, memberStatus
 *   (Only email OR phone is required, others are optional)
 *
 * Output:
 *   - Creates 'output-with-tokens.csv' with 'token' and 'survey_link' columns
 *   - If --upload flag is used, also uploads to Firebase Firestore
 *
 * Environment Variables (for --upload):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 *   SURVEY_BASE_URL (optional, defaults to https://your-survey.vercel.app)
 */

import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Check if we should upload to Firebase
const args = process.argv.slice(2);
const shouldUpload = args.includes('--upload');
const inputFile = args.find(arg => !arg.startsWith('--'));

if (!inputFile) {
  console.log(`
Usage: node scripts/generate-tokens.js <input.csv> [--upload]

Options:
  --upload    Upload tokens to Firebase Firestore

Input CSV columns:
  - clientId (optional - used as token if provided, otherwise UUID is generated)
  - email (required if no phone)
  - phone (required if no email)
  - name, firstName, lastName (optional)
  - location (optional)
  - memberStatus (optional)

Example:
  node scripts/generate-tokens.js clients.csv
  node scripts/generate-tokens.js clients.csv --upload
  `);
  process.exit(1);
}

// Base URL for survey links
const SURVEY_BASE_URL = process.env.SURVEY_BASE_URL || 'https://your-survey.vercel.app';

// Simple CSV parser
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  return lines.slice(1).map(line => {
    // Handle quoted values with commas
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/['"]/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/['"]/g, ''));

    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row;
  });
}

// Generate CSV output
function generateCSV(data, headers) {
  const headerLine = headers.join(',');
  const rows = data.map(row =>
    headers.map(h => {
      const value = row[h] || '';
      // Quote values that contain commas
      return value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );
  return [headerLine, ...rows].join('\n');
}

async function main() {
  console.log('🎫 Rumble Survey Token Generator\n');

  // Read input CSV
  const inputPath = resolve(process.cwd(), inputFile);
  console.log(`📂 Reading: ${inputPath}`);

  let csvContent;
  try {
    csvContent = readFileSync(inputPath, 'utf-8');
  } catch (err) {
    console.error(`❌ Error reading file: ${err.message}`);
    process.exit(1);
  }

  const clients = parseCSV(csvContent);
  console.log(`📋 Found ${clients.length} clients\n`);

  if (clients.length === 0) {
    console.error('❌ No clients found in CSV');
    process.exit(1);
  }

  // Check if clientId column exists
  const hasClientId = clients.some(c => c.clientid || c.clientId || c.client_id || c.id);
  if (hasClientId) {
    console.log('✓ Using clientId column as token\n');
  } else {
    console.log('✓ No clientId column found - generating UUIDs\n');
  }

  // Generate tokens for each client
  const invitations = clients.map(client => {
    // Use clientId if available, otherwise generate UUID
    const clientId = client.clientid || client.clientId || client.client_id || client.id || '';
    const token = clientId || randomUUID();

    return {
      ...client,
      token,
      survey_link: `${SURVEY_BASE_URL}/?token=${token}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  });

  console.log(`✨ Prepared ${invitations.length} invitations\n`);

  // Output CSV with tokens
  const outputHeaders = [
    'clientid', 'email', 'phone', 'name', 'firstname', 'lastname',
    'location', 'memberstatus', 'token', 'survey_link'
  ];

  const outputCSV = generateCSV(invitations, outputHeaders);
  const outputPath = resolve(process.cwd(), 'output-with-tokens.csv');
  writeFileSync(outputPath, outputCSV);
  console.log(`📄 Output saved: ${outputPath}`);

  // Upload to Firebase if requested
  if (shouldUpload) {
    console.log('\n☁️  Uploading to Firebase...\n');

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.error('❌ Missing Firebase environment variables:');
      console.error('   FIREBASE_PROJECT_ID:', projectId ? '✓' : '✗');
      console.error('   FIREBASE_CLIENT_EMAIL:', clientEmail ? '✓' : '✗');
      console.error('   FIREBASE_PRIVATE_KEY:', privateKey ? '✓' : '✗');
      console.error('\nSet these environment variables and try again.');
      console.error('Or manually import the CSV via Firebase Console.');
      process.exit(1);
    }

    // Handle private key format
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');

    // Dynamic import for firebase-admin (ES modules)
    const admin = (await import('firebase-admin')).default;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    const db = admin.firestore();
    let batch = db.batch();

    let batchCount = 0;
    let totalWritten = 0;

    for (const invitation of invitations) {
      // Use token (which is clientId or UUID) as document ID
      const docRef = db.collection('invitations').doc(String(invitation.token));
      batch.set(docRef, {
        clientId: invitation.clientid || invitation.token,
        email: invitation.email || null,
        phone: invitation.phone || null,
        name: invitation.name || null,
        firstName: invitation.firstname || invitation.firstName || null,
        lastName: invitation.lastname || invitation.lastName || null,
        location: invitation.location || null,
        memberStatus: invitation.memberstatus || invitation.memberStatus || null,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      batchCount++;

      // Firestore batches limited to 500 operations
      if (batchCount >= 500) {
        await batch.commit();
        totalWritten += batchCount;
        console.log(`   Uploaded ${totalWritten}/${invitations.length}...`);
        batch = db.batch(); // Create new batch
        batchCount = 0;
      }
    }

    // Commit remaining
    if (batchCount > 0) {
      await batch.commit();
      totalWritten += batchCount;
    }

    console.log(`\n✅ Uploaded ${totalWritten} invitations to Firebase!`);
  }

  console.log('\n🎉 Done!\n');
  console.log('Next steps:');
  console.log('1. Open output-with-tokens.csv in Google Sheets');
  console.log('2. Use GMass or ClubReady to send emails/texts with the survey_link column');
  if (!shouldUpload) {
    console.log('3. Run with --upload flag to also upload tokens to Firebase');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
