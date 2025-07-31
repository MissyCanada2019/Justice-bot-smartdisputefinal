import { NextRequest, NextResponse } from 'next/server';
import { findPrecedents } from '@/ai/flows/find-precedents-flow';

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

    const result = await findPrecedents({ caseClassification, disputeDetails });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in find-precedents API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}