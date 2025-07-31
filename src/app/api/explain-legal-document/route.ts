import { NextRequest, NextResponse } from 'next/server';
import { explainLegalDocument } from '@/ai/flows/explain-legal-document';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentText } = body;

    if (!documentText) {
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400 }
      );
    }

    const result = await explainLegalDocument({ documentText });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in explain-legal-document API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}