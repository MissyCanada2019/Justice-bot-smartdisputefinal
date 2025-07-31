import { NextRequest, NextResponse } from 'next/server';
import { summarizeLTBLaw } from '@/ai/flows/summarize-ltb-law';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provinceOrTerritory } = body;

    if (!provinceOrTerritory) {
      return NextResponse.json(
        { error: 'Province or territory is required' },
        { status: 400 }
      );
    }

    const result = await summarizeLTBLaw({ provinceOrTerritory });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in summarize-ltb-law API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}