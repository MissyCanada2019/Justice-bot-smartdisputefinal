import { NextRequest, NextResponse } from 'next/server';
import { summarizeLitigationLaw } from '@/ai/flows/summarize-litigation-law';

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

    const result = await summarizeLitigationLaw({ provinceOrTerritory });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in summarize-litigation-law API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}