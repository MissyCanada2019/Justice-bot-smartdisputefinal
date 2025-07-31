import { NextRequest, NextResponse } from 'next/server';
import { findCourtAndAid, FindCourtAndAidInputSchema } from '@/ai/flows/find-court-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedInput = FindCourtAndAidInputSchema.parse(body);
    
    const result = await findCourtAndAid(validatedInput);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Find court and aid API error:', error);
    return NextResponse.json(
      { error: 'Failed to find court and aid information' },
      { status: 500 }
    );
  }
}