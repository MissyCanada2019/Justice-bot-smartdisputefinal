import { NextRequest, NextResponse } from 'next/server';
import { generateLegalForm, GenerateLegalFormInputSchema } from '@/ai/flows/generate-legal-form';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedInput = GenerateLegalFormInputSchema.parse(body);
    
    const result = await generateLegalForm(validatedInput);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate legal form API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate legal form' },
      { status: 500 }
    );
  }
}