import { NextRequest, NextResponse } from 'next/server';
import { generateLegalGuidance, GenerateLegalGuidanceInputSchema } from '@/ai/flows/generate-legal-guidance';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedInput = GenerateLegalGuidanceInputSchema.parse(body);
    
    const result = await generateLegalGuidance(validatedInput);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate legal guidance API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate legal guidance' },
      { status: 500 }
    );
  }
}