import { NextRequest, NextResponse } from 'next/server';
import { analyzeLegalDocumentFlow } from '@/ai/flows/analyze-legal-document';

export async function POST(request: NextRequest) {
  try {
    const { documentText } = await request.json();
    
    if (!documentText) {
      return NextResponse.json({ error: 'Document text is required' }, { status: 400 });
    }

    const result = await analyzeLegalDocumentFlow(documentText);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing legal document:', error);
    return NextResponse.json({ error: 'Failed to analyze document' }, { status: 500 });
  }
}