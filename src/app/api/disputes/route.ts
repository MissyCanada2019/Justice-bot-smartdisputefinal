
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
// This is a secure way to access Firebase services from the server-side.
if (!getApps().length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
  );
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the user's token to ensure they are authenticated
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const formData = await request.formData();
    const caseName = formData.get('caseName') as string;
    const caseClassification = formData.get('caseClassification') as string;
    const disputeDetails = formData.get('disputeDetails') as string;
    const files = formData.getAll('files') as File[];

    if (!caseName || !caseClassification || !disputeDetails || files.length === 0) {
      return NextResponse.json({ error: 'Missing required fields or files.' }, { status: 400 });
    }

    // 1. Create a new dispute document in Firestore
    const disputeRef = await db.collection('disputes').add({
      userId: userId,
      caseName: caseName,
      caseClassification: caseClassification,
      disputeDetails: disputeDetails,
      createdAt: new Date().toISOString(),
      status: 'submitted',
      meritScore: null, // To be assessed later
    });

    // 2. For simplicity, we'll just record the filenames for now.
    // In a real app, you would upload these files to Firebase Storage.
    const documentReferences = files.map(file => ({
      disputeId: disputeRef.id,
      userId: userId,
      fileName: file.name,
      fileType: file.type,
      createdAt: new Date().toISOString(),
      storagePath: `users/${userId}/disputes/${disputeRef.id}/${file.name}` // Example path
    }));

    // Save document references to Firestore in a batch
    const batch = db.batch();
    documentReferences.forEach(doc => {
        const docRef = db.collection('documents').doc(); // Auto-generate ID
        batch.set(docRef, doc);
    });
    await batch.commit();


    return NextResponse.json({ 
        message: 'Dispute submitted successfully!',
        disputeId: disputeRef.id,
        documentCount: files.length,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in dispute submission:', error);
    if (error.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Authentication token has expired. Please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to submit dispute.', details: error.message }, { status: 500 });
  }
}
