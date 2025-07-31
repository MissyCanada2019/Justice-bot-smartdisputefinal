import { NextRequest, NextResponse } from 'next/server';
import { summarizeCriminalLaw } from '@/ai/flows/summarize-criminal-law';

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
    
    const result = await summarizeCriminalLaw(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Summarize criminal law API error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize criminal law' },
      { status: 500 }
    );
  }
}