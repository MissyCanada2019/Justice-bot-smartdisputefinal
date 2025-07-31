import { NextRequest, NextResponse } from 'next/server';
import { summarizeFamilyLaw } from '@/ai/flows/summarize-family-law';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.provinceOrTerritory || typeof body.provinceOrTerritory !== 'string') {
      return NextResponse.json(
        { error: 'Province or territory is required' },
        { status: 400 }
      );
    }
    
    const result = await summarizeFamilyLaw(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Summarize family law API error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize family law' },
      { status: 500 }
    );
  }
}