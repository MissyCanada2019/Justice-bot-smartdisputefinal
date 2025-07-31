import { NextRequest, NextResponse } from 'next/server';
import { assessDisputeMerit, AssessDisputeMeritInputSchema } from '@/ai/flows/assess-dispute-merit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedInput = AssessDisputeMeritInputSchema.parse(body);
    
    const result = await assessDisputeMerit(validatedInput);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Assess dispute merit API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess dispute merit' },
      { status: 500 }
    );
  }
}