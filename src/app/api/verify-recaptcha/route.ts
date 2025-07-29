import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/ai/flows/verify-recaptcha';

export async function POST(request: NextRequest) {
  try {
    const { token, expectedAction } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const verification = await verifyRecaptchaToken({ 
      token,
      expectedAction: expectedAction || 'LOGIN'
    });
    
    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error verifying recaptcha:', error);
    return NextResponse.json({ 
      isValid: false, 
      score: 0, 
      reason: 'Server error during verification' 
    }, { status: 500 });
  }
}