import { NextRequest, NextResponse } from 'next/server';
import { generateLegalTimeline } from '@/ai/flows/generate-legal-timeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseClassification, disputeDetails } = body;

    if (!caseClassification || !disputeDetails) {
      return NextResponse.json(
        { error: 'Case classification and dispute details are required' },
        { status: 400 }
      );
    }

    const result = await generateLegalTimeline({ caseClassification, disputeDetails });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-legal-timeline API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}