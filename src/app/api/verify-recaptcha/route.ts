import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/ai/flows/verify-recaptcha';

export async function POST(request: NextRequest) {
  try {
    const { token, expectedAction } = await request.json();
    
    // If no token provided, skip reCAPTCHA verification (for domains not configured)
    if (!token) {
      return NextResponse.json({
        isValid: true,
        score: 1.0,
        reason: 'reCAPTCHA verification skipped - not configured for this domain'
      });
    }

    // If reCAPTCHA site key is not configured, skip verification
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      return NextResponse.json({
        isValid: true,
        score: 1.0,
        reason: 'reCAPTCHA verification skipped - site key not configured'
      });
    }

    const verification = await verifyRecaptchaToken({
      token,
      expectedAction: expectedAction || 'LOGIN'
    });
    
    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error verifying recaptcha:', error);
    // Return success to allow authentication to proceed when reCAPTCHA fails
    return NextResponse.json({
      isValid: true,
      score: 0.8,
      reason: 'reCAPTCHA verification failed, proceeding without verification'
    });
  }
}